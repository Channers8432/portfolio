import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaDiscord, FaEnvelope, FaGithub } from 'react-icons/fa';
import { ArrowRight, Globe, Code, Box, Camera, Mail } from 'lucide-react';
import { PROJECTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { Project } from '../types';

const Home: React.FC = () => {
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
      <section className="max-w-[96%] mx-auto px-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-start"
        >
          {/* LEFT COLUMN: Name, Titles, Desc */}
          <div className="space-y-10">
            <div className="flex items-center gap-8">
              <img 
                src="/avatar.jpg" 
                alt="Billy Chan" 
                className="w-28 h-28 md:w-40 md:h-40 object-cover bg-neutral-800 flex-shrink-0 rounded-2xl shadow-2xl"
              />
              <div className="flex flex-col">
                <h1 className="text-6xl md:text-[7rem] font-bold text-text-default uppercase tracking-tighter leading-[0.8] -ml-1.5 mb-4">
                  Billy Chan
                </h1>
                <p className="text-xl md:text-3xl text-text-secondary font-bold tracking-tight leading-none">
                  Developer · UI Designer · Translator
                </p>
              </div>
            </div>
            
            <p className="text-2xl md:text-3xl text-text-secondary max-w-4xl leading-relaxed font-light">
              Hi, I'm <span className="text-text-default font-semibold underline decoration-brand-default underline-offset-8">Billy</span>, a student based in Ireland. I build practical, high-scale software solutions and adapt platforms for global audiences through expert Chinese localisation.
            </p>
          </div>

          {/* RIGHT COLUMN: Buttons and Stats */}
          <div className="flex flex-col lg:items-end gap-6 pt-4">
            {/* Buttons Top-Right */}
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                to="/roblox"
                className="bg-brand-default hover:bg-brand-hover text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 group whitespace-nowrap shadow-lg shadow-brand-default/20"
              >
                View Roblox Work
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:business.billychan@gmail.com"
                className="bg-cta-bg hover:bg-button-bg-transparent-hover border border-border-default text-text-default px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap"
              >
                <Mail size={22} />
                Get in Touch
              </a>
            </div>

            {/* Stats Bar Under Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full lg:w-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-cta-bg border border-border-default p-6 rounded-2xl lg:min-w-[300px] flex flex-col items-start lg:items-end">
                  <span className="text-4xl font-black tracking-tighter text-brand-default leading-none mb-1">
                    {stat.value}
                  </span>
                  <span className="text-text-secondary text-xs font-bold uppercase tracking-widest leading-none">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-[96%] mx-auto px-4 mb-32">
        <div className="flex items-end justify-between mb-12 border-b border-border-default pb-8">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Featured Work</h2>
            <p className="text-text-secondary text-xl font-light">Direct contributions to high-impact platforms.</p>
          </div>
          <Link to="/roblox" className="text-brand-default hover:text-brand-hover font-bold text-lg flex items-center gap-2">
            Browse all projects <ArrowRight size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-[96%] mx-auto px-4 mb-16 pt-24 border-t border-border-default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold tracking-tight mb-10">About Me</h2>
            <div className="space-y-8 text-text-secondary text-2xl leading-relaxed font-light">
              <p>
                I'm <span className="text-text-default font-medium">Billy</span>, a student based in Ireland. Online, I am also known as
                <span className="text-text-default font-medium"> Channers</span> or
                <span className="text-text-default font-medium"> VexorianDev</span>.
              </p>
              <p>
                My work focuses on building practical, reliable systems and adapting them for different audiences through
                localisation. I have contributed to projects ranging from small tools to platforms used by millions of
                players worldwide.
              </p>
              
              <div className="pt-12 mt-12 border-t border-border-default">
                <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-16">
                  <div>
                    <h3 className="text-text-default font-bold text-sm uppercase tracking-widest mb-6">Connect</h3>
                    <div className="flex gap-4">
                      <a href="mailto:business.billychan@gmail.com" className="p-4 rounded-2xl bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default transition-all shadow-sm">
                        <FaEnvelope size={24} />
                      </a>
                      <a href="https://github.com/Channers8432" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default transition-all shadow-sm">
                        <FaGithub size={24} />
                      </a>
                      <a href="https://discord.com/users/884839188313296919" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default transition-all shadow-sm">
                        <FaDiscord size={24} />
                      </a>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="text-text-default font-bold text-sm uppercase tracking-widest mb-6">Tools</h3>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background-default to-transparent z-10"></div>
                      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background-default to-transparent z-10"></div>
                      <div className="flex overflow-hidden">
                        <motion.div 
                          className="flex gap-12 items-center whitespace-nowrap"
                          animate={{ x: ["0%", "-50%"] }}
                          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                        >
                          {[...SKILLS, ...SKILLS].map((skill, i) => (
                            <div key={i} className="flex items-center gap-4 group opacity-70 hover:opacity-100 transition-opacity">
                              <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" />
                              <span className="text-base font-bold text-text-secondary uppercase tracking-widest">{skill.name}</span>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-cta-bg p-10 rounded-[2.5rem] border border-border-default group hover:border-brand-default/30 transition-all">
              <Globe className="text-brand-default mb-6" size={32} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-default transition-colors">Localisation</h3>
              <p className="text-text-secondary text-lg leading-relaxed font-light">
                Fluent in English and Mandarin Chinese, I localise interfaces and technical content with deep attention to cultural tone and player retention.
              </p>
            </div>
            <div className="bg-cta-bg p-10 rounded-[2.5rem] border border-border-default group hover:border-brand-default/30 transition-all">
              <Code className="text-brand-default mb-6" size={32} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-default transition-colors">Development</h3>
              <p className="text-text-secondary text-lg leading-relaxed font-light">
                Specialising in Luau and TypeScript. I build robust gameplay systems and modern user interfaces for the Roblox platform and the web.
              </p>
            </div>
            <div className="bg-cta-bg p-10 rounded-[2.5rem] border border-border-default group hover:border-brand-default/30 transition-all">
              <Box className="text-brand-default mb-6" size={32} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-default transition-colors">Engineering</h3>
              <p className="text-text-secondary text-lg leading-relaxed font-light">
                High-fidelity mechanical design using SolidWorks and Blender, bridging the gap between technical engineering and 3D visual assets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;