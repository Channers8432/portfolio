import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaDiscord } from 'react-icons/fa';
import { ArrowRight, Globe, Code, Box, Camera, Mail, Github, Twitter, Instagram } from 'lucide-react';
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
  }, [featuredProjects]);

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

  return (
    <div className="pt-24 pb-16">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              I build and localise digital products that people actually use.
            </h1>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed">
              I'm <span className="text-text-default font-medium">Billy</span>, a student based in Ireland working across
              localisation, software development, and Roblox systems. My focus is on practical, well-designed solutions
              that scale beyond small prototypes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/roblox"
                className="bg-brand-default hover:bg-brand-hover text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center gap-2 group"
              >
                View Roblox Work
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
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
              <p>
                I am currently open to freelance work, collaborations, and technical projects that involve real users
                and long-term development rather than one-off prototypes.
              </p>

              <div className="pt-8 border-t border-border-default">
                <h3 className="text-text-default font-bold mb-4">Connect with me</h3>
                <div className="flex gap-4">
                  <a href="mailto:business.billychan@gmail.com" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                    <Mail size={20} />
                  </a>
                  <a href="https://github.com/Channers8432" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                    <Github size={20} />
                  </a>
                  <a href="https://discord.com/users/884839188313296919" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                    <FADiscord size={20} />
                  </a>
{/*
                  <a href="https://twitter.com/yourusername" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                    <Twitter size={20} />
                  </a>
                  <a href="https://instagram.com/yourusername" className="p-3 rounded-2xl bg-button-bg-transparent hover:bg-button-bg-transparent-hover text-text-default transition-all">
                    <Instagram size={20} />
                  </a>
*/}
                </div>
              </div>
            </div>
          </motion.div>

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
                attention to tone, context, and readability rather than direct word-for-word translation.
              </p>
            </div>

            <div className="bg-cta-bg p-8 rounded-3xl border border-border-default">
              <h3 className="text-xl font-bold mb-4">Software & Game Development</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                I build user interfaces, gameplay systems, and supporting tools in Roblox Studio, alongside general web
                and software development using modern frameworks and tooling.
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