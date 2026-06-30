import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaDiscord, FaEnvelope, FaGithub, FaReact } from 'react-icons/fa';
import { 
  SiTypescript, 
  SiLuau, 
  SiRoblox,
  SiBlender,
  SiPython,
  SiTailwindcss 
} from 'react-icons/si';
import { ArrowRight, Globe, Code, Box, Camera } from 'lucide-react';
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
          const live = liveData.find((ld: any) => ld.placeId === p.placeId);
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
    { value: '7B+', label: 'Users reached through localised platforms' },
    { value: '10+', label: 'Completed and shipped projects' },
    { value: 'C1', label: 'Certified English proficiency' },
  ];

const SKILLS = [
    { 
      name: "TypeScript", 
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" 
    },
    { 
      name: "React", 
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
    },
    { 
      name: "Luau", 
      icon: "/icons/luau.svg" // Use a local SVG for Luau as it's not on Devicon
    },
    { 
      name: "Roblox Studio", 
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/roblox/roblox-original.svg" 
    },
    { 
      name: "SolidWorks", 
      icon: "/icons/solidworks.svg" // Use a local SVG or high-res PNG
    },
    { 
      name: "Blender", 
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" 
    },
    { 
      name: "Python", 
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" 
    },
    { 
      name: "Tailwind", 
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" 
    },
  ];

  return (
    <div className="pt-24 pb-16">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid -cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            {/* name */}
            <div className="flex items-center gap-2 mb-8 font-mono text-sm md:text-base bg-[#1e1e20] py-1.5 px-4 rounded-md border border-white/5 shadow-inner">
              <span style={{ color: '#ff7b7b' }}>local</span>
              <span style={{ color: '#cccccc' }}>developer</span>
              <span style={{ color: '#cccccc' }}>=</span>
              <span style={{ color: '#a3e4c1' }}>"Billy Chan"</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
                className="w-[1.5px] h-4 bg-[#cccccc] -ml-1"
              />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-text-default mb-6">
              Developer · UI Designer · Translator
            </h1>
{/*
            <div className="flex items-center gap-4 mb-10">
               <span className="text-7xl md:text-9xl font-bold text-text-default/5 select-none leading-none">BI|</span>
               <div className="flex flex-col gap-1.5 opacity-20">
                  <div className="w-12 h-1.5 bg-brand-default"></div>
                  <div className="w-20 h-1.5 bg-brand-default"></div>
                  <div className="w-10 h-1.5 bg-brand-default"></div>
               </div>
            </div>
*/}
            <p className="text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed">
              Hi, I'm <span className="text-text-default font-medium">Billy</span>, a student based in Ireland. I build 
              practical, well-designed systems and adapt them for global audiences through technical localisation 
              and scalable software development.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/roblox"
                className="bg-brand-default hover:bg-brand-hover text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 group shadow-lg shadow-brand-default/20"
              >
                View Projects
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#about"
                className="bg-button-bg-transparent border border-border-default hover:border-text-secondary text-text-default px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border-default pt-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-text-default">{stat.value}</span>
              <span className="text-text-secondary text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Work</h2>
            <p className="text-text-secondary">A selection of projects demonstrating scale, usability, and technical detail.</p>
          </div>
          <Link to="/roblox" className="text-brand-default hover:text-brand-hover font-medium flex items-center gap-1 text-sm">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">What I Do</h2>
          <p className="text-text-secondary">Work spanning software, localisation, engineering, and creative media.</p>
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
              <p className="text-text-secondary text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-16 border-t border-border-default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-8">About Me</h2>
            <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
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
              
              <div className="pt-8 border-t border-border-default">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 items-start">
                  
                  {/* Connect with me */}
                  <div className="flex-shrink-0">
                    <h3 className="text-text-default font-bold mb-4 whitespace-nowrap">Connect with me</h3>
                    <div className="flex gap-3">
                      <a href="mailto:business.billychan@gmail.com" target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                        <FaEnvelope size={20} />
                      </a>
                      <a href="https://github.com/Channers8432" target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                        <FaGithub size={20} />
                      </a>
                      <a href="https://discord.com/users/884839188313296919" target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                        <FaDiscord size={20} />
                      </a>
                    </div>
                  </div>

                  {/* Skills and Tools Marquee */}
                  <div className="overflow-hidden">
                    <h3 className="text-text-default font-bold mb-4">Skills and Tools</h3>
                    <div className="relative">
                      {/* Gradient Masks */}
                      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background-default to-transparent z-10"></div>
                      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background-default to-transparent z-10"></div>
                      
                      <div className="flex overflow-hidden">
                        <motion.div 
                          className="flex gap-8 items-center whitespace-nowrap"
                          animate={{ x: ["0%", "-50%"] }}
                          transition={{ 
                            duration: 25, 
                            ease: "linear", 
                            repeat: Infinity 
                          }}
                        >
                          {[...SKILLS, ...SKILLS].map((skill, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-2 group-hover:border-white/20 transition-all">
                                <img
                                  src={skill.icon} 
                                  alt={skill.name} 
                                  className="w-6 h-6 object-contain" 
                                  onError={(e) => (e.currentTarget.style.display = "none")} 
                                />
                              </div>
                              <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
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
            </div>
          </motion.div>

          {/* Right Column: Expertise Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-cta-bg p-8 rounded-3xl border border-border-default">
              <h3 className="text-xl font-bold mb-4">Translation & Localisation</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Fluent in English and Mandarin Chinese, I localise interfaces, game content, and technical text with
                attention to tone, context, and readability.
              </p>
            </div>

            <div className="bg-cta-bg p-8 rounded-3xl border border-border-default">
              <h3 className="text-xl font-bold mb-4">Software & Game Development</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                I build user interfaces, gameplay systems, and supporting tools in Roblox Studio, alongside general web
                and software development using modern frameworks.
              </p>
            </div>

            <div className="bg-cta-bg p-8 rounded-3xl border border-border-default">
              <h3 className="text-xl font-bold mb-4">3D Modelling & CAD</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Using SolidWorks and Blender, I create mechanical parts, assemblies, and low-poly assets for both
                technical and game-related use cases.
              </p>
            </div>

            <div className="bg-cta-bg p-8 rounded-3xl border border-border-default">
              <h3 className="text-xl font-bold mb-4">Photography</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                I photograph transport, emergency services, and urban life across Ireland, primarily using a Sony
                CyberShot DSC-RX100.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default Home;