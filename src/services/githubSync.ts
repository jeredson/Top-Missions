const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'YOUR_USERNAME'; // Replace with your GitHub username
const REPO_NAME = 'digital-sanctuary-church';
const CONTENT_FILE = 'src/data/content.json';

export class GitHubSync {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async saveContent(content: any): Promise<boolean> {
    try {
      const currentFile = await this.getCurrentFile();
      
      const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_FILE}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update church content via admin panel',
          content: btoa(JSON.stringify(content, null, 2)),
          sha: currentFile.sha,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to save to GitHub:', error);
      return false;
    }
  }

  async loadContent(): Promise<any | null> {
    try {
      const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_FILE}`);
      const data = await response.json();
      
      if (data.content) {
        return JSON.parse(atob(data.content));
      }
      return null;
    } catch (error) {
      console.error('Failed to load from GitHub:', error);
      return null;
    }
  }

  private async getCurrentFile() {
    const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_FILE}`, {
      headers: {
        'Authorization': `token ${this.token}`,
      },
    });
    return response.json();
  }
}