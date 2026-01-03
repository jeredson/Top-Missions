const API_BASE_URL = 'https://church-portfolio-api.your-subdomain.workers.dev';

export class CloudflareAPI {
  // Content Management (same as before)
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

  // GitHub-based Photo Management
  static async uploadPhoto(file: File, options: {
    category?: string;
    altText?: string;
    caption?: string;
  } = {}) {
    // First upload to GitHub
    const githubUrl = await this.uploadToGitHub(file, options.category || 'general');
    
    // Then save metadata to our database
    const photoData = {
      filename: `${options.category}/${Date.now()}-${file.name}`,
      url: githubUrl,
      category: options.category || 'general',
      altText: options.altText || '',
      caption: options.caption || '',
      originalName: file.name
    };

    const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photoData),
    });
    return response.json();
  }

  private static async uploadToGitHub(file: File, category: string): Promise<string> {
    const fileName = `public/images/${category}/${Date.now()}-${file.name}`;
    const base64 = await this.fileToBase64(file);
    
    // This would need a GitHub token - for demo purposes
    // In production, you'd handle this server-side
    const response = await fetch(`https://api.github.com/repos/jeredson/Top-Missions/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'token YOUR_GITHUB_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add church photo: ${file.name}`,
        content: base64,
        branch: 'main'
      })
    });
    
    const result = await response.json();
    return result.content.download_url;
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  static async getPhotos(category?: string) {
    const params = category ? `?category=${category}` : '';
    const response = await fetch(`${API_BASE_URL}/api/photos${params}`);
    return response.json();
  }
}