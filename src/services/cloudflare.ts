const API_BASE_URL = 'https://church-portfolio-api.your-subdomain.workers.dev';

export class CloudflareAPI {
  // Content Management
  static async getContent(type?: string) {
    const params = type ? `?type=${type}` : '';
    const response = await fetch(`${API_BASE_URL}/api/content${params}`);
    return response.json();
  }

  static async saveContent(data: {
    type: string;
    title: string;
    content: string;
    excerpt?: string;
    metadata?: any;
    status?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async updateContent(id: number, data: {
    title: string;
    content: string;
    excerpt?: string;
    metadata?: any;
    status?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Photo Management
  static async uploadPhoto(file: File, options: {
    category?: string;
    altText?: string;
    caption?: string;
  } = {}) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('category', options.category || 'general');
    formData.append('altText', options.altText || '');
    formData.append('caption', options.caption || '');

    const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  static async getPhotos(category?: string) {
    const params = category ? `?category=${category}` : '';
    const response = await fetch(`${API_BASE_URL}/api/photos${params}`);
    return response.json();
  }

  // Events Management
  static async getEvents() {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    return response.json();
  }

  static async createEvent(data: {
    title: string;
    description: string;
    event_date: string;
    location?: string;
    category?: string;
    featured_image?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}