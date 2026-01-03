import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/contexts/ContentContext';
import { Clock, MapPin, ImageIcon, Video } from 'lucide-react';
import worshipImage from '@/assets/worship-service.jpg';
import prayerImage from '@/assets/prayer-meeting.jpg';
import bibleImage from '@/assets/bible-study.jpg';
import heroImage from '@/assets/hero-church.jpg';

const serviceImages: { [key: string]: string } = {
  '1': worshipImage,
  '2': prayerImage,
  '3': bibleImage,
  '4': heroImage,
};

const ServicesPage = () => {
  const { content } = useContent();

  return (
    <>
      <Helmet>
        <title>Services - {content.church.name}</title>
        <meta name="description" content="Join us for worship services, prayer meetings, Bible study, and special events." />
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
                Our <span className="text-gold">Services</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Experience meaningful worship, powerful prayer, and life-changing Bible study with us.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {content.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="netflix-card rounded-2xl overflow-hidden h-80">
                      <img
                        src={serviceImages[service.id] || worshipImage}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">{service.time}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold-dark">
                          <MapPin className="w-5 h-5" />
                          <span className="font-medium">{service.location}</span>
                        </div>
                      </div>
                      {(service.gallery.length > 0 || service.videos.length > 0) && (
                        <div className="flex gap-4">
                          {service.gallery.length > 0 && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <ImageIcon className="w-4 h-4" />
                              <span>{service.gallery.length} Photos</span>
                            </div>
                          )}
                          {service.videos.length > 0 && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Video className="w-4 h-4" />
                              <span>{service.videos.length} Videos</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServicesPage;
