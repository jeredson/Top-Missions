export class LocalStorageAPI {
  // Content Management
  static async saveContent(data: {
    type: string;
    title: string;
    content: string;
    excerpt?: string;
    status?: string;
  }) {
    const contents = this.getStoredContents();
    const newContent = {
      id: Date.now().toString(),
      ...data,
      status: data.status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contents.push(newContent);
    localStorage.setItem('church_contents', JSON.stringify(contents));
    
    return { success: true, id: newContent.id };
  }

  static async getContent(type?: string) {
    const contents = this.getStoredContents();
    let filtered = contents.filter(item => item.status === 'published');
    
    if (type) {
      filtered = filtered.filter(item => item.type === type);
    }
    
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async updateContent(id: string, data: any) {
    const contents = this.getStoredContents();
    const index = contents.findIndex(item => item.id === id);
    
    if (index !== -1) {
      contents[index] = { ...contents[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('church_contents', JSON.stringify(contents));
    }
    
    return { success: true };
  }

  // Photo Management
  static async uploadPhoto(file: File, options: {
    category?: string;
    altText?: string;
    caption?: string;
  } = {}) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photos = this.getStoredPhotos();
        const newPhoto = {
          id: Date.now().toString(),
          filename: `${options.category || 'general'}/${Date.now()}-${file.name}`,
          originalName: file.name,
          category: options.category || 'general',
          altText: options.altText || '',
          caption: options.caption || '',
          url: e.target?.result as string, // Base64 data URL
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        };
        
        photos.push(newPhoto);
        localStorage.setItem('church_photos', JSON.stringify(photos));
        
        resolve({
          success: true,
          id: newPhoto.id,
          url: newPhoto.url
        });
      };
      reader.readAsDataURL(file);
    });
  }

  static async getPhotos(category?: string) {
    const photos = this.getStoredPhotos();
    let filtered = photos;
    
    if (category) {
      filtered = photos.filter(photo => photo.category === category);
    }
    
    return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  // Events Management
  static async createEvent(data: {
    title: string;
    description: string;
    eventDate: string;
    location?: string;
    category?: string;
    featuredImage?: string;
  }) {
    const events = this.getStoredEvents();
    const newEvent = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    localStorage.setItem('church_events', JSON.stringify(events));
    
    return { success: true, id: newEvent.id };
  }

  static async getEvents() {
    const events = this.getStoredEvents();
    return events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  // Helper methods
  private static getStoredContents() {
    const stored = localStorage.getItem('church_contents');
    return stored ? JSON.parse(stored) : [];
  }

  private static getStoredPhotos() {
    const stored = localStorage.getItem('church_photos');
    return stored ? JSON.parse(stored) : [];
  }

  private static getStoredEvents() {
    const stored = localStorage.getItem('church_events');
    return stored ? JSON.parse(stored) : [];
  }

  // Export/Import for backup
  static exportData() {
    return {
      contents: this.getStoredContents(),
      photos: this.getStoredPhotos(),
      events: this.getStoredEvents(),
      exportDate: new Date().toISOString()
    };
  }

  static importData(data: any) {
    if (data.contents) localStorage.setItem('church_contents', JSON.stringify(data.contents));
    if (data.photos) localStorage.setItem('church_photos', JSON.stringify(data.photos));
    if (data.events) localStorage.setItem('church_events', JSON.stringify(data.events));
  }
}