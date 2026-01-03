import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableText, EditableImage } from '@/components/ui/editable';
import { useContent } from '@/contexts/ContentContext';
import worshipImage from '@/assets/worship-service.jpg';
import prayerImage from '@/assets/prayer-meeting.jpg';
import bibleImage from '@/assets/bible-study.jpg';

const serviceImages: { [key: string]: string } = {
  '1': worshipImage,
  '2': prayerImage,
  '3': bibleImage,
};

const ServicesPreview = () => {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold-dark text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <EditableText
              path="services.sectionTitle"
              value="Worship With Us"
              className="inline"
            />
          </h2>
          <EditableText
            path="services.sectionDescription"
            value="Join us for meaningful worship experiences designed to draw you closer to God."
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.slice(0, 3).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="netflix-card bg-card rounded-2xl overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <EditableImage
                    path={`services.${service.id}.image`}
                    src={serviceImages[service.id] || worshipImage}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl font-semibold text-primary-foreground">
                      <EditableText
                        path={`services.${index}.title`}
                        value={service.title}
                        className="inline text-primary-foreground"
                      />
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <EditableText
                    path={`services.${index}.description`}
                    value={service.description}
                    className="text-muted-foreground mb-4 line-clamp-2"
                    multiline
                  />
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="w-4 h-4" />
                      <EditableText
                        path={`services.${index}.time`}
                        value={service.time}
                        className="inline"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <EditableText
                        path={`services.${index}.location`}
                        value={service.location}
                        className="inline"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="royal" size="lg" asChild>
            <Link to="/services" className="flex items-center gap-2">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
