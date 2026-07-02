import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaDiscord, FaEnvelope, FaGithub } from 'react-icons/fa';
import { ArrowRight, Globe, Code, Box, Mail } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

const PastWorkPage: React.FC = () => {
  const featuredIds = ['pls-donate', 'voicemaster', 'lc-dcg-project'];

  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(
    PROJECTS.filter(p => featuredIds.includes(p.id))
  );

  useEffect(() => {
    const fetchLiveData = async () => {
      const robloxFeatured = featuredProjects.filter(p => p.placeId);
      if (robloxFeatured.length === 0) return;

      try {
        const placeIds = robloxFeatured.map(p => p.placeId).join(',');
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/roblox/games?placeIds=${placeIds}&_t=${Date.now()}`);
        if (!response.ok) return;

        const liveData = await response.json();
        if (!Array.isArray(liveData) || liveData.length === 0) return;

        setFeaturedProjects(prev => prev.map(p => {
          const live = liveData.find((ld: any) => String(ld.placeId) === String(p.placeId));
          if (!live) return p;
          return {
            ...p,
            visits: live.visits.toLocaleString(),
            numericVisits: live.visits,
            imageUrl: live.iconUrl || p.imageUrl,
            author: live.creator || p.author,
            isLive: true,
          };
        }));
      } catch (error) {
        console.error('Failed to fetch live data for featured projects:', error);
      }
    };

    fetchLiveData();
  }, []);

  const stats = [
    { value: '7B+', label: 'Users reached' },
    { value: '10+', label: 'Shipped projects' },
    { value: 'C1', label: 'Advanced English' },
  ];

  const SKILLS = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Luau", icon: "/icons/luau.svg" },
    { name: "Roblox Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/roblox/roblox-original.svg" },
    { name: "SolidWorks", icon: "/icons/solidworks.svg" },
    { name: "Blender", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-[94%] mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-12 lg:gap-16 items-start"
        >
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <img 
                src="/avatar.jpg" 
                alt="Billy Chan" 
                className="w-24 h-24 md:w-32 md:h-32 object-cover bg-neutral-800 flex-shrink-0 rounded-2xl shadow-xl"
              />
              <div className="flex flex-col">
                <h1 className="text-5xl md:text-[5.5rem] font-bold text-text-default uppercase tracking-tighter leading-[0.8] -ml-1 mb-3">
                  Billy Chan
                </h1>
                <p className="text-lg md:text-2xl text-text-secondary font-bold tracking-tight leading-none">
                  Developer · UI Designer · Translator
                </p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl leading-relaxed font-light">
              Building practical software solutions and adapting platforms for global audiences through expert Chinese localisation.
            </p>
          </div>

          <div className="flex flex-col gap-5 pt-2">
            <div className="flex flex-row gap-4 w-full">
              <Link
                to="/roblox"
                className="flex-1 bg-brand-default hover:bg-brand-hover text-white px-4 py-4 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 group whitespace-nowrap shadow-lg shadow-brand-default/10"
              >
                View Roblox Work
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:business.billychan@gmail.com"
                className="flex-1 bg-text-default hover:opacity-90 border border-border-default text-bg-primary px-4 py-4 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Mail size={18} />
                Get in Touch
              </a>
            </div>

            <div className="flex flex-row gap-3 w-full">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1 bg-cta-bg border border-border-default p-4 rounded-xl flex flex-col items-center text-center">
                  <span className="text-2xl md:text-3xl font-black tracking-tighter text-brand-default leading-none mb-1">
                    {stat.value}
                  </span>
                  <span className="text-text-secondary text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* REPLICATED WORK SECTION */}
      <section className="max-w-[96%] mx-auto px-4 mb-24">
        <div className="mb-10 border-b border-border-default pb-6">
          <h2 className="text-3xl font-bold tracking-tight mb-1">Some of My Work</h2>
        </div>

        {/* Row Header - Desktop Only */}
        <div className="hidden lg:grid grid-cols-[140px_1fr_1.5fr_1fr_120px] gap-8 px-6 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60">
          <div>Visual</div>
          <div>Title · Owner</div>
          <div className="pl-8 border-l border-border-default/50">Project Overview</div>
          <div className="pl-8 border-l border-border-default/50">My Contribution</div>
          <div className="text-right">Visits</div>
        </div>

        <div className="space-y-4">
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-cta-bg border border-border-default rounded-[2rem] p-4 lg:p-6 hover:border-brand-default/40 transition-all group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr_1.5fr_1fr_120px] gap-6 lg:gap-8 items-center">
                
                {/* Visual */}
                <div className="aspect-square w-full lg:w-[140px] rounded-2xl overflow-hidden bg-neutral-900 border border-border-default">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Title & Owner */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-text-default group-hover:text-brand-default transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-medium">
                    {project.author || "Unknown Creator"}
                  </p>
                </div>

                {/* Overview - Desktop Vertical Line Left */}
                <div className="lg:pl-8 lg:border-l border-border-default/50 h-full flex flex-col justify-center">
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Contribution/Role - Desktop Vertical Line Left */}
                <div className="lg:pl-8 lg:border-l border-border-default/50 h-full flex flex-col justify-center">
                   <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-white/5 border border-white/10 rounded-md text-text-secondary uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visits - Desktop Right Aligned */}
                <div className="text-left lg:text-right">
                   <div className="text-xs font-black text-text-secondary/40 uppercase tracking-widest mb-1 lg:hidden">Total Visits</div>
                   <span className="text-lg font-black tracking-tighter text-text-default">
                    {project.visits}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-[94%] mx-auto px-4 mb-12 pt-20 border-t border-border-default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-8">About Me</h2>
            <div className="space-y-6 text-text-secondary text-xl leading-relaxed font-light">
              <p>
                I'm <span className="text-text-default font-medium">Billy</span>, a student based in Ireland. Online, I am also known as
                <span className="text-text-default font-medium"> Channers</span> or
                <span className="text-text-default font-medium"> VexorianDev</span>.
              </p>
              <p>
                My work focuses on building practical, reliable systems and adapting them for different audiences through
                localisation. I have contributed to projects used by millions of players worldwide.
              </p>
              
              <div className="pt-10 mt-10 border-t border-border-default">
                <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-12">
                  <div>
                    <h3 className="text-text-default font-bold text-xs uppercase tracking-widest mb-5">Connect</h3>
                    <div className="flex gap-3">
                      <a href="mailto:business.billychan@gmail.com" className="p-3.5 rounded-xl bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default transition-all shadow-sm">
                        <FaEnvelope size={20} />
                      </a>
                      <a href="https://github.com/Channers8432" target="_blank" rel="noreferrer" className="p-3.5 rounded-xl bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default transition-all shadow-sm">
                        <FaGithub size={20} />
                      </a>
                      <a href="https://discord.com/users/884839188313296919" target="_blank" rel="noreferrer" className="p-3.5 rounded-xl bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default transition-all shadow-sm">
                        <FaDiscord size={20} />
                      </a>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="text-text-default font-bold text-xs uppercase tracking-widest mb-5">Skills and Tools</h3>
                    <div 
                      className="flex overflow-hidden"
                      style={{
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                      }}
                    >
                      <motion.div 
                        className="flex gap-10 items-center whitespace-nowrap px-4"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                      >
                        {[...SKILLS, ...SKILLS].map((skill, i) => (
                          <div key={i} className="flex items-center gap-3 shrink-0">
                            <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />
                            <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                              {skill.name}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-5">
            {[
              { icon: <Globe size={24} />, title: "Localisation", body: "Fluent in English and Mandarin Chinese, I localise interfaces and content with deep attention to cultural tone." },
              { icon: <Code size={24} />, title: "Development", body: "Specialising in Luau and TypeScript. I build robust gameplay systems and modern interfaces for Roblox and web." },
              { icon: <Box size={24} />, title: "Engineering", body: "Mechanical design using SolidWorks and Blender, bridging the gap between engineering and visual assets." }
            ].map((item, idx) => (
              <div key={idx} className="bg-cta-bg p-8 rounded-[2rem] border border-border-default group hover:border-brand-default/30 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-brand-default">{item.icon}</div>
                  <h3 className="text-xl font-bold group-hover:text-brand-default transition-colors">{item.title}</h3>
                </div>
                <p className="text-text-secondary text-lg leading-relaxed font-light">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PastWorkPage;