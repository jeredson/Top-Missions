import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { EditableText, EditableImage } from '@/components/ui/editable';
import { useContent } from '@/contexts/ContentContext';
import pastorDavid from '@/assets/pastor-david.jpg';
import pastorSarah from '@/assets/pastor-sarah.jpg';
import pastorMichael from '@/assets/pastor-michael.jpg';

const leaderImages: { [key: string]: string } = {
  '1': pastorDavid,
  '2': pastorSarah,
  '3': pastorMichael,
};

const LeadershipSection = () => {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Leadership
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <EditableText
              path="leadership.sectionTitle"
              value="Meet Our"
              className="inline"
            />{' '}
            <span className="text-primary">
              <EditableText
                path="leadership.sectionTitleHighlight"
                value="Pastors"
                className="inline"
              />
            </span>
          </h2>
          <EditableText
            path="leadership.sectionDescription"
            value="Dedicated servants of God committed to shepherding our congregation with love and wisdom."
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.leadership.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="floating-card bg-card rounded-2xl overflow-hidden text-center">
                <div className="relative pt-8 px-8">
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden ring-4 ring-gold/20 group-hover:ring-gold/40 transition-all duration-300">
                    <EditableImage
                      path={`leadership.${index}.image`}
                      src={leader.image || leaderImages[leader.id] || pastorDavid}
                      alt={leader.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Decorative glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    <EditableText
                      path={`leadership.${index}.name`}
                      value={leader.name}
                      className="inline"
                    />
                  </h3>
                  <p className="text-gold font-medium mb-4">
                    <EditableText
                      path={`leadership.${index}.role`}
                      value={leader.role}
                      className="inline"
                    />
                  </p>
                  <EditableText
                    path={`leadership.${index}.bio`}
                    value={leader.bio}
                    className="text-muted-foreground text-sm leading-relaxed"
                    multiline
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
