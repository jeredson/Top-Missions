import { Link } from 'react-router-dom';
import { Cross, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const Footer = () => {
  const { content } = useContent();

  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/media', label: 'Media' },
    { href: '/contact', label: 'Contact' },
  ];

  const ministries = [
    { href: '/teens', label: 'Teens Fellowship' },
    { href: '/youth', label: 'Youth Fellowship' },
    { href: '/services', label: 'Bible Study' },
    { href: '/services', label: 'Prayer Meetings' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-primary-foreground/10">
                <Cross className="w-6 h-6 text-gold" />
              </div>
              <span className="font-display text-xl font-bold text-primary-foreground">
                {content.church.name}
              </span>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed">
              {content.church.tagline}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 rounded-lg bg-primary-foreground/10 hover:bg-gold hover:text-foreground transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-primary-foreground/10 hover:bg-gold hover:text-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-primary-foreground/10 hover:bg-gold hover:text-foreground transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6 text-gold">Ministries</h4>
            <ul className="space-y-3">
              {ministries.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6 text-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">{content.church.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href={`tel:${content.church.phone}`}
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  {content.church.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${content.church.email}`}
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  {content.church.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} {content.church.name}. All rights reserved.
            </p>
            <p className="text-primary-foreground/60 text-sm">
              Made with ❤️ for the glory of God
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
