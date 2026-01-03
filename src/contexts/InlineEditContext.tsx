import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useContent } from './ContentContext';

interface InlineEditContextType {
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  editingElement: string | null;
  setEditingElement: (element: string | null) => void;
  updateContent: (path: string, value: any) => void;
  uploadImage: (path: string, file: File) => void;
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined);

export const InlineEditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const { content, updateContent: updateContentContext } = useContent();

  const updateContent = (path: string, value: any) => {
    const pathArray = path.split('.');
    const newContent = { ...content };
    
    let current = newContent;
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (current[pathArray[i]] === undefined) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    updateContentContext(newContent);
  };

  const uploadImage = (path: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      updateContent(path, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <InlineEditContext.Provider value={{
      isEditMode,
      setEditMode,
      editingElement,
      setEditingElement,
      updateContent,
      uploadImage
    }}>
      {children}
    </InlineEditContext.Provider>
  );
};

export const useInlineEdit = () => {
  const context = useContext(InlineEditContext);
  if (!context) {
    throw new Error('useInlineEdit must be used within InlineEditProvider');
  }
  return context;
};