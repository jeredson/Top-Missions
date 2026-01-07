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

  async checkForUpdates(): Promise<{ hasUpdates: boolean; content?: any }> {
    try {
      const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${CONTENT_FILE}&per_page=1`);
      const commits = await response.json();
      
      if (commits.length > 0) {
        const lastCommitDate = commits[0].commit.committer.date;
        const lastSyncDate = localStorage.getItem('last_sync_date');
        
        if (!lastSyncDate || new Date(lastCommitDate) > new Date(lastSyncDate)) {
          const content = await this.loadContent();
          return { hasUpdates: true, content };
        }
      }
      
      return { hasUpdates: false };
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return { hasUpdates: false };
    }
  }

  markSynced(): void {
    localStorage.setItem('last_sync_date', new Date().toISOString());
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