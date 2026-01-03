import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocalStorageAPI } from '@/services/localStorage';

export const ContentManager = () => {
  const [content, setContent] = useState({
    type: '',
    title: '',
    content: '',
    excerpt: '',
    status: 'published'
  });
  const [file, setFile] = useState<File | null>(null);
  const [photoOptions, setPhotoOptions] = useState({
    category: 'general',
    altText: '',
    caption: ''
  });
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    loadPhotos();
    loadContents();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await LocalStorageAPI.getPhotos();
      setPhotos(result);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const loadContents = async () => {
    try {
      const result = await LocalStorageAPI.getContent();
      setContents(result);
    } catch (error) {
      console.error('Error loading contents:', error);
    }
  };

  const handleSaveContent = async () => {
    setLoading(true);
    try {
      await LocalStorageAPI.saveContent(content);
      alert('Content saved successfully!');
      setContent({ type: '', title: '', content: '', excerpt: '', status: 'published' });
      loadContents();
    } catch (error) {
      alert('Error saving content');
    }
    setLoading(false);
  };

  const handlePhotoUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const result = await LocalStorageAPI.uploadPhoto(file, photoOptions);
      alert(`Photo uploaded successfully!`);
      setFile(null);
      setPhotoOptions({ category: 'general', altText: '', caption: '' });
      loadPhotos();
    } catch (error) {
      alert('Error uploading photo');
    }
    setLoading(false);
  };

  const handleExportData = () => {
    const data = LocalStorageAPI.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        LocalStorageAPI.importData(data);
        loadContents();
        loadPhotos();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Church Content Manager</h2>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Add/Edit Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={content.type} onValueChange={(value) => setContent({...content, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Title"
                value={content.title}
                onChange={(e) => setContent({...content, title: e.target.value})}
              />
              
              <Textarea
                placeholder="Excerpt (optional)"
                value={content.excerpt}
                onChange={(e) => setContent({...content, excerpt: e.target.value})}
                rows={2}
              />
              
              <Textarea
                placeholder="Content"
                value={content.content}
                onChange={(e) => setContent({...content, content: e.target.value})}
                rows={8}
              />
              
              <Select value={content.status} onValueChange={(value) => setContent({...content, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSaveContent} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Upload Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              
              <Select value={photoOptions.category} onValueChange={(value) => setPhotoOptions({...photoOptions, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="youth">Youth</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Alt text"
                value={photoOptions.altText}
                onChange={(e) => setPhotoOptions({...photoOptions, altText: e.target.value})}
              />
              
              <Input
                placeholder="Caption (optional)"
                value={photoOptions.caption}
                onChange={(e) => setPhotoOptions({...photoOptions, caption: e.target.value})}
              />
              
              <Button onClick={handlePhotoUpload} disabled={!file || loading} className="w-full">
                {loading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {contents.map((item: any) => (
                    <div key={item.id} className="p-2 border rounded">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.type} • {item.status}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {photos.map((photo: any) => (
                    <div key={photo.id} className="p-2 border rounded">
                      <div className="font-medium">{photo.originalName}</div>
                      <div className="text-sm text-gray-500">{photo.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Export Data</h3>
                <p className="text-sm text-gray-600 mb-2">Download all your content and photos as a backup file.</p>
                <Button onClick={handleExportData} className="w-full">
                  Export All Data
                </Button>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Import Data</h3>
                <p className="text-sm text-gray-600 mb-2">Restore from a previously exported backup file.</p>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                <p><strong>Note:</strong> Data is stored locally in your browser. Use export/import to backup or transfer data between devices.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};