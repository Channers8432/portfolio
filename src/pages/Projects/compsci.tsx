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
  Layers
} from 'lucide-react';

export const LCCompSci26: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'report'>('overview');

  return (
    <div className="pt-24 pb-16 min-h-screen text-text-default">
      {/* Header Section */}
      <section className="max-w-[94%] mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LC Computer Science 2026
            </span>
            <span className="text-xs text-text-secondary font-mono">Exam Coursework</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight mb-4">
            Wildfire Risk & Simulation Engine
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-3xl leading-relaxed">
            An end-to-end coursework submission combining an IoT embedded environmental monitor with an agent-based wildfire simulation and dynamic risk alerting engine.
          </p>

          {/* Action Links & Navigation Toggle */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-text-default text-background shadow-lg'
                  : 'bg-surface hover:bg-surface-hover text-text-secondary'
              }`}
            >
              <Layers className="w-4 h-4" />
              Project Overview
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'report'
                  ? 'bg-text-default text-background shadow-lg'
                  : 'bg-surface hover:bg-surface-hover text-text-secondary'
              }`}
            >
              <FileText className="w-4 h-4" />
              Full SEC Report
            </button>

            <a
              href="https://github.com/your-username/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg font-medium text-sm bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-default transition-all flex items-center gap-2 ml-auto"
            >
              <Github className="w-4 h-4" />
              View Source
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Content Area */}
      <section className="max-w-[94%] mx-auto px-4">
        {activeTab === 'overview' ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Quick Metrics / High-Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Embedded IoT Setup</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Dual-device architecture capturing real-time telemetry (soil moisture & ambient temperature) across extended observation periods.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Agent-Based Simulator</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Interactive grid-based cellular automaton modeling fire spread dynamics under varying meteorological conditions.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Dual Spread Models</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Comparative analysis using regression models fitted on empirical sensor telemetry alongside the Algerian Forest Fires dataset.
                </p>
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
        ) : (
          /* Report Embed Container */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl border border-border/60 overflow-hidden bg-surface/20"
          >
            <div className="p-4 bg-surface/80 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">Embedded Document: Report/index.html</span>
              <a 
                href="/report/index.html" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-text-secondary hover:text-text-default flex items-center gap-1"
              >
                Open full page <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Replace this iframe src with your actual path */}
            <iframe
              src="/report/index.html"
              title="LC Computer Science Report"
              className="w-full h-[850px] border-0"
            />
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default LCCompSci26;