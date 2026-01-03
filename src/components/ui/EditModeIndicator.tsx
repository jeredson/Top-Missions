import React from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { Edit } from 'lucide-react';

export const EditModeIndicator = () => {
  const { isEditMode } = useInlineEdit();

  if (!isEditMode) return null;

  return (
    <div className="fixed top-4 left-4 z-40 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
      <Edit className="w-4 h-4" />
      <span className="text-sm font-medium">Edit Mode Active</span>
    </div>
  );
};