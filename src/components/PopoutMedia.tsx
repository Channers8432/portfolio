import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export interface PopoutMediaProps {
  src: string;
  type?: 'image' | 'gif' | 'video';
  alt: string;
  title: string;
  description: string;
  tags?: string[];
  className?: string; // sizing/layout classes for the thumbnail, controlled by the caller
}

export function PopoutMedia({ src, type = 'image', alt, title, description, tags, className }: PopoutMediaProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`overflow-hidden group relative block ${className || ''}`}
      >
        {type === 'video' ? (
          <video src={src} className="h-full w-auto object-contain" muted loop playsInline autoPlay />
        ) : (
          <img src={src} alt={alt} className="h-full w-auto object-contain" referrerPolicy="no-referrer" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col md:flex-row items-center gap-6 w-full h-full max-w-[98vw] max-h-[95vh]"
          >
            {/* Image, full and uncropped, no box/rounding, fills available space */}
            <div className="flex-1 min-w-0 min-h-0 w-full h-full flex items-center justify-center">
              {type === 'video' ? (
                <video src={src} className="max-w-full max-h-full w-auto h-auto object-contain" controls autoPlay loop />
              ) : (
                <img src={src} alt={alt} className="max-w-full max-h-full w-auto h-auto object-contain" referrerPolicy="no-referrer" />
              )}
            </div>

            {/* Fixed-size info box, independent of image dimensions */}
            <div className="w-full md:w-80 h-80 shrink-0 bg-cta-bg rounded-[2rem] border border-border-default shadow-2xl p-8 overflow-y-auto space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold">{title}</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-default transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-brand-default/10 text-brand-default rounded-full text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}