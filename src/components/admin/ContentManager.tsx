import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CloudflareAPI } from '@/services/cloudflare';

export const ContentManager = () => {
  const [content, setContent] = useState({
    type: '',
    title: '',
    content: '',
    metadata: {}
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveContent = async () => {
    setLoading(true);
    try {
      await CloudflareAPI.saveContent(content);
      alert('Content saved successfully!');
    } catch (error) {
      alert('Error saving content');
    }
    setLoading(false);
  };

  const handlePhotoUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const result = await CloudflareAPI.uploadPhoto(file, content.type);
      alert(`Photo uploaded: ${result.url}`);
    } catch (error) {
      alert('Error uploading photo');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Content Manager</h2>
      
      <div className="space-y-4">
        <Input
          placeholder="Content Type (e.g., service, event)"
          value={content.type}
          onChange={(e) => setContent({...content, type: e.target.value})}
        />
        
        <Input
          placeholder="Title"
          value={content.title}
          onChange={(e) => setContent({...content, title: e.target.value})}
        />
        
        <Textarea
          placeholder="Content"
          value={content.content}
          onChange={(e) => setContent({...content, content: e.target.value})}
          rows={6}
        />
        
        <Button onClick={handleSaveContent} disabled={loading}>
          {loading ? 'Saving...' : 'Save Content'}
        </Button>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button onClick={handlePhotoUpload} disabled={!file || loading} className="mt-2">
            {loading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>
      </div>
    </div>
  );
};