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

  const services = [
    {
      icon: <Globe size={24} />,
      title: 'Translation & Localisation',
      desc: 'Chinese-English localisation for games, apps, and digital platforms, with a focus on natural tone and cultural accuracy.'
    },
    {
      icon: <Code size={24} />,
      title: 'Software & Roblox Development',
      desc: 'Luau scripting, UI systems, and general software development for projects ranging from prototypes to live platforms.'
    },
    {
      icon: <Box size={24} />,
      title: 'Engineering & CAD',
      desc: 'Mechanical design, assemblies, and technical drawings using SolidWorks, alongside general technical system design.'
    },
    {
      icon: <Camera size={24} />,
      title: 'Photography',
      desc: 'Street and urban photography focused on transport, emergency services, and everyday life across Ireland.'
    },
  ];

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
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Header Row: Avatar, Name, and Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-6">
              <img 
                src="/avatar.jpg" 
                alt="Billy Chan" 
                className="w-24 h-24 md:w-32 md:h-32 object-cover bg-neutral-800 flex-shrink-0"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-5xl md:text-[5.5rem] font-bold text-text-default uppercase tracking-tighter leading-[0.75] -ml-1 mb-2">
                  Billy Chan
                </h1>
                <p className="text-lg md:text-2xl text-text-secondary font-semibold ml-0.5 leading-none">
                  Developer  ·  UI Designer  ·  Translator
                </p>
              </div>
            </div>

            {/* CTA Buttons - Next to name on Desktop */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/roblox"
                className="bg-brand-default hover:bg-brand-hover text-white px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 group whitespace-nowrap"
              >
                View Roblox Work
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:business.billychan@gmail.com"
                className="bg-button-bg-transparent hover:bg-button-bg-transparent-hover border border-border-default text-text-default px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Mail size={18} />
                Get in Touch
              </a>
            </div>
          </div>

          {/* Stats Bar - Under the name and buttons */}
          <div className="flex flex-wrap gap-x-12 gap-y-4 border-y border-border-default py-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-brand-default">{stat.value}</span>
                <span className="text-text-secondary text-sm font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xl md:text-2xl text-text-secondary max-w-4xl leading-relaxed">
            Hi, I'm <span className="text-text-default font-medium">Billy</span>, a student based in Ireland working across
            localisation, software development, and Roblox systems. My focus is on practical, well-designed solutions
            that scale beyond small prototypes.
          </p>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Work</h2>
            <p className="text-text-secondary text-lg">A selection of projects demonstrating scale and technical detail.</p>
          </div>
          <Link to="/roblox" className="text-brand-default hover:text-brand-hover font-bold flex items-center gap-1">
            View all projects <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Capabilities</h2>
          <p className="text-text-secondary text-lg">Work spanning software, localisation, engineering, and creative media.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-cta-bg rounded-3xl border border-border-default hover:border-brand-default/30 transition-colors"
            >
              <div className="text-brand-default mb-6">{service.icon}</div>
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-text-secondary text-base leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-16 border-t border-border-default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-8">About Me</h2>
            <div className="space-y-6 text-text-secondary text-xl leading-relaxed font-light">
              <p>
                I'm <span className="text-text-default font-medium">Billy</span>, a student based in Ireland. Online, I am also known as
                <span className="text-text-default font-medium"> Channers</span> on Discord and
                <span className="text-text-default font-medium"> VexorianDev</span> on Roblox.
              </p>
              <p>
                My work focuses on building practical, reliable systems and adapting them for different audiences through
                localisation. I have contributed to projects ranging from small tools to platforms used by millions of
                players worldwide.
              </p>
              
              <div className="pt-8 border-t border-border-default mt-12">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 items-start">
                  <div>
                    <h3 className="text-text-default font-bold mb-4 whitespace-nowrap">Connect</h3>
                    <div className="flex gap-3">
                      <a href="mailto:business.billychan@gmail.com" className="p-3 rounded-2xl bg-button-bg-transparent border border-border-default hover:border-brand-default/40 text-text-default transition-all">
                        <FaEnvelope size={20} />
                      </a>
                      <a href="https://github.com/Channers8432" target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-button-bg-transparent border border-border-default hover:border-brand-default/40 text-text-default transition-all">
                        <FaGithub size={20} />
                      </a>
                      <a href="https://discord.com/users/884839188313296919" target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-button-bg-transparent border border-border-default hover:border-brand-default/40 text-text-default transition-all">
                        <FaDiscord size={20} />
                      </a>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="text-text-default font-bold mb-4">Skills & Tools</h3>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background-default to-transparent z-10"></div>
                      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background-default to-transparent z-10"></div>
                      <div className="flex overflow-hidden">
                        <motion.div 
                          className="flex gap-8 items-center whitespace-nowrap"
                          animate={{ x: ["0%", "-50%"] }}
                          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                        >
                          {[...SKILLS, ...SKILLS].map((skill, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                                <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />
                              </div>
                              <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">{skill.name}</span>
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-cta-bg p-8 rounded-[2rem] border border-border-default">
              <h3 className="text-xl font-bold mb-3">Translation & Localisation</h3>
              <p className="text-text-secondary text-base leading-relaxed">
                Fluent in English and Mandarin Chinese, I localise interfaces, game content, and technical text with
                attention to tone, context, and readability.
              </p>
            </div>
            <div className="bg-cta-bg p-8 rounded-[2rem] border border-border-default">
              <h3 className="text-xl font-bold mb-3">Software & Game Development</h3>
              <p className="text-text-secondary text-base leading-relaxed">
                I build user interfaces, gameplay systems, and supporting tools in Roblox Studio, alongside general web
                and software development using modern frameworks.
              </p>
            </div>
            <div className="bg-cta-bg p-8 rounded-[2rem] border border-border-default">
              <h3 className="text-xl font-bold mb-3">3D Modelling & CAD</h3>
              <p className="text-text-secondary text-base leading-relaxed">
                Using SolidWorks and Blender, I create mechanical parts, assemblies, and low-poly assets for both
                technical and game-related use cases.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;