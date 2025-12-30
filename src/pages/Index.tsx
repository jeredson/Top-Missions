import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesPreview from '@/components/home/ServicesPreview';
import LeadershipSection from '@/components/home/LeadershipSection';
import YouthPreview from '@/components/home/YouthPreview';
import CTASection from '@/components/home/CTASection';
import { useContent } from '@/contexts/ContentContext';

const Index = () => {
  const { content } = useContent();

  return (
    <>
      <Helmet>
        <title>{content.church.name} - {content.church.tagline}</title>
        <meta name="description" content={`Welcome to ${content.church.name}. ${content.about.vision.slice(0, 150)}`} />
        <meta name="keywords" content="church, worship, community, faith, prayer, bible study, youth ministry" />
        <link rel="canonical" href="/" />
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        <AboutPreview />
        <ServicesPreview />
        <LeadershipSection />
        <YouthPreview />
        <CTASection />
      </main>

      <Footer />
    </>
  );
};

export default Index;
