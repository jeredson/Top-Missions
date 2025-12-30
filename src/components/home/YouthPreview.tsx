import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Users, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import youthImage from '@/assets/youth-worship.jpg';
import teensImage from '@/assets/teens-camp.jpg';

const YouthPreview = () => {
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
            Next Generation
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Youth & Teens <span className="text-gold">Ministries</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Empowering the next generation to discover their purpose and live for Christ.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Teens Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group"
          >
            <div className="netflix-card relative h-[400px] rounded-2xl overflow-hidden">
              <img
                src={teensImage}
                alt="Teens Fellowship"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-dark via-royal-dark/50 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gold/20 backdrop-blur-sm">
                    <Users className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-gold font-medium">Ages 13-17</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-primary-foreground mb-3">
                  Teens Fellowship
                </h3>
                <p className="text-primary-foreground/80 mb-6 max-w-md">
                  Fun activities, camps, and workshops designed to help teenagers grow in faith and friendships.
                </p>
                <Button variant="hero" size="lg" asChild className="w-fit">
                  <Link to="/teens" className="flex items-center gap-2">
                    Explore Teens Ministry
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Youth Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group"
          >
            <div className="netflix-card relative h-[400px] rounded-2xl overflow-hidden">
              <img
                src={youthImage}
                alt="Youth Fellowship"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-dark via-royal-dark/50 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gold/20 backdrop-blur-sm">
                    <Flame className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-gold font-medium">Ages 18-30</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-primary-foreground mb-3">
                  Youth Fellowship
                </h3>
                <p className="text-primary-foreground/80 mb-6 max-w-md">
                  Worship nights, games, and outreach opportunities for young adults seeking purpose.
                </p>
                <Button variant="hero" size="lg" asChild className="w-fit">
                  <Link to="/youth" className="flex items-center gap-2">
                    Explore Youth Ministry
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default YouthPreview;
