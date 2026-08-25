import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaDiscord, FaEnvelope, FaGithub } from 'react-icons/fa';
import { ArrowRight, Globe, Code, Box, Mail } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Project } from '../types';

const Home: React.FC = () => {
  const featuredIds = ['pls-donate', 'voicemaster', 'scary-shawarma'];

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
    { value: '10+', label: 'Contributions' },
    { value: '0', label: 'Friends' },
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

  const sentences = [
    "Bridging gaps between the world through localisation.",
    "Creating engaging experiences for millions of users.",
    "Engineering practical solutions that turn complex ideas into reality."
  ];
  const [currentSentence, setCurrentSentence] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length);
    }, 4000); // Cycles every 4 seconds
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-[94%] mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-12 lg:gap-16 items-stretch"
        >
          {/* Left Column - Changed to justify-between to anchor text to bottom */}
          <div className="flex flex-col justify-between py-2">
            <div className="flex items-center gap-6 mb-8 lg:mb-0">
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

            {/* Animated Sentence Cycler - Anchored to bottom of this column */}
            <div className="h-16 md:h-20 flex flex-col justify-end overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSentence}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-xl md:text-2xl text-text-secondary max-w-3xl leading-relaxed font-light"
                >
                  {sentences[currentSentence]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Anchored Stats */}
          <div className="flex flex-col justify-between h-full py-2 gap-8">
            {/* Top: Buttons aligned with Name/Avatar */}
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

            {/* Stats aligned with bottom Animated Text */}
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


      {/* Past Work */}
      <section id="past-work" className="max-w-[96%] mx-auto px-4 mb-12 pt-20 border-t border-border-default">
        <div className="mb-10 pb-6 space-y-5">
          <h2 className="text-4xl font-bold tracking-tight mb-8">Past Work</h2>

          <div className="space-y-6 max-w-[90%] mx-auto">

            {/* PLS DONATE */}
            {(() => {
              const p = featuredProjects.find(proj => proj.id === 'pls-donate');
              return (
                <div className="bg-cta-bg/30 border border-border-default rounded-3xl p-5 lg:p-7 hover:bg-cta-bg/50 transition-all group">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    <div className="flex flex-row items-center lg:contents gap-5">
                      <div className="w-24 h-24 lg:w-44 lg:h-44 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-border-default self-start shadow-lg">
                        <img src={p?.imageUrl} alt={p?.title} className="w-full h-full object-cover aspect-square" />
                      </div>

                      <div className="flex-1 flex flex-col lg:hidden">
                        <h3 className="text-base font-bold text-text-default uppercase tracking-tight leading-tight">{p?.title || "PLS DONATE"}</h3>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mb-3">{p?.author || "Quataun"}</p>

                        <div className="pt-2 border-t border-border-default/40">
                          <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] block opacity-40">Total Visits</span>
                          <span className="text-lg font-black tracking-tighter text-brand-default tabular-nums">{p?.visits || "0"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="hidden lg:flex flex-row justify-between items-start mb-5 border-b border-border-default/60 pb-5">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-text-default uppercase tracking-tight">{p?.title || "PLS DONATE"}</h3>
                          <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mt-1">{p?.author || "Quataun"}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] block mb-0.5 opacity-40">Total Visits</span>
                          <span className="text-lg md:text-xl font-black tracking-tighter text-brand-default tabular-nums">{p?.visits || "0"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">The Project</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            A popular Roblox game where players can give and receive Robux. 
                            It is a place where People set up custom virtual stands to ask for donations, 
                            while others can walk up to these stands to buy items and donate.
                          </p>
                        </div>
                        <div className="space-y-2 md:pl-8 md:border-l border-border-default/50">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">My Role</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            Translated the entire game from English to Simplified Chinese in preperation for the 2024 Roblox The Hunt: First Edition event.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}



            {/* WEATHERWISODM */}
            {(() => {
              // const p = featuredProjects.find(proj => proj.id === 'scary-shawarma');
              return (
                <div className="bg-cta-bg/30 border border-border-default rounded-3xl p-5 lg:p-7 hover:bg-cta-bg/50 transition-all group">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    <div className="flex flex-row items-center lg:contents gap-5">
                      <div className="w-24 h-24 lg:w-44 lg:h-44 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-border-default self-start shadow-lg">
                        <img src="/assets/weatherwisdom.png" alt="weatherwisdom" className="w-full h-full object-cover aspect-square" />
                      </div>

                      <div className="flex-1 flex flex-col lg:hidden">
                        <h3 className="text-base font-bold text-text-default uppercase tracking-tight leading-tight">WeatherWisdom</h3>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mb-3">ExamReady</p>

                        <div className="pt-2 border-t border-border-default/40">
                          <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] block opacity-40">Hackathon</span>
                          <span className="text-lg font-black tracking-tighter text-brand-default tabular-nums">NASA SpaceApps 2025</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="hidden lg:flex flex-row justify-between items-start mb-5 border-b border-border-default/60 pb-5">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-text-default uppercase tracking-tight">WeatherWisdom</h3>
                          <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mt-1">ExamReady</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] block mb-0.5 opacity-40">Hackathon</span>
                          <span className="text-lg md:text-xl font-black tracking-tighter text-brand-default tabular-nums">NASA SpaceApps 2025</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">The Project</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            A website that predicts the weather based on past weather events for specific locations and gives recommendations based on conditions, made in 2 days for the 2025 NASA SpaceApps Hackathon.
                          </p>
                        </div>
                        <div className="space-y-2 md:pl-8 md:border-l border-border-default/50">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">My Role</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            Worked on the frontend of the site, as well as some of the design. A 5-man team project
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}



            {/* SCARY SHAWARMA KIOSK */}
            {(() => {
              const p = featuredProjects.find(proj => proj.id === 'scary-shawarma');
              return (
                <div className="bg-cta-bg/30 border border-border-default rounded-3xl p-5 lg:p-7 hover:bg-cta-bg/50 transition-all group">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    <div className="flex flex-row items-center lg:contents gap-5">
                      <div className="w-24 h-24 lg:w-44 lg:h-44 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-border-default self-start shadow-lg">
                        <img src={p?.imageUrl} alt={p?.title} className="w-full h-full object-cover aspect-square" />
                      </div>

                      <div className="flex-1 flex flex-col lg:hidden">
                        <h3 className="text-base font-bold text-text-default uppercase tracking-tight leading-tight">{p?.title || "Scary Shawarma Kiosk"}</h3>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mb-3">{p?.author}</p>

                        <div className="pt-2 border-t border-border-default/40">
                          <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] block opacity-40">Total Visits</span>
                          <span className="text-lg font-black tracking-tighter text-brand-default tabular-nums">{p?.visits || "0"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="hidden lg:flex flex-row justify-between items-start mb-5 border-b border-border-default/60 pb-5">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-text-default uppercase tracking-tight">{p?.title || "Scary Shawarma Kiosk"}</h3>
                          <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mt-1">{p?.author}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] block mb-0.5 opacity-40">Total Visits</span>
                          <span className="text-lg md:text-xl font-black tracking-tighter text-brand-default tabular-nums">{p?.visits || "0"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">The Project</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            Another popular horror and survival game on Roblox. 
                            You play the night shift at a late-night food stand. 
                            Your goal is to serve customers while avoiding anomalies, such as monsters or weird people. 
                            If you serve the wrong person or break the rules, you lose.
                          </p>
                        </div>
                        <div className="space-y-2 md:pl-8 md:border-l border-border-default/50">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">My Role</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            Worked on rehauling all the UI elements of the game, and stayed on to create new interfaces for future updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* VOICEMASTER */}
            {(() => {
              const p = featuredProjects.find(proj => proj.id === 'voicemaster');
              return (
                <div className="bg-cta-bg/30 border border-border-default rounded-3xl p-5 lg:p-7 hover:bg-cta-bg/50 transition-all group">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    <div className="flex flex-row items-center lg:contents gap-5">
                      <div className="w-24 h-24 lg:w-44 lg:h-44 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-border-default self-start shadow-lg">
                        <img src={p?.imageUrl} alt={p?.title} className="w-full h-full object-cover aspect-square" />
                      </div>

                      <div className="flex-1 flex flex-col lg:hidden">
                        <h3 className="text-base font-bold text-text-default uppercase tracking-tight leading-tight">{p?.title || "VoiceMaster"}</h3>
                        <p className="text-[8px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mb-3">{p?.author}</p>

                        <div className="pt-2 border-t border-border-default/40">
                          <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] block opacity-40">Total Servers</span>
                          <span className="text-lg font-black tracking-tighter text-brand-default tabular-nums">{p?.visits || "0"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="hidden lg:flex flex-row justify-between items-start mb-5 border-b border-border-default/60 pb-5">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-text-default uppercase tracking-tight">{p?.title || "VoiceMaster"}</h3>
                          <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mt-1">{p?.author}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] block mb-0.5 opacity-40">Total Servers</span>
                          <span className="text-lg md:text-xl font-black tracking-tighter text-brand-default tabular-nums">{p?.visits || "0"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">The Project</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            A Discord bot for creating temporary, join-to-create voice channels that automatically delete when empty to keep your server clean.
                          </p>
                        </div>
                        <div className="space-y-2 md:pl-8 md:border-l border-border-default/50">
                          <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">My Role</span>
                          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                            Translated the VoiceMaster documentation into Mandarin Chinese (Simplified) 
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>




      {/* About */}
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
                I'm <span className="text-text-default font-medium">Billy</span>, an Irish student based in the UK. Online, I am also known as
                <span className="text-text-default font-medium"> Channers</span> or
                <span className="text-text-default font-medium"> VexorianDev</span>.
              </p>
              <p>
                My work focuses on building practical, reliable systems and adapting them for different audiences through
                localisation. I have contributed to projects used by millions of players worldwide.
              </p>
              <p>
                Currently, I am studying Mechatronic Engineering at the University of Manchester.
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

export default Home;