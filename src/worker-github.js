export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path.startsWith('/api/content')) {
        return handleContentAPI(request, env, corsHeaders);
      }
      
      if (path.startsWith('/api/photos')) {
        return handlePhotoAPI(request, env, corsHeaders);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleContentAPI(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET' && url.pathname === '/api/content') {
    const type = url.searchParams.get('type');
    let query = 'SELECT * FROM content WHERE status = "published"';
    let params = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const { results } = await env.DB.prepare(query).bind(...params).all();
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (method === 'POST' && url.pathname === '/api/content') {
    const data = await request.json();
    const { type, title, content, excerpt, metadata, status = 'published' } = data;
    
    const result = await env.DB.prepare(`
      INSERT INTO content (type, title, content, excerpt, metadata, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(type, title, content, excerpt, JSON.stringify(metadata), status).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

async function handlePhotoAPI(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'POST' && url.pathname === '/api/photos/upload') {
    const data = await request.json();
    const { filename, url: imageUrl, category, altText, caption, originalName } = data;
    
    // Save photo metadata to database (image is stored in GitHub)
    const result = await env.DB.prepare(`
      INSERT INTO photos (filename, original_name, category, alt_text, caption, uploaded_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(filename, originalName, category, altText, caption).run();

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id,
      url: imageUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (method === 'GET' && url.pathname === '/api/photos') {
    const category = url.searchParams.get('category');
    let query = 'SELECT * FROM photos';
    let params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY uploaded_at DESC';
    
    const { results } = await env.DB.prepare(query).bind(...params).all();
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}