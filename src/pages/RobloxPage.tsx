import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { Globe, Languages, Layout, Award, Users, RefreshCw, ExternalLink, Code2, Shirt, ArrowRight, X, Twitter, MessageSquare, Linkedin, Youtube } from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Project } from '../types';
import { useMemo } from "react";

interface CollageImage {
  src: string;
  alt: string;
  aspect: number;
}

interface MediaItem {
  id: string;
  src: string;
  type: 'image' | 'gif' | 'video';
  aspect: number;
  title: string;
  description: string;
}

function MediaLightboxGrid({ items, thumbHeight = 220 }: { items: MediaItem[]; thumbHeight?: number }) {
  const [selected, setSelected] = useState<MediaItem | null>(null);

  // lock scroll + close on escape while open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            style={{ height: thumbHeight, aspectRatio: item.aspect }}
            className="overflow-hidden rounded-xl border border-border-default group relative"
          >
            {item.type === 'video' ? (
              <video src={item.src} className="w-full h-full object-cover" muted loop playsInline autoPlay />
            ) : (
              <img src={item.src} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-cta-bg rounded-[2rem] border border-border-default shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden grid grid-cols-1 md:grid-cols-[1.3fr_1fr]"
          >
            <div className="bg-black/20 flex items-center justify-center max-h-[50vh] md:max-h-[85vh]">
              {selected.type === 'video' ? (
                <video src={selected.src} className="w-full h-full object-contain" controls autoPlay loop />
              ) : (
                <img src={selected.src} alt={selected.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              )}
            </div>

            <div className="p-8 space-y-4 overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold">{selected.title}</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-secondary hover:text-text-default transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {selected.tags && selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-brand-default/10 text-brand-default rounded-full text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-text-secondary text-sm leading-relaxed">{selected.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

interface PopoutMediaProps {
  src: string;
  type?: 'image' | 'gif' | 'video';
  alt: string;
  title: string;
  description: string;
  tags?: string[];
  className?: string; // sizing/layout classes you control from outside
}

function PopoutMedia({ src, type = 'image', alt, title, description, tags, className }: PopoutMediaProps) {
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
          <video src={src} className="w-full h-full object-contain" muted loop playsInline autoPlay />
        ) : (
          <img src={src} alt={alt} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col md:flex-row items-center gap-6 max-w-[95vw] w-full max-h-[90vh]"
          >
            {/* Image, full and uncropped, no box/rounding */}
            <div className="flex-1 min-w-0 max-h-[60vh] md:max-h-[90vh] flex items-center justify-center">
              {type === 'video' ? (
                <video src={src} className="max-w-full max-h-full object-contain" controls autoPlay loop />
              ) : (
                <img src={src} alt={alt} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
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

const RobloxPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'All';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const parseVisits = (visits?: string): number => {
    if (!visits) return 0;
    const cleanVisits = visits.replace(/,/g, '');
    const match = cleanVisits.match(/([\d.]+)([BMk]?)/);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2];
      const mult = unit === 'B' ? 1000000000 : unit === 'M' ? 1000000 : unit === 'k' ? 1000 : 1;
      return val * mult;
    }
    return 0;
  };

  const initialProjects = PROJECTS.filter(p => p.category === 'Roblox').map(p => ({
    ...p,
    numericVisits: parseVisits(p.visits)
  }));

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const sortedProjects = [...projects].sort((a, b) => (b.numericVisits || 0) - (a.numericVisits || 0));
  const topThree = sortedProjects.slice(0, 3);

  const filteredProjects = sortedProjects.filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Localisation') return p.tags.includes('Localisation');
    if (activeTab === 'Development') return p.tags.includes('Development') || p.tags.includes('Scripting') || p.tags.includes('Luau') || p.tags.includes('UI/UX');
    if (activeTab === 'Clothing') return p.tags.includes('Clothing');
    return true;
  });

  const tabs = ['All', 'Localisation', 'Development', 'Clothing'];

  const [totalVisits, setTotalVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<string>(new Date().toLocaleTimeString());

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Localisation':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    Bridging the gap with <span className="text-brand-default">Chinese Localisation</span>
                  </h2>
                  <p className="text-xl text-text-secondary leading-relaxed">
                    I specialise in Chinese and bring extensive experience in providing localisation services that ensure cultural resonance and player retention.
                  </p>
                </div>

                <div className="p-6 bg-cta-bg rounded-3xl border border-border-default shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-default/10 rounded-2xl text-brand-default">
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Certified Proficiency</h4>
                      <p className="text-sm text-text-secondary">CEFR Standardised Assessment</p>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    I hold a certified reading score of <a
                      href="https://cert.efset.org/srrbM1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-default font-bold underline decoration-brand-default underline-offset-4 hover:text-brand-default transition-colors"
                      title="View EFSET Certification"
                    >C1 Advanced</a> on the CEFR scale, ensuring high-accuracy translations.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-brand-default/5 rounded-[3rem] blur-2xl -z-10" />
                <div className="bg-cta-bg rounded-[2.5rem] border border-border-default p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="w-32 h-32 shrink-0 flex items-center justify-center group transition-colors">
                      <img
                        src="/assets/ITSLogo.png"
                        alt="International Translation Services Logo"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-4 text-center sm:text-left">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">ITS Member</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          Proud member of George Gaitanis's <span className="text-text-default font-bold">International Translation Services</span>. Join us to access professional localisation across dozens of languages.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <a href="https://x.com/TranslationRBLX" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl border border-border-default hover:border-brand-default hover:text-brand-default transition-all" title="ITS Twitter">
                            <Twitter size={16} />
                          </a>
                          <a href="https://translationsrblx.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl border border-border-default hover:border-brand-default hover:text-brand-default transition-all" title="ITS Website">
                            <Globe size={16} />
                          </a>
                          <a href="https://cg.linkedin.com/company/international-translation-services" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl border border-border-default hover:border-brand-default hover:text-brand-default transition-all" title="ITS LinkedIn">
                            <Linkedin size={16} />
                          </a>
                          <a href="https://www.youtube.com/channel/UCgOQX_mSvYTCg9Q8unp6idA" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl border border-border-default hover:border-brand-default hover:text-brand-default transition-all" title="ITS YouTube">
                            <Youtube size={16} />
                          </a>
                        </div>
                        <a href="https://discord.gg/mXSCev9jUm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-brand-default text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                          <span>Join ITS</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8">Localisation Portfolio</h3>
              <div className="flex flex-wrap justify-center gap-6">
                {projects.filter(p => p.tags.includes('Localisation')).map((project) => (
                  <div key={project.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-[320px]">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 'Development':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-16"
          >
            <p>Soon</p>
          </motion.div>
        );
      case 'Clothing':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-24 py-12"
          >
            {/* AGS */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold border-b border-border-default pb-4 inline-block px-8">An Garda Síochána</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[725fr_350fr] gap-4">
                <div className="aspect-[725/348] overflow-hidden">
                  <img src="/assets/Clothing/GdaShirt.png" alt="Garda shirts and gilets" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[350/348] overflow-hidden">
                  <img src="/assets/Clothing/GdaDecJacket1.png" alt="A Detective Garda jacket" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="aspect-[350/348] w-full md:w-[350px] shrink-0 overflow-hidden">
                  <img src="/assets/Clothing/ASUFleece.png" alt="ASU Fleece" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="text-sm text-text-secondary space-y-4 leading-relaxed">
                    <p>
                      An Garda Síochána is the national police and security force for the Republic of Ireland.
                      Since Ireland is a small island, they are the only police force in the country.
                      The name comes from the Irish term 'The Guardians of Peace'.
                      Unlike many other security forces throughout the world, the Gardaí (plural for Garda, a single member of An Garda Síochána) are an unarmed police force,
                      with only specialised units having firearms, noteably the Armed Support Unit, depicted to the left.
                    </p>
                    <p>
                      There many divisions in the Garda Síochána, such as the prementioned Armed Support Unit, the Regular Unit, the Roads Policing Unit,
                      the Technical Unit, Water Unit, Criminal Assets Buerea, and Detectives, all of which have been drawn out as closely as possible to real life uniforms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full aspect-[1000/348] overflow-hidden">
                <img src="/assets/Clothing/GdaJacket.png" alt="Garda jackets with unit variants" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-[350/348] overflow-hidden">
                  <img src="/assets/Clothing/GdaDecJacket2.png" alt="A Detective Garda Jacket" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[350/348] overflow-hidden">
                  <img src="/assets/Clothing/CABJacket.png" alt="CAB Jacket" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[350/348] overflow-hidden">
                  <img src="/assets/Clothing/ASUJacket.png" alt="ASU Jacket" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>

            {/* GCPD */}
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold border-b border-border-default pb-4 inline-block px-8">Gotham City Police Department</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[630fr_350fr] gap-8 items-start">
                <div className="aspect-[630/348] overflow-hidden">
                  <img src="/assets/Clothing/GCPDShirt.png" alt="GCPD standard" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-text-secondary space-y-4 leading-relaxed">
                    <p>
                      The GCPD is a fictional police department from the Batman universe. There have been many versions of the uniform,
                      such as the green uniforms from Batman 2004, or the NYPD inspired ones from Nolan.
                    </p>
                    <p>
                      My personal favourite is the uniform from the FOX show, 'Gotham', which is what I have drawn.
                      The uniform consists of a peaked cap, a light blue shirt with a dark-blue tie and black pants, with an optional black leather jacket.
                      Note that there are multiple variants of the jacket.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[630fr_350fr] gap-8 items-center">
                <div className="aspect-[630/348] overflow-hidden">
                  <img src="/assets/Clothing/GCPDJacket.png" alt="GCPD Template 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[1141/1012] overflow-hidden">
                      <img src="/assets/Clothing/GCPDBadge.png" alt="Badge 1" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="aspect-[976/1114] overflow-hidden">
                      <img src="/assets/Clothing/GCPDPatch.png" alt="Badge 2" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="aspect-[515/705] overflow-hidden">
                    <img src="/assets/Clothing/GCPDRef.png" alt="GCPD Reference" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Other */}
            <div className="space-y-8 -mx-12 md:-mx-20">
              <div className="text-center">
                <h2 className="text-2xl font-bold border-b border-border-default pb-4 inline-block px-8">Other Clothing</h2>
              </div>

              <div className="flex flex-wrap justify-center items-end gap-4 px-4">
                <PopoutMedia src="/assets/Clothing/ClothingCollage/SAS.png" alt="SAS Shirt" title="Scottish Ambulance Service Shirt" description="A long-sleeve duty shirt based on the Scottish Ambulance Service uniform, featuring the service's green colour scheme, epaulettes, and embroidered crest for front-line paramedic duty." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/SASShort.png" alt="SAS Shirt Short" title="Scottish Ambulance Service Shirt (Short Sleeve)" description="A warm-weather variant of the Scottish Ambulance Service shirt, trading long sleeves for a short-sleeve cut while keeping the same green uniform styling and insignia." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/SFRS.png" alt="SFRS Polo" title="Fire & Rescue Service Polo" description="A duty polo shirt styled after UK fire and rescue service uniforms, featuring embroidered service branding and reflective detailing suited for day-to-day station wear." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/AZDPSA.png" alt="AZDPS Class A" title="State Police Class A Uniform" description="A formal dress uniform modelled on US state police 'Class A' attire — pressed shirt, tie, and badge — worn for ceremonies, courtroom appearances, and official duties." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/AZDPSB.png" alt="AZDPS Class B" title="State Police Class B Uniform" description="A step down from Class A, this everyday patrol uniform swaps the tie for an open-collar shirt while keeping the badge and shoulder patches intact." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/AZDPSC.png" alt="AZDPS Class C" title="State Police Class C Uniform" description="The most casual tier of the trooper uniform set, built for training and utility duty — short sleeves, softer fabric cues, and reduced formal detailing." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/KFBPolo.png" alt="KFB Polo" title="Kildare Fire Brigade Polo" description="A casual duty polo for Kildare Fire Brigade staff, worn during non-emergency shifts and community outreach, featuring embroidered crest and rank markings." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/KFBShirt.png" alt="KFB Shirt" title="Kildare Fire Brigade Duty Shirt" description="A structured button-up worn under turnout gear or on station duty, styled with the Kildare Fire Brigade crest and standard rank insignia placement." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/NASPolo.png" alt="NAS Polo" title="National Ambulance Service Polo" description="A green duty polo based on Ireland's National Ambulance Service uniform, worn by paramedics for non-clinical shifts and training days." className="h-72" />
                <PopoutMedia src="/assets/Clothing/ClothingCollage/NASShirt.png" alt="NAS Shirt" title="National Ambulance Service Shirt" description="The formal green shirt component of the ambulance service uniform, worn with epaulettes and service branding for front-line duty." className="h-72" />
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

          </motion.div>
        );
    }
  };

  const fetchLiveStats = async () => {
    const robloxProjects = projects.filter(p => p.placeId);
    setIsLoading(true);

    try {
      const placeIds = robloxProjects.map(p => p.placeId).join(',');
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/roblox/games?placeIds=${placeIds}&_t=${Date.now()}`);

      let liveData = [];
      if (response.ok) {
        liveData = await response.json();
      }

      let newTotal = 0;
      const updatedProjects = projects.map(p => {
        const live = Array.isArray(liveData) ? liveData.find(ld => ld.placeId === p.placeId) : null;
        let numericVisits = p.numericVisits || 0;
        let visitsStr = p.visits || '0';
        let imageUrl = p.imageUrl;
        let author = p.author;
        let isLive = false;

        if (live) {
          numericVisits = live.visits;
          visitsStr = live.visits.toLocaleString();
          imageUrl = live.iconUrl || p.imageUrl;
          author = live.creator || p.author;
          isLive = true;
        } else if (p.visits) {
          numericVisits = parseVisits(p.visits);
          visitsStr = p.visits;
        }

        newTotal += numericVisits;
        return {
          ...p,
          visits: visitsStr,
          numericVisits,
          imageUrl,
          title: live?.name || p.title,
          author,
          isLive
        };
      });

      setProjects(updatedProjects);
      setTotalVisits(newTotal);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch live stats:", error);
      let staticTotal = 0;
      projects.forEach(p => {
        staticTotal += parseVisits(p.visits);
      });
      setTotalVisits(staticTotal);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-default/10 text-brand-default rounded-2xl">
                <Layout size={32} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Roblox</h1>
            </div>
            <button
              onClick={fetchLiveStats}
              disabled={isLoading}
              className="p-2 text-text-secondary hover:text-brand-default transition-colors disabled:opacity-50"
              title="Refresh live stats"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <p className="text-text-secondary text-lg leading-relaxed">
                I've contributed to some of the biggest games on the platform, providing Chinese localisation, Luau scripting, custom avatar clothing, and more.
              </p>
              <div className="flex items-start gap-4 p-6 bg-cta-bg rounded-3xl border border-border-default">
                <Users className="text-brand-default shrink-0" size={24} />
                <div>
                  <h3 className="font-bold mb-1">Proven Track Record</h3>
                  <p className="text-text-secondary text-sm">Work spanning games with over a billion combined visits, serving players across dozens of regions.</p>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed">
                I take pride in quality over quantity, every project gets the same attention to detail regardless of scope.
              </p>
            </div>

            <div className="bg-brand-default p-8 md:p-12 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white/80 uppercase tracking-widest text-xs font-bold">Contributed to over</h3>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">
                  {isLoading && totalVisits === 0 ? (
                    <span className="opacity-50">Loading...</span>
                  ) : (
                    <AnimatedCounter value={totalVisits} />
                  )}
                </div>
                <p className="text-white/90 font-medium text-sm">game visits</p>
                <p className="text-white/60 text-[10px] mt-4 uppercase tracking-widest">
                  {isLoading ? "Syncing with Roblox..." : `Last synced: ${lastSynced}`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Games */}
        <div className="mb-24 p-8 md:p-12 bg-cta-bg/40 rounded-[3rem] border border-border-default/60">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2">Top Contributions</h2>
            <p className="text-text-secondary text-sm">High-impact experiences with the largest player counts.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {topThree.map((project) => (
              <div key={project.id} className="w-full md:w-[calc(33.333%-22px)] max-w-[320px]">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>

        {/* Subsection Redirects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <button onClick={() => setActiveTab('Localisation')} className="text-left p-8 bg-cta-bg rounded-3xl border border-border-default hover:border-brand-default/30 transition-all hover:-translate-y-1 group">
            <Languages className="text-brand-default mb-4 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="font-bold mb-2">Localisation</h3>
            <p className="text-text-secondary text-sm mb-4">Expert Chinese-English translation with a focus on retention and cultural fit.</p>
            <span className="text-brand-default text-xs font-bold flex items-center gap-1">
              View Localisation Services <ArrowRight size={12} />
            </span>
          </button>
          <button onClick={() => setActiveTab('Development')} className="text-left p-8 bg-cta-bg rounded-3xl border border-border-default hover:border-brand-default/30 transition-all hover:-translate-y-1 group">
            <Code2 className="text-brand-default mb-4 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="font-bold mb-2">Development</h3>
            <p className="text-text-secondary text-sm mb-4">Specialising in GUI systems and front-end game mechanics.</p>
            <span className="text-brand-default text-xs font-bold flex items-center gap-1">
              View Development Services <ArrowRight size={12} />
            </span>
          </button>
          <button onClick={() => setActiveTab('Clothing')} className="text-left p-8 bg-cta-bg rounded-3xl border border-border-default hover:border-brand-default/30 transition-all hover:-translate-y-1 group">
            <Shirt className="text-brand-default mb-4 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="font-bold mb-2">Avatar Assets</h3>
            <p className="text-text-secondary text-sm mb-4">Custom clothing design and 2D asset creation for the Roblox marketplace.</p>
            <span className="text-brand-default text-xs font-bold flex items-center gap-1">
              View Clothing Collection <ArrowRight size={12} />
            </span>
          </button>
        </div>

        <div className="space-y-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border-default pb-8">
            <div className="flex p-1 bg-cta-bg rounded-2xl border border-border-default overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-text-default' : 'text-text-secondary hover:text-text-default'
                    }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand-default rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RobloxPage;
