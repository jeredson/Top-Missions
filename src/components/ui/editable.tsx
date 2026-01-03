import React, { useState, useRef } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { Edit, Upload, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditableTextProps {
  path: string;
  value: string;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  path,
  value,
  className = '',
  multiline = false,
  placeholder = 'Click to edit...',
  children
}) => {
  const { isEditMode, editingElement, setEditingElement, updateContent } = useInlineEdit();
  const [editValue, setEditValue] = useState(value || '');
  const isEditing = editingElement === path;

  // Update editValue when value prop changes
  React.useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditMode && !isEditing) {
      setEditingElement(path);
      setEditValue(value || '');
    }
  };

  const handleSave = () => {
    updateContent(path, editValue);
    setEditingElement(null);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setEditingElement(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} min-h-[100px] text-black bg-white border-2 border-blue-500`}
            placeholder={placeholder}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} text-black bg-white border-2 border-blue-500`}
            placeholder={placeholder}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-blue-100/20 hover:outline hover:outline-2 hover:outline-blue-400 rounded transition-all relative' : 'relative'} group`}
      onClick={handleClick}
    >
      {children || value || placeholder}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-blue-500 text-white p-1 rounded-full text-xs">
            <Edit className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};

interface EditableImageProps {
  path: string;
  src: string;
  alt: string;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  path,
  src,
  alt,
  className = ''
}) => {
  const { isEditMode, uploadImage } = useInlineEdit();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditMode) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(path, file);
    }
  };

  return (
    <div className={`relative group ${isEditMode ? 'cursor-pointer' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={`${className} ${isEditMode ? 'hover:opacity-80 transition-opacity' : ''}`}
        onClick={handleClick}
      />
      {isEditMode && (
        <>
          <div 
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-50"
            onClick={handleClick}
          >
            <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
          </div>
          <div 
            className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity z-50 cursor-pointer"
            onClick={handleClick}
          >
            <Upload className="w-4 h-4" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};