import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initialContent from '@/data/content.json';
import { GitHubSync } from '@/services/githubSync';

export interface Scripture {
  id: string;
  text: string;
  reference: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  image: string;
  gallery: string[];
  videos: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
}

export interface Fellowship {
  title: string;
  description: string;
  activities: Activity[];
  gallery: string[];
  videos: string[];
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
}

export interface WorshipSong {
  id: string;
  title: string;
  artist: string;
  videoUrl: string;
  thumbnail: string;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  date: string;
  photos: string[];
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

export interface PageSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'gallery' | 'heading';
  content: string;
  order: number;
}

export interface ContentData {
  church: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
  };
  scriptures: Scripture[];
  about: {
    vision: string;
    mission: string;
    history: string;
  };
  leadership: Leader[];
  services: Service[];
  teensFellowship: Fellowship;
  youthFellowship: Fellowship;
  media: {
    sermons: Sermon[];
    worshipSongs: WorshipSong[];
    photoAlbums: PhotoAlbum[];
  };
  pages: CustomPage[];
}

interface ContentContextType {
  content: ContentData;
  updateContent: (newContent: ContentData) => void;
  syncToGitHub: () => Promise<boolean>;
  loadFromGitHub: () => Promise<void>;
  setGitHubToken: (token: string) => void;
  hasGitHubToken: boolean;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  exportContent: () => void;
  addPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'church_content';
const ADMIN_KEY = 'church_admin';
const GITHUB_TOKEN_KEY = 'github_token';

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialContent as ContentData;
      }
    }
    return initialContent as ContentData;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(ADMIN_KEY) === 'true';
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem(ADMIN_KEY, isAdmin.toString());
    if (!isAdmin) {
      setEditMode(false);
    }
  }, [isAdmin]);

  const [githubSync, setGithubSync] = useState<GitHubSync | null>(() => {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY);
    return token ? new GitHubSync(token) : null;
  });

  // Auto-sync check on app load and periodically
  useEffect(() => {
    if (!githubSync) return;

    const checkForUpdates = async () => {
      const result = await githubSync.checkForUpdates();
      if (result.hasUpdates && result.content) {
        setContent(result.content);
        githubSync.markSynced();
      }
    };

    // Check immediately
    checkForUpdates();

    // Check every 30 seconds
    const interval = setInterval(checkForUpdates, 30000);
    return () => clearInterval(interval);
  }, [githubSync]);

  const updateContent = (newContent: ContentData) => {
    setContent(newContent);
  };

  const syncToGitHub = async (): Promise<boolean> => {
    if (!githubSync) return false;
    const success = await githubSync.saveContent(content);
    if (success) {
      githubSync.markSynced();
      alert('Content synced to GitHub successfully!');
    } else {
      alert('Failed to sync to GitHub. Check your token and try again.');
    }
    return success;
  };

  const loadFromGitHub = async (): Promise<void> => {
    if (!githubSync) return;
    const githubContent = await githubSync.loadContent();
    if (githubContent) {
      setContent(githubContent);
      alert('Content loaded from GitHub!');
    } else {
      alert('Failed to load from GitHub.');
    }
  };

  const setGitHubToken = (token: string) => {
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
    setGithubSync(new GitHubSync(token));
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const addPage = (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: CustomPage = {
      ...page,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
  };

  const updatePage = (id: string, updates: Partial<CustomPage>) => {
    setContent(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === id
          ? { ...page, ...updates, updatedAt: new Date().toISOString() }
          : page
      ),
    }));
  };

  const deletePage = (id: string) => {
    setContent(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== id),
    }));
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        isAdmin,
        setIsAdmin,
        editMode,
        setEditMode,
        exportContent,
        addPage,
        updatePage,
        deletePage,
        syncToGitHub,
        loadFromGitHub,
        setGitHubToken,
        hasGitHubToken: !!githubSync,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
