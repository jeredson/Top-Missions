const API_BASE_URL = 'https://your-worker-name.your-subdomain.workers.dev';

export class CloudflareAPI {
  // Content Management
  static async getContent() {
    const response = await fetch(`${API_BASE_URL}/api/content`);
    return response.json();
  }

  static async saveContent(data: {
    type: string;
    title: string;
    content: string;
    metadata?: any;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Photo Management
  static async uploadPhoto(file: File, category: string = 'general') {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('category', category);

    const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  static async getPhotos() {
    const response = await fetch(`${API_BASE_URL}/api/photos`);
    return response.json();
  }
}