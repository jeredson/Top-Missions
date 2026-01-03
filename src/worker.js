export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Content API routes
      if (path.startsWith('/api/content')) {
        return handleContentAPI(request, env, corsHeaders);
      }
      
      // Photo API routes
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
    // Get all content
    const { results } = await env.DB.prepare('SELECT * FROM content ORDER BY updated_at DESC').all();
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (method === 'POST' && url.pathname === '/api/content') {
    // Create/Update content
    const data = await request.json();
    const { type, title, content, metadata } = data;
    
    await env.DB.prepare(`
      INSERT OR REPLACE INTO content (type, title, content, metadata, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(type, title, content, JSON.stringify(metadata)).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

async function handlePhotoAPI(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'POST' && url.pathname === '/api/photos/upload') {
    // Upload photo
    const formData = await request.formData();
    const file = formData.get('photo');
    const category = formData.get('category') || 'general';
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const fileName = `${category}/${Date.now()}-${file.name}`;
    await env.PHOTOS.put(fileName, file.stream());

    // Save photo metadata to database
    await env.DB.prepare(`
      INSERT INTO photos (filename, category, original_name, uploaded_at)
      VALUES (?, ?, ?, datetime('now'))
    `).bind(fileName, category, file.name).run();

    return new Response(JSON.stringify({ 
      success: true, 
      url: `https://your-r2-domain.com/${fileName}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (method === 'GET' && url.pathname === '/api/photos') {
    // Get all photos
    const { results } = await env.DB.prepare('SELECT * FROM photos ORDER BY uploaded_at DESC').all();
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}