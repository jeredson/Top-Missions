// GitHub Image Storage Service
const GITHUB_TOKEN = 'your-github-token'; // Create in GitHub Settings > Developer settings > Personal access tokens
const GITHUB_REPO = 'jeredson/Top-Missions';
const GITHUB_BRANCH = 'main';

export class GitHubImageStorage {
  static async uploadImage(file: File, category: string = 'general'): Promise<string> {
    const fileName = `images/${category}/${Date.now()}-${file.name}`;
    
    // Convert file to base64
    const base64 = await this.fileToBase64(file);
    
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add ${file.name}`,
        content: base64,
        branch: GITHUB_BRANCH
      })
    });
    
    const result = await response.json();
    return result.content.download_url; // Direct URL to image
  }
  
  static async fileToBase64(file: File): Promise<string> {
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
}