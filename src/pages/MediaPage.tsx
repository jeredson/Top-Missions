import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, Search, Calendar, User, Filter } from 'lucide-react';


const MediaPage = () => {
  const { content } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const categories = ['All', ...new Set(content.media.sermons.map((s) => s.category))];

  const filteredSermons = content.media.sermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sermon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Media - {content.church.name}</title>
        <meta name="description" content="Watch sermons, worship songs, and browse photo albums from our church community." />
      </Helmet>

      <Header />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
                Media <span className="text-gold">Library</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Watch sermons, listen to worship, and browse our photo memories.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Video Player Modal */}
        <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
          <DialogContent className="max-w-4xl p-0 bg-foreground border-0">
            <div className="aspect-video">
              <iframe
                src={playingVideo?.replace('watch?v=', 'embed/') || ''}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Sermons Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search sermons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-muted-foreground" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'royal' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sermons Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="font-display text-3xl font-bold text-foreground">
                Sermons
              </h2>
              <p className="text-muted-foreground mt-2">
                {filteredSermons.length} sermons available
              </p>
            </motion.div>

            {/* Sermons Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="netflix-card bg-card rounded-2xl overflow-hidden">
                    <div
                      className="relative h-48 cursor-pointer"
                      onClick={() => setPlayingVideo(sermon.videoUrl)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-royal-dark flex items-center justify-center">
                        <Play className="w-16 h-16 text-primary-foreground opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold text-foreground text-xs font-medium">
                        {sermon.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {sermon.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{sermon.speaker}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(sermon.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredSermons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No sermons found matching your search.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MediaPage;
