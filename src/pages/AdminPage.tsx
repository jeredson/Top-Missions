import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useInlineEdit } from '@/contexts/InlineEditContext';
import { ContentManager } from '@/components/admin/ContentManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  FileText,
  Image,
  Video,
  Settings,
  Download,
  Plus,
  Save,
  ArrowLeft,
  Trash2,
  Database,
  Edit,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const { content, updateContent, isAdmin, exportContent, editMode, setEditMode } = useContent();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageContent, setNewPageContent] = useState('');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleSave = () => {
    toast({
      title: 'Changes Saved',
      description: 'Your content has been saved successfully.',
    });
  };

  const handleImageUpload = (section: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      // Update the specific image in content
      const updatedContent = { ...content };
      if (section === 'hero') {
        updatedContent.hero = { ...updatedContent.hero, backgroundImage: imageUrl };
      } else if (section.startsWith('leadership-')) {
        const index = parseInt(section.split('-')[1]);
        updatedContent.leadership[index] = { ...updatedContent.leadership[index], image: imageUrl };
      }
      updateContent(updatedContent);
      setEditingImage(null);
      toast({ title: 'Image Updated', description: 'Image has been updated successfully.' });
    };
    reader.readAsDataURL(file);
  };

  const addNewPage = () => {
    if (!newPageTitle.trim()) return;
    
    const newPage = {
      id: Date.now().toString(),
      title: newPageTitle,
      content: newPageContent,
      slug: newPageTitle.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString()
    };
    
    updateContent({
      ...content,
      pages: [...content.pages, newPage]
    });
    
    setNewPageTitle('');
    setNewPageContent('');
    toast({ title: 'Page Created', description: 'New page has been created successfully.' });
  };

  const deletePage = (pageId: string) => {
    updateContent({
      ...content,
      pages: content.pages.filter(page => page.id !== pageId)
    });
    toast({ title: 'Page Deleted', description: 'Page has been deleted successfully.' });
  };

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'content-manager', icon: Database, label: 'Content Manager' },
    { id: 'pages', icon: FileText, label: 'Pages' },
    { id: 'content', icon: FileText, label: 'Site Content' },
    { id: 'images', icon: Image, label: 'Images' },
    { id: 'media', icon: Video, label: 'Media' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </Link>

        <h1 className="font-display text-xl font-bold text-foreground mb-4">
          Admin Panel
        </h1>

        {/* Quick Edit Mode Toggle */}
        <div className="mb-6">
          <Button 
            variant={editMode ? "destructive" : "gold"} 
            className="w-full" 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {editMode ? 'Exit Edit Mode' : 'Live Edit Mode'}
          </Button>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-border space-y-3">
          <Button 
            variant={editMode ? "destructive" : "gold"} 
            className="w-full" 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {editMode ? 'Exit Edit Mode' : 'Live Edit Mode'}
          </Button>
          <Button variant="gold" className="w-full" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" className="w-full" onClick={exportContent}>
            <Download className="w-4 h-4 mr-2" />
            Export Backup
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'content-manager' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ContentManager />
          </motion.div>
        )}

        {activeTab === 'images' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Manage Images
            </h2>
            
            <div className="space-y-8">
              {/* Hero Background */}
              <Card>
                <CardHeader>
                  <CardTitle>Hero Background Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={content.hero?.backgroundImage || '/placeholder.svg'} 
                        alt="Hero background" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('hero', e)}
                        className="mb-2"
                      />
                      <Button size="sm" onClick={() => setEditingImage('hero')}>
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Leadership Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Leadership Team Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.leadership.map((leader, index) => (
                      <div key={leader.id} className="space-y-3">
                        <div className="w-full h-32 bg-gray-200 rounded overflow-hidden">
                          <img 
                            src={leader.image} 
                            alt={leader.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{leader.name}</p>
                          <p className="text-sm text-muted-foreground">{leader.role}</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(`leadership-${index}`, e)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Dashboard
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <FileText className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground">{content.pages.length}</h3>
                <p className="text-muted-foreground">Custom Pages</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <Video className="w-8 h-8 text-gold mb-4" />
                <h3 className="text-2xl font-bold text-foreground">{content.media.sermons.length}</h3>
                <p className="text-muted-foreground">Sermons</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <Image className="w-8 h-8 text-royal mb-4" />
                <h3 className="text-2xl font-bold text-foreground">{content.leadership.length}</h3>
                <p className="text-muted-foreground">Leaders</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Edit Site Content
            </h2>
            <div className="space-y-8">
              {/* Church Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Church Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Church Name</Label>
                    <Input
                      value={content.church.name}
                      onChange={(e) =>
                        updateContent({
                          ...content,
                          church: { ...content.church, name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={content.church.tagline}
                      onChange={(e) =>
                        updateContent({
                          ...content,
                          church: { ...content.church, tagline: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input
                      value={content.hero?.title || ''}
                      onChange={(e) =>
                        updateContent({
                          ...content,
                          hero: { ...content.hero, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Textarea
                      value={content.hero?.subtitle || ''}
                      onChange={(e) =>
                        updateContent({
                          ...content,
                          hero: { ...content.hero, subtitle: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vision</Label>
                    <Textarea
                      value={content.about.vision}
                      onChange={(e) =>
                        updateContent({
                          ...content,
                          about: { ...content.about, vision: e.target.value },
                        })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mission</Label>
                    <Textarea
                      value={content.about.mission}
                      onChange={(e) =>
                        updateContent({
                          ...content,
                          about: { ...content.about, mission: e.target.value },
                        })
                      }
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.services.map((service, index) => (
                    <div key={service.id} className="border p-4 rounded">
                      <div className="space-y-2">
                        <Label>Service Name</Label>
                        <Input
                          value={service.name}
                          onChange={(e) => {
                            const updatedServices = [...content.services];
                            updatedServices[index] = { ...service, name: e.target.value };
                            updateContent({ ...content, services: updatedServices });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          value={service.time}
                          onChange={(e) => {
                            const updatedServices = [...content.services];
                            updatedServices[index] = { ...service, time: e.target.value };
                            updateContent({ ...content, services: updatedServices });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) => {
                            const updatedServices = [...content.services];
                            updatedServices[index] = { ...service, description: e.target.value };
                            updateContent({ ...content, services: updatedServices });
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'pages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Pages
              </h2>
            </div>
            
            {/* Add New Page */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="Enter page title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Page Content</Label>
                  <Textarea
                    value={newPageContent}
                    onChange={(e) => setNewPageContent(e.target.value)}
                    placeholder="Enter page content"
                    rows={6}
                  />
                </div>
                <Button onClick={addNewPage} disabled={!newPageTitle.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
              </CardContent>
            </Card>

            {/* Existing Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Pages</CardTitle>
              </CardHeader>
              <CardContent>
                {content.pages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No custom pages yet. Create your first page above!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {content.pages.map((page) => (
                      <div
                        key={page.id}
                        className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{page.title}</span>
                          <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deletePage(page.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'media' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Media Library
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Sermon Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.media.sermons.map((sermon, index) => (
                  <div key={sermon.id} className="border p-4 rounded space-y-2">
                    <div className="space-y-2">
                      <Label>Sermon Title</Label>
                      <Input
                        value={sermon.title}
                        onChange={(e) => {
                          const updatedSermons = [...content.media.sermons];
                          updatedSermons[index] = { ...sermon, title: e.target.value };
                          updateContent({ 
                            ...content, 
                            media: { ...content.media, sermons: updatedSermons }
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube/Video URL</Label>
                      <Input
                        value={sermon.url}
                        onChange={(e) => {
                          const updatedSermons = [...content.media.sermons];
                          updatedSermons[index] = { ...sermon, url: e.target.value };
                          updateContent({ 
                            ...content, 
                            media: { ...content.media, sermons: updatedSermons }
                          });
                        }}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        value={sermon.date}
                        onChange={(e) => {
                          const updatedSermons = [...content.media.sermons];
                          updatedSermons[index] = { ...sermon, date: e.target.value };
                          updateContent({ 
                            ...content, 
                            media: { ...content.media, sermons: updatedSermons }
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Settings
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={content.church.phone}
                    onChange={(e) =>
                      updateContent({
                        ...content,
                        church: { ...content.church, phone: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={content.church.email}
                    onChange={(e) =>
                      updateContent({
                        ...content,
                        church: { ...content.church, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={content.church.address}
                    onChange={(e) =>
                      updateContent({
                        ...content,
                        church: { ...content.church, address: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
