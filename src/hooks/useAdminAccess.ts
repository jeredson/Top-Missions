import { useState, useEffect, useCallback } from 'react';
import { useContent } from '@/contexts/ContentContext';

export const useAdminAccess = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { isAdmin, setIsAdmin } = useContent();

  // Reset click count after 2 seconds of no clicks
  useEffect(() => {
    if (clickCount > 0 && clickCount < 5) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  // Open login modal after 5 clicks
  useEffect(() => {
    if (clickCount >= 5) {
      setShowLoginModal(true);
      setClickCount(0);
    }
  }, [clickCount]);

  // Keyboard shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowLoginModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = useCallback(() => {
    setClickCount((prev) => prev + 1);
  }, []);

  const login = useCallback((username: string, password: string) => {
    // Simple frontend auth - in production, use proper authentication
    if (username === 'admin' && password === 'grace2024') {
      setIsAdmin(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, [setIsAdmin]);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, [setIsAdmin]);

  return {
    showLoginModal,
    setShowLoginModal,
    handleLogoClick,
    login,
    logout,
    isAdmin,
  };
};
