import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cross } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import AdminLoginModal from '@/components/admin/AdminLoginModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/teens', label: 'Teens' },
  { href: '/youth', label: 'Youth' },
  { href: '/media', label: 'Media' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { content, isAdmin, setIsAdmin, editMode, setEditMode } = useContent();
  const { showLoginModal, setShowLoginModal, handleLogoClick, login, logout } = useAdminAccess();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-card/95 backdrop-blur-md shadow-card py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              onClick={handleLogoClick}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled ? 'bg-primary' : 'bg-primary-foreground/10 backdrop-blur-sm'
              }`}>
                <Cross className={`w-6 h-6 ${isScrolled ? 'text-primary-foreground' : 'text-primary-foreground'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`font-display text-xl font-bold transition-colors ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}>
                  {content.church.name}
                </span>
                <span className={`text-xs font-medium transition-colors ${
                  isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/70'
                }`}>
                  A Place of Faith & Love
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.href
                      ? isScrolled
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary-foreground/20 text-primary-foreground'
                      : isScrolled
                      ? 'text-foreground hover:bg-secondary'
                      : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA & Admin */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={editMode ? 'gold' : 'outline'}
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
                  </Button>
                  <Link to="/admin">
                    <Button variant="admin" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              )}
              <Button
                variant={isScrolled ? 'gold' : 'hero'}
                size="lg"
                asChild
              >
                <Link to="/contact">Join Us</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={isScrolled ? 'text-foreground' : 'text-primary-foreground'} />
              ) : (
                <Menu className={isScrolled ? 'text-foreground' : 'text-primary-foreground'} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card/98 backdrop-blur-md border-t border-border"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      location.pathname === link.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <>
                    <hr className="border-border my-2" />
                    <Button
                      variant={editMode ? 'gold' : 'outline'}
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
                    </Button>
                    <Link to="/admin">
                      <Button variant="admin" className="w-full">
                        Admin Panel
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={logout}>
                      Logout
                    </Button>
                  </>
                )}
                <Button variant="gold" className="mt-2" asChild>
                  <Link to="/contact">Join Us</Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    </>
  );
};

export default Header;
