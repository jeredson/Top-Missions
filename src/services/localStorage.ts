export class LocalStorageAPI {
  private static CONTENT_KEY = 'church_content_items';
  private static PHOTOS_KEY = 'church_photos';

  static async saveContent(content: any): Promise<void> {
    const existing = this.getContent();
    const newContent = {
      id: Date.now().toString(),
      ...content,
      createdAt: new Date().toISOString()
    };
    existing.push(newContent);
    localStorage.setItem(this.CONTENT_KEY, JSON.stringify(existing));
  }

  static getContent(): any[] {
    const stored = localStorage.getItem(this.CONTENT_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static async uploadPhoto(file: File, options: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = {
          id: Date.now().toString(),
          originalName: file.name,
          dataUrl: e.target?.result as string,
          ...options,
          uploadedAt: new Date().toISOString()
        };
        
        const existing = this.getPhotos();
        existing.push(photoData);
        localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(existing));
        resolve(photoData.id);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static getPhotos(): any[] {
    const stored = localStorage.getItem(this.PHOTOS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static exportData(): any {
    return {
      content: this.getContent(),
      photos: this.getPhotos(),
      exportedAt: new Date().toISOString()
    };
  }

  static importData(data: any): void {
    if (data.content) {
      localStorage.setItem(this.CONTENT_KEY, JSON.stringify(data.content));
    }
    if (data.photos) {
      localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(data.photos));
    }
  }
}