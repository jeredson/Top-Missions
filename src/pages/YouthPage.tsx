import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/contexts/ContentContext';
import { Flame, Music, Gamepad2, Camera } from 'lucide-react';
import youthImage from '@/assets/youth-worship.jpg';

const YouthPage = () => {
  const { content } = useContent();
  const { youthFellowship } = content;

  return (
    <>
      <Helmet>
        <title>Youth Fellowship - {content.church.name}</title>
        <meta name="description" content={youthFellowship.description} />
      </Helmet>

      <Header />

      <main className="pt-24">
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={youthImage}
              alt="Youth Fellowship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-royal-dark/90 to-royal/70" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-gold/20 backdrop-blur-sm">
                  <Flame className="w-5 h-5 text-gold" />
                </div>
                <span className="text-gold font-medium">Ages 18-30</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
                {youthFellowship.title}
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                {youthFellowship.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Activities */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                What We <span className="text-primary">Do</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {youthFellowship.activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="floating-card bg-card p-8 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-royal-dark flex items-center justify-center flex-shrink-0">
                      {index === 0 && <Music className="w-7 h-7 text-primary-foreground" />}
                      {index === 1 && <Gamepad2 className="w-7 h-7 text-primary-foreground" />}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Placeholder */}
        {youthFellowship.gallery.length > 0 && (
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Photo Gallery Coming Soon
                </h2>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default YouthPage;
