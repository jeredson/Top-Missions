import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';

const CTASection = () => {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Join Us This{' '}
              <span className="text-gold">Sunday</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              We'd love to welcome you to our church family. Come as you are and experience 
              the warmth of our community and the power of God's love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Visit Us</Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/services">Service Times</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gold/20">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-primary-foreground font-semibold text-lg mb-1">
                    Sunday Worship
                  </h3>
                  <p className="text-primary-foreground/70">
                    9:00 AM & 11:00 AM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gold/20">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-primary-foreground font-semibold text-lg mb-1">
                    Location
                  </h3>
                  <p className="text-primary-foreground/70">
                    {content.church.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gold/20">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-primary-foreground font-semibold text-lg mb-1">
                    Contact
                  </h3>
                  <p className="text-primary-foreground/70">
                    {content.church.phone}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
