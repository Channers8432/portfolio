import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Roblox', path: '/roblox' },
    { label: 'Projects', path: '/projects' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nav-bg-dark/80 backdrop-blur-md border-b border-border-default">
      <div className="max-w-[98%] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tighter text-brand-default uppercase">
              Channers
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${
                    location.pathname === item.path
                      ? 'text-brand-default'
                      : 'text-text-secondary hover:text-text-default'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center justify-center p-2 rounded-xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover border border-border-default/50 transition-colors text-text-default"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-button-bg-transparent border border-border-default/50 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-default transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-nav-bg-dark border-b border-border-default overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-bold ${
                    location.pathname === item.path
                      ? 'text-brand-default bg-brand-default/5'
                      : 'text-text-secondary hover:text-text-default hover:bg-button-bg-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};