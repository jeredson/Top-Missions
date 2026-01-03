import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/contexts/ContentContext';
import { Users, Calendar, BookOpen, Camera } from 'lucide-react';
import teensImage from '@/assets/teens-camp.jpg';

const TeensPage = () => {
  const { content } = useContent();
  const { teensFellowship } = content;

  return (
    <>
      <Helmet>
        <title>Teens Fellowship - {content.church.name}</title>
        <meta name="description" content={teensFellowship.description} />
      </Helmet>

      <Header />

      <main className="pt-24">
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={teensImage}
              alt="Teens Fellowship"
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
                  <Users className="w-5 h-5 text-gold" />
                </div>
                <span className="text-gold font-medium">Ages 13-17</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
                {teensFellowship.title}
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                {teensFellowship.description}
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
                What We <span className="text-gold">Offer</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teensFellowship.activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="floating-card bg-card p-8 rounded-2xl text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-6">
                    {index === 0 && <Users className="w-8 h-8 text-foreground" />}
                    {index === 1 && <Calendar className="w-8 h-8 text-foreground" />}
                    {index === 2 && <BookOpen className="w-8 h-8 text-foreground" />}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {activity.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {activity.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Placeholder */}
        {teensFellowship.gallery.length > 0 && (
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

export default TeensPage;
