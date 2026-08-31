import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Github } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// PROJECT DATA
// To add a new project, copy one of the objects below and edit
// the fields. That's it — the layout below handles the rest,
// alternating image side and accent automatically by index.
// ─────────────────────────────────────────────────────────────

interface ProjectEntry {
  title: string;
  tagline: string;      
  description: string;   
  role: string;           
  tags: string[];         
  image: string;           
  year?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;      
}

const PROJECTS_DATA: ProjectEntry[] = [
  {
    title: 'WeatherWisdom',
    tagline: 'NASA SpaceApps 2025 · ExamReady',
    description:
      'A website that predicts weather patterns based on historical events for a given location, and surfaces recommendations based on conditions. Built in 2 days for the 2025 NASA SpaceApps Hackathon.',
    role: 'Built the frontend functionality and part of the UI design.',
    tags: ['React', 'TypeScript', 'Tailwind', 'API Integration'],
    image: '/assets/weatherwisdom.png',
    year: '2025',
    liveUrl: '',
    githubUrl: '',
    featured: true,
  },
  {
    title: 'Example Project Two',
    tagline: 'Personal project · 2024',
    description:
      'Replace this with a short summary of what the project actually does, written like you would explain it to a stranger in one breath.',
    role: 'Replace this with what you specifically built or contributed.',
    tags: ['Python', 'Automation'],
    image: '/assets/placeholder.png',
    year: '2024',
    liveUrl: '',
    githubUrl: '',
  },
  {
    title: 'Example Project Three',
    tagline: 'Client work · 2024',
    description:
      'Another short, punchy description of the project — what problem it solved, who it was for, what makes it interesting.',
    role: 'What you did on this one.',
    tags: ['Luau', 'Game Design'],
    image: '/assets/placeholder2.png',
    year: '2024',
  },
];

// ─────────────────────────────────────────────────────────────
// CARD COMPONENT
// ─────────────────────────────────────────────────────────────

const ProjectCard: React.FC<{ project: ProjectEntry; index: number }> = ({
  project,
  index,
}) => {
  const imageOnRight = index % 2 === 1;

  if (project.featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden border border-border-default group"
      >
        <div className="aspect-[16/8] w-full overflow-hidden bg-neutral-900">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-default bg-bg-primary/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-brand-default/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h3 className="text-3xl md:text-5xl font-bold text-text-default uppercase tracking-tighter leading-none">
                {project.title}
              </h3>
              <p className="text-sm md:text-base text-text-secondary font-light mt-2 max-w-xl">
                {project.tagline}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-brand-default hover:bg-brand-hover text-white px-5 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  View Project <ArrowUpRight size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-cta-bg border border-border-default hover:border-brand-default/40 text-text-default px-5 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <Github size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="bg-cta-bg/30 border border-border-default rounded-3xl p-5 lg:p-7 hover:bg-cta-bg/50 transition-all group"
    >
      <div
        className={`flex flex-col ${
          imageOnRight ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } gap-6 lg:gap-8`}
      >
        {/* Image */}
        <div className="w-full lg:w-64 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-border-default aspect-video lg:aspect-square shadow-lg">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-row justify-between items-start gap-4 mb-5 border-b border-border-default/60 pb-5">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-text-default uppercase tracking-tight">
                {project.title}
              </h3>
              <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-50 mt-1">
                {project.tagline}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-bg-primary border border-border-default hover:border-brand-default/40 text-text-default transition-all"
                  aria-label={`View ${project.title}`}
                >
                  <ArrowUpRight size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-bg-primary border border-border-default hover:border-brand-default/40 text-text-default transition-all"
                  aria-label={`${project.title} on GitHub`}
                >
                  <Github size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">
                The Project
              </span>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                {project.description}
              </p>
            </div>
            <div className="space-y-2 md:pl-8 md:border-l border-border-default/50">
              <span className="text-[9px] font-black text-brand-default uppercase tracking-[0.2em]">
                My Role
              </span>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
                {project.role}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-black uppercase tracking-[0.15em] text-text-secondary bg-bg-primary px-3 py-1.5 rounded-full border border-border-default/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <section className="max-w-[94%] mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-[4.5rem] font-bold text-text-default uppercase tracking-tighter leading-[0.85] mb-4">
            Projects
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-2xl">
            A collection of things I've built, hackathon entries, personal
            projects, and client work.
          </p>
        </motion.div>
      </section>

      <section className="max-w-[96%] mx-auto px-4">
        <div className="space-y-6 max-w-[90%] mx-auto">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;