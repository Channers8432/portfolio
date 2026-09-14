import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Github, 
  Cpu, 
  Flame, 
  BarChart3, 
  FileText, 
  ExternalLink,
  Layers,
  Code2,
  FileCheck
} from 'lucide-react';

export const LCCompSci26: React.FC = () => {
  type TabType = 'overview' | 'simulation' | 'report' | 'brief';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const REPO_URL = 'https://github.com/Channers8432/LeavingCertCompSciProject2026';

  // Embed-compatible URLs bypassing GitHub frame restrictions
  const EMBED_URLS = {
    // CDN for HTML rendering
    report: 'https://raw.githack.com/Channers8432/LeavingCertCompSciProject2026/main/Report/index_vid.html',
    // Google Docs Viewer wrapper for rendering GitHub PDF raw files
    brief: 'https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Channers8432/LeavingCertCompSciProject2026/main/Computer%20Science%20Coursework%20Project%20Brief%202026.pdf&embedded=true',
    // Raw code view for Python script
    simulation: 'https://raw.githubusercontent.com/Channers8432/LeavingCertCompSciProject2026/main/Artefact/main.py'
  };

  const SOURCE_URLS = {
    report: `${REPO_URL}/blob/main/Report/index_vid.html`,
    brief: `${REPO_URL}/blob/main/Computer%20Science%20Coursework%20Project%20Brief%202026.pdf`,
    simulation: `${REPO_URL}/blob/main/Artefact/main.py`
  };

  return (
    <div className="pt-24 pb-16 min-h-screen text-text-default">
      {/* Header Section */}
      <section className="max-w-[94%] mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight mb-4">
            Wildfire Risk & Simulation Engine
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-3xl leading-relaxed">
            An end-to-end coursework submission combining an IoT embedded environmental monitor with an agent-based wildfire simulation and dynamic risk alerting engine.
          </p>

          {/* Action Links & Navigation Toggle */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-text-default text-background shadow-lg'
                  : 'bg-surface hover:bg-surface-hover text-text-secondary'
              }`}
            >
              <Layers className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'simulation'
                  ? 'bg-text-default text-background shadow-lg'
                  : 'bg-surface hover:bg-surface-hover text-text-secondary'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Project Code
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'report'
                  ? 'bg-text-default text-background shadow-lg'
                  : 'bg-surface hover:bg-surface-hover text-text-secondary'
              }`}
            >
              <FileText className="w-4 h-4" />
              Project Report
            </button>

            <button
              onClick={() => setActiveTab('brief')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'brief'
                  ? 'bg-text-default text-background shadow-lg'
                  : 'bg-surface hover:bg-surface-hover text-text-secondary'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              SEC Brief
            </button>

            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-default transition-all flex items-center gap-2 ml-auto"
            >
              <Github className="w-4 h-4" />
              GitHub
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Content Area */}
      <section className="max-w-[94%] mx-auto px-4">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Quick Metrics / High-Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Embedded IoT Setup</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Dual-device architecture capturing real-time telemetry across extended observation periods.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Agent-Based Simulator</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Interactive grid-based cellular automaton modeling fire spread dynamics under varying conditions.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Dual Spread Models</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Comparative analysis using regression models fitted on telemetry and Algerian fire datasets.
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Summary */}
            <div className="p-8 rounded-2xl bg-surface/30 border border-border/40">
              <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Core Deliverables</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Physical Data Collection:</strong> Automated serial telemetry collection with multi-day CSV logging.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Process Simulation:</strong> Physical verification of system responsiveness under environment changes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>What-If Scenarios:</strong> Dynamic UI presets for drought, high winds, ember spotting, and custom vectors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Adaptive Monitoring:</strong> Automated threshold alerts triggering warning and evacuation badges.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Tab Embeds */}
        {activeTab !== 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl border border-border/60 overflow-hidden bg-surface/20"
          >
            <div className="p-4 bg-surface/80 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase">
                {activeTab === 'simulation' && 'Tkinter Python Script (main.py)'}
                {activeTab === 'report' && 'HTML Report (index_vid.html)'}
                {activeTab === 'brief' && 'SEC Coursework Brief (PDF)'}
              </span>
              <a 
                href={SOURCE_URLS[activeTab]} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-text-secondary hover:text-text-default flex items-center gap-1"
              >
                View File on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <iframe
              src={EMBED_URLS[activeTab]}
              title={`LC Computer Science - ${activeTab}`}
              className="w-full h-[850px] border-0 bg-white/5"
            />
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default LCCompSci26;