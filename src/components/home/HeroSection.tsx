import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import heroImage from '@/assets/hero-church.jpg';

const HeroSection = () => {
  const { content } = useContent();
  const [currentScripture, setCurrentScripture] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScripture((prev) => (prev + 1) % content.scriptures.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [content.scriptures.length]);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src={heroImage}
          alt="Church Sanctuary"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-royal/80 via-royal-dark/70 to-royal-dark/90" />
        {/* Animated Light Rays */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-gold/40 to-transparent blur-3xl transform -skew-x-12" />
          <div className="absolute top-0 right-1/3 w-64 h-full bg-gradient-to-b from-gold/20 to-transparent blur-2xl transform skew-x-12" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Welcome Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 backdrop-blur-sm border border-gold/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-sm font-medium">Welcome to Our Church</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Experience the{' '}
            <span className="text-gold">Love of God</span>
          </motion.h1>

          {/* Animated Scripture */}
          <div className="h-24 mb-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScripture}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-primary-foreground/90 text-lg md:text-xl italic font-serif mb-2">
                  "{content.scriptures[currentScripture]?.text}"
                </p>
                <p className="text-gold font-medium">
                  — {content.scriptures[currentScripture]?.reference}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scripture Indicators */}
          <div className="flex justify-center gap-2 mb-10">
            {content.scriptures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScripture(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentScripture
                    ? 'w-8 bg-gold'
                    : 'bg-primary-foreground/30 hover:bg-primary-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join Fellowship
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/media" className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Sermons
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 hover:text-gold transition-colors cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
