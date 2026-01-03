import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useContent } from '@/contexts/ContentContext';
import { Target, Heart, BookOpen, History } from 'lucide-react';
import pastorDavid from '@/assets/pastor-david.jpg';
import pastorSarah from '@/assets/pastor-sarah.jpg';
import pastorMichael from '@/assets/pastor-michael.jpg';

const leaderImages: { [key: string]: string } = {
  '1': pastorDavid,
  '2': pastorSarah,
  '3': pastorMichael,
};

const AboutPage = () => {
  const { content } = useContent();

  return (
    <>
      <Helmet>
        <title>About Us - {content.church.name}</title>
        <meta name="description" content={content.about.vision} />
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
                About <span className="text-gold">Our Church</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                Discover our story, mission, and the heart behind our community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vision, Mission, History */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                { icon: Target, title: 'Our Vision', content: content.about.vision },
                { icon: Heart, title: 'Our Mission', content: content.about.mission },
                { icon: History, title: 'Our History', content: content.about.history },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="floating-card bg-card p-8 rounded-2xl"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-royal-dark flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Leadership Team
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Meet Our <span className="text-primary">Pastors</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.leadership.map((leader, index) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group"
                >
                  <div className="floating-card bg-card rounded-2xl overflow-hidden text-center">
                    <div className="relative pt-8 px-8">
                      <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden ring-4 ring-gold/20 group-hover:ring-gold/40 transition-all duration-300">
                        <img
                          src={leaderImages[leader.id] || pastorDavid}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                        {leader.name}
                      </h3>
                      <p className="text-gold font-medium mb-4">{leader.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {leader.bio}
                      </p>
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

export default AboutPage;
