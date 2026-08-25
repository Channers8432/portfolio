import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export interface PopoutMediaProps {
    src: string;
    type?: 'image' | 'gif' | 'video';
    alt: string;
    title: string;
    description: string;
    tags?: string[];
    className?: string;
}

export function PopoutMedia({ src, type = 'image', alt, title, description, tags, className }: PopoutMediaProps) {
    const [open, setOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        const img = imgRef.current;
        if (!img || !img.naturalWidth || !img.naturalHeight) {
            setOpen(false);
            return;
        }

        const rect = img.getBoundingClientRect();
        const containerRatio = rect.width / rect.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;

        let renderedWidth: number, renderedHeight: number;
        if (imgRatio > containerRatio) {
            renderedWidth = rect.width;
            renderedHeight = rect.width / imgRatio;
        } else {
            renderedWidth = rect.height * imgRatio;
            renderedHeight = rect.height;
        }

        const offsetX = (rect.width - renderedWidth) / 2;
        const offsetY = (rect.height - renderedHeight) / 2;

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const insideImage =
            clickX >= offsetX && clickX <= offsetX + renderedWidth &&
            clickY >= offsetY && clickY <= offsetY + renderedHeight;

        if (!insideImage) {
            setOpen(false);
        }
    };

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
                        className="flex flex-col md:flex-row items-center gap-6 w-full h-full max-w-[98vw] max-h-[95vh]"
                    >

                        <div className="flex-1 min-w-0 min-h-0 w-full h-full flex items-center justify-center" onClick={handleClick}>
                            {type === 'video' ? (
                                <video src={src} className="w-full h-full object-contain" controls autoPlay loop />
                            ) : (
                                <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            )}
                        </div>

                        <div onClick={(e) => e.stopPropagation()} className="w-full md:w-80 shrink-0 bg-cta-bg rounded-[2rem] border border-border-default shadow-2xl p-8 space-y-4">
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