import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  FileCheck,
  Loader2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ---------------------------------------------------------------------------
// Raw source viewer — fetches main.py straight from GitHub and displays it
// ---------------------------------------------------------------------------
const PythonCodeViewer: React.FC<{ url: string }> = ({ url }) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        setCode(data);
        setLoading(false);
      })
      .catch((err) => {
        setCode(`# Failed to load script from GitHub:\n# ${err}`);
        setLoading(false);
      });
  }, [url]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center text-text-secondary gap-3 font-mono text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span>Fetching main.py from GitHub...</span>
      </div>
    );
  }

  return (
    <div className="relative font-mono text-xs leading-relaxed">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-default border border-border/40 flex items-center gap-1.5 transition-all shadow-sm"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied' : 'Copy Code'}
      </button>

      <pre className="p-6 overflow-x-auto h-[750px] bg-black/40 text-emerald-400/90 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Live wildfire simulator — JS/Canvas port of the Tkinter AgentBasedModel.
// Same spread math, same presets, runs directly in the browser.
// ---------------------------------------------------------------------------
const EMPTY = 0, TREE = 1, BURNING = 2, BURNED = 3;
const CELL_COLOR = ['#ffffff', '#27ae60', '#eaa400', '#000000'];

const PRESETS: Record<string, any> = {
  DROUGHT: { density: 0.80, temp: 38, moisture: 0.08, windSpeed: 1.5, windDir: 0, spreadType: 'closed_source' },
  HIGH_WINDS: { density: 0.55, temp: 42, moisture: 0.05, windSpeed: 9.0, windDir: 45, spreadType: 'open_source' },
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

class AgentBasedModel {
  w: number; h: number; tempC: number; soilMoisture: number; treeDensity: number;
  windSpeed: number; windDir: number; spreadType: string;
  timeOfDay: number; dayCount: number;
  grid: Uint8Array; initialTreeCount: number; burnTime: number; burnCounter: Float64Array;
  history: { burning: number[]; burned: number[]; trees: number[] };
  embers: { x: number; y: number; life: number }[];

  constructor({ width = 60, height = 40, treeDensity = 0.65, tempC = 30, soilMoisture = 0.3, windSpeed = 0, windDir = 0, spreadType = 'closed_source' }: any) {
    this.w = width; this.h = height;
    this.tempC = tempC; this.soilMoisture = soilMoisture; this.treeDensity = treeDensity;
    this.windSpeed = windSpeed; this.windDir = windDir; this.spreadType = spreadType;
    this.timeOfDay = 0; this.dayCount = 1;
    this.grid = new Uint8Array(width * height);
    for (let i = 0; i < this.grid.length; i++) this.grid[i] = Math.random() < treeDensity ? TREE : EMPTY;
    this.initialTreeCount = this.count(TREE);
    this.burnTime = 3;
    this.burnCounter = new Float64Array(width * height);
    this.history = { burning: [], burned: [], trees: [] };
    this.embers = [];
  }

  idx(y: number, x: number) { return y * this.w + x; }
  count(state: number) { let c = 0; for (let i = 0; i < this.grid.length; i++) if (this.grid[i] === state) c++; return c; }
  diurnalTemp() { return this.tempC + 5 * Math.sin((2 * Math.PI * (this.timeOfDay - 6)) / 24); }
  getPBase() { return this.spreadType === 'open_source' ? this.spreadOpenSource() : this.spreadCloseSource(); }

  spreadCloseSource() {
    const SLOPE = -0.2795, INTERCEPT = 21.3733, MEAN_T = 9.92, STD_T = 2.05;
    const currentTemp = this.diurnalTemp();
    const predictedMoisture = clamp((SLOPE * currentTemp + INTERCEPT) / 100, 0, 1);
    const effectiveMoisture = 0.5 * predictedMoisture + 0.5 * this.soilMoisture;
    const drynessEffect = Math.pow(1 - effectiveMoisture, 2);
    const tempEffect = 1 / (1 + Math.exp(-(currentTemp - MEAN_T) / STD_T));
    return 0.30 * tempEffect * drynessEffect;
  }

  spreadOpenSource() {
    const SLOPE = 1.6530, INTERCEPT = -0.8037, SIG_CENTRE = 6.35, SIG_SCALE = 3.71;
    const currentTemp = this.diurnalTemp();
    const fuelDryness = clamp((1 - this.soilMoisture) * 95 + currentTemp * 0.3, 0, 101);
    const fWind = Math.exp(0.05039 * this.windSpeed);
    const fFuel = 0.9110 * Math.exp(0.0337 * fuelDryness) * 0.1;
    const isi = fWind * fFuel;
    const fwi = SLOPE * isi + INTERCEPT;
    const noise = 0.8 + Math.random() * 0.4;
    return clamp((1 / (1 + Math.exp(-(fwi - SIG_CENTRE) / SIG_SCALE))) * noise, 0.01, 0.9);
  }

  step() {
    this.timeOfDay += 0.5;
    if (this.timeOfDay >= 24) { this.timeOfDay = 0; this.dayCount++; }

    const pBase = this.getPBase();
    const newGrid = this.grid.slice();
    const windRad = (this.windDir * Math.PI) / 180;
    const windVec = [Math.cos(windRad), -Math.sin(windRad)];

    const newEmbers: { x: number; y: number; life: number }[] = [];
    for (const e of this.embers) {
      if (e.life > 0) {
        const driftX = (Math.random() - 0.5) * 0.2;
        const driftY = (Math.random() - 0.5) * 0.2;
        const nx = e.x + windVec[0] * (this.windSpeed * 0.4) + driftX;
        const ny = e.y + windVec[1] * (this.windSpeed * 0.4) + driftY;
        newEmbers.push({ x: nx, y: ny, life: e.life - 1 });
      }
    }
    this.embers = newEmbers;

    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const i = this.idx(y, x);
        if (this.grid[i] !== BURNING) continue;

        if (this.windSpeed > 7 && Math.random() < 0.05) {
          this.embers.push({ x, y, life: 3 + Math.floor(Math.random() * 5) });
        }

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            const ny = y + dy, nx = x + dx;
            if (ny < 0 || ny >= this.h || nx < 0 || nx >= this.w) continue;
            if (this.grid[this.idx(ny, nx)] !== TREE) continue;

            let dvx = dx, dvy = dy;
            const norm = Math.sqrt(dvx * dvx + dvy * dvy);
            if (norm > 0) { dvx /= norm; dvy /= norm; }
            const alignment = dvx * windVec[0] + dvy * windVec[1];
            const windMultiplier = 1 + this.windSpeed * 0.2 * alignment;
            const p = pBase * Math.max(0.1, windMultiplier);
            if (Math.random() < p) newGrid[this.idx(ny, nx)] = BURNING;
          }
        }

        if (this.windSpeed > 5 && Math.random() < this.windSpeed * 0.02) {
          const dist = 3 + Math.floor(Math.random() * 6);
          const tx = Math.round(x + windVec[0] * dist);
          const ty = Math.round(y + windVec[1] * dist);
          if (tx >= 0 && tx < this.w && ty >= 0 && ty < this.h && this.grid[this.idx(ty, tx)] === TREE) {
            const igniteP = (1 - this.soilMoisture) * 0.2;
            if (Math.random() < igniteP) newGrid[this.idx(ty, tx)] = BURNING;
          }
        }

        this.burnCounter[i] += 1;
        if (this.burnCounter[i] >= this.burnTime) newGrid[i] = BURNED;
      }
    }

    this.grid = newGrid;
    this.history.burning.push(this.count(BURNING));
    this.history.burned.push(this.count(BURNED));
    this.history.trees.push(this.count(TREE));
  }
}

const WindCompass: React.FC<{ angle: number; onChange: (a: number) => void; disabled?: boolean; size?: number }> = ({ angle, onChange, disabled, size = 64 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const center = size / 2;
  const radius = center - 7;

  const setFromPointer = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;
    let deg = (Math.atan2(-y, x) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    onChange(deg);
  };

  const rad = (angle * Math.PI) / 180;
  const tx = center + radius * Math.cos(rad);
  const ty = center - radius * Math.sin(rad);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className={disabled ? 'opacity-50' : 'cursor-pointer touch-none'}
      onPointerDown={(e) => { if (disabled) return; e.currentTarget.setPointerCapture(e.pointerId); setFromPointer(e); }}
      onPointerMove={(e) => { if (disabled || e.buttons !== 1) return; setFromPointer(e); }}
    >
      <circle cx={center} cy={center} r={radius} fill="#c8c8c8" stroke="#8f8f8f" strokeWidth={2} />
      <line x1={center} y1={center} x2={tx} y2={ty} stroke="#2b2b2b" strokeWidth={3} strokeLinecap="round" />
      <circle cx={tx} cy={ty} r={3} fill="#2b2b2b" />
    </svg>
  );
};

const SliderRow: React.FC<{ label: string; value: number; min: number; max: number; step: number; disabled?: boolean; onChange: (v: number) => void; format?: (v: number) => string }> = ({ label, value, min, max, step, disabled, onChange, format }) => (
  <div className="mb-3">
    <div className="flex items-center justify-between text-[11px] text-neutral-300 mb-1">
      <span>{label}</span>
      <span className="font-mono text-neutral-400">{format ? format(value) : value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-[#4a69bd] disabled:opacity-40"
    />
  </div>
);

const RISK_COLOR: Record<string, string> = { STABLE: '#27ae60', WARNING: '#e67e22', CRITICAL: '#c0392b' };
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const WildfireSimulator: React.FC = () => {
  const [tab, setTab] = useState<'CUSTOM' | 'DROUGHT' | 'HIGH_WINDS'>('CUSTOM');
  const [custom, setCustom] = useState({ density: 0.65, temp: 35, moisture: 0.2, windSpeed: 2.0, windDir: 0, spreadType: 'closed_source' });
  const [status, setStatus] = useState<'idle' | 'ready' | 'running' | 'paused' | 'finished'>('idle');
  const [intervalMs, setIntervalMs] = useState(100);
  const [riskLevel, setRiskLevel] = useState('STABLE');
  const [alertInfo, setAlertInfo] = useState<{ title: string; body: string } | null>(null);
  const [tick, setTick] = useState(0);

  const modelRef = useRef<AgentBasedModel | null>(null);
  const riskRef = useRef('STABLE');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeParams = tab === 'CUSTOM' ? custom : { ...PRESETS[tab] };

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      const model = modelRef.current;
      if (!model) return;
      model.step();

      const burned = model.history.burned[model.history.burned.length - 1];
      const burning = model.history.burning[model.history.burning.length - 1];

      let newRisk = 'STABLE';
      if (burned > model.initialTreeCount * 0.4) newRisk = 'CRITICAL';
      else if (burned > model.initialTreeCount * 0.1) newRisk = 'WARNING';

      if (newRisk !== riskRef.current) {
        riskRef.current = newRisk;
        setRiskLevel(newRisk);
        if (newRisk === 'CRITICAL') {
          setAlertInfo({ title: 'EMERGENCY ALERT', body: 'EVACUATE NOW: an immediate evacuation has been ordered due to approaching wildfire. Leave the area immediately and follow official guidance.' });
        } else if (newRisk === 'WARNING') {
          setAlertInfo({ title: 'EMERGENCY ALERT', body: 'WILDFIRE WARNING: a wildfire has been reported nearby. Prepare an emergency kit and be ready to evacuate at short notice.' });
        }
      }

      if (burning === 0) setStatus('finished');
      setTick((t) => t + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [status, intervalMs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const model = modelRef.current;

    if (!model) {
      ctx.fillStyle = '#f4f4f4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const cell = canvas.width / model.w;
    for (let y = 0; y < model.h; y++) {
      for (let x = 0; x < model.w; x++) {
        ctx.fillStyle = CELL_COLOR[model.grid[model.idx(y, x)]];
        ctx.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5);
      }
    }
    ctx.fillStyle = '#e67e22';
    for (const e of model.embers) {
      ctx.beginPath();
      ctx.arc(e.x * cell + cell / 2, e.y * cell + cell / 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [tick, status]);

  const handleInitialise = () => {
    const p = tab === 'CUSTOM' ? custom : PRESETS[tab];
    modelRef.current = new AgentBasedModel({
      width: 60, height: 40,
      treeDensity: p.density, tempC: p.temp, soilMoisture: p.moisture,
      windSpeed: p.windSpeed, windDir: p.windDir, spreadType: p.spreadType,
    });
    riskRef.current = 'STABLE';
    setRiskLevel('STABLE');
    setAlertInfo(null);
    setIntervalMs(100);
    setStatus('ready');
    setTick((t) => t + 1);
  };

  const ignite = (x: number, y: number) => {
    const model = modelRef.current;
    if (!model || model.grid[model.idx(y, x)] !== TREE) return;
    model.grid[model.idx(y, x)] = BURNING;
    setStatus('running');
    setTick((t) => t + 1);
  };

  const handleRandomIgnite = () => {
    const model = modelRef.current;
    if (!model || status !== 'ready') return;
    const trees: number[] = [];
    for (let i = 0; i < model.grid.length; i++) if (model.grid[i] === TREE) trees.push(i);
    if (!trees.length) return;
    const choice = trees[Math.floor(Math.random() * trees.length)];
    ignite(choice % model.w, Math.floor(choice / model.w));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (status !== 'ready' || !modelRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const model = modelRef.current;
    const cell = rect.width / model.w;
    const x = Math.floor((e.clientX - rect.left) / cell);
    const y = Math.floor((e.clientY - rect.top) / cell);
    if (x >= 0 && x < model.w && y >= 0 && y < model.h) ignite(x, y);
  };

  const togglePause = () => setStatus((s) => (s === 'running' ? 'paused' : s === 'paused' ? 'running' : s));
  const faster = () => setIntervalMs((v) => Math.max(10, v - 20));
  const slower = () => setIntervalMs((v) => Math.min(500, v + 20));

  const handleReset = () => {
    modelRef.current = null;
    riskRef.current = 'STABLE';
    setRiskLevel('STABLE');
    setAlertInfo(null);
    setIntervalMs(100);
    setStatus('idle');
    setTick((t) => t + 1);
  };

  const model = modelRef.current;

  const chartData = useMemo(() => {
    if (!model) return [];
    return model.history.trees.map((_, i) => ({
      t: i,
      Healthy: model.history.trees[i],
      Burning: model.history.burning[i],
      Burned: model.history.burned[i],
    }));
  }, [tick, model]);

  const statsLines = useMemo(() => {
    if (!model) return null;
    const burned = model.history.burned.at(-1) ?? 0;
    const burning = model.history.burning.at(-1) ?? 0;
    const healthy = model.history.trees.at(-1) ?? model.initialTreeCount;
    const currentTemp = model.diurnalTemp();
    const prob = model.getPBase();
    const dirIdx = Math.floor(((((90 - model.windDir) % 360) + 360) % 360 + 22.5) / 45) % 8;
    const cardinal = DIRS[dirIdx];
    const windDeg = Math.round((((90 - model.windDir) % 360) + 360) % 360);
    return [
      ['ALGORITHM', model.spreadType.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())],
      ['WIND', `${model.windSpeed.toFixed(1)} km/h @ ${windDeg}\u00b0 ${cardinal}`],
      ['TEMPERATURE', `${currentTemp.toFixed(1)}\u00b0C`],
      ['SOIL MOISTURE', model.soilMoisture.toFixed(2)],
      ['P(SPREAD)', prob.toFixed(3)],
      ['TOTAL', model.initialTreeCount],
      ['HEALTHY', healthy],
      ['BURNING', burning],
      ['BURNED', burned],
    ] as [string, string | number][];
  }, [tick, model]);

  const statusBannerText: Record<string, string> = {
    idle: 'STEP 1: INITIALISE ENVIRONMENT',
    ready: 'STEP 2: CLICK A GRID CELL OR PRESS RANDOM IGNITION',
    running: 'SIMULATION RUNNING',
    paused: 'PAUSED',
    finished: 'SIMULATION FINISHED',
  };

  const timeLabel = model ? `Day ${model.dayCount}: ${String(Math.floor(model.timeOfDay)).padStart(2, '0')}:00` : 'Day 0: 00:00';

  const setCustomField = (field: keyof typeof custom, value: any) => setCustom((c) => ({ ...c, [field]: value }));

  return (
    <div className="w-full h-full min-h-[640px] flex flex-col md:flex-row bg-[#1c1c1c] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-[300px] shrink-0 bg-[#242424] p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-neutral-200">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-semibold tracking-wide">Disaster Risk Modelling Dashboard</span>
        </div>

        <div className="flex mb-4 rounded-lg overflow-hidden border border-neutral-700">
          {(['CUSTOM', 'DROUGHT', 'HIGH_WINDS'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${tab === key ? 'bg-[#4a69bd] text-white' : 'bg-[#333] text-neutral-400 hover:text-neutral-200'}`}
            >
              {key === 'CUSTOM' ? 'Custom' : key === 'DROUGHT' ? 'Drought' : 'High winds'}
            </button>
          ))}
        </div>

        <div className="mb-3">
          <div className="text-[11px] text-neutral-300 mb-1">Spread algorithm</div>
          <div className="flex rounded-md overflow-hidden border border-neutral-700">
            {['closed_source', 'open_source'].map((val) => (
              <button
                key={val}
                disabled={tab !== 'CUSTOM'}
                onClick={() => setCustomField('spreadType', val)}
                className={`flex-1 py-1.5 text-[10px] font-semibold disabled:opacity-40 ${activeParams.spreadType === val ? 'bg-[#4a69bd]' : 'bg-[#333] text-neutral-400'}`}
              >
                {val === 'closed_source' ? 'CLOSED SOURCE' : 'OPEN SOURCE'}
              </button>
            ))}
          </div>
        </div>

        <SliderRow label="Tree density" value={activeParams.density} min={0.1} max={1.0} step={0.01}
          disabled={tab !== 'CUSTOM'} onChange={(v) => setCustomField('density', v)} format={(v) => v.toFixed(2)} />
        <SliderRow label="Temperature (\u00b0C)" value={activeParams.temp} min={10} max={50} step={1}
          disabled={tab !== 'CUSTOM'} onChange={(v) => setCustomField('temp', v)} />
        <SliderRow label="Soil moisture" value={activeParams.moisture} min={0} max={1.0} step={0.01}
          disabled={tab !== 'CUSTOM'} onChange={(v) => setCustomField('moisture', v)} format={(v) => v.toFixed(2)} />

        <div className="text-[11px] text-neutral-300 mb-1 mt-1">Wind</div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <SliderRow label="Speed (km/h)" value={activeParams.windSpeed} min={0} max={10} step={0.1}
              disabled={tab !== 'CUSTOM'} onChange={(v) => setCustomField('windSpeed', v)} format={(v) => v.toFixed(1)} />
          </div>
          <WindCompass angle={activeParams.windDir} disabled={tab !== 'CUSTOM'} onChange={(v) => setCustomField('windDir', v)} />
        </div>

        <button onClick={handleInitialise} disabled={status === 'running' || status === 'paused'}
          className="w-full py-2 rounded-md bg-[#4a69bd] text-sm font-semibold mb-2 disabled:opacity-40 hover:brightness-110 transition">
          Initialise
        </button>
        <button onClick={handleRandomIgnite} disabled={status !== 'ready'}
          className="w-full py-2 rounded-md bg-[#3a3a3a] text-sm font-semibold mb-2 disabled:opacity-40 hover:brightness-110 transition">
          Random ignition
        </button>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <button onClick={togglePause} disabled={status !== 'running' && status !== 'paused'}
            className="col-span-2 py-1.5 rounded-md bg-[#3a3a3a] text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1.5 hover:brightness-110 transition">
            {status === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button onClick={slower} className="py-1.5 rounded-md bg-[#4a69bd] text-xs font-semibold flex items-center justify-center gap-1 hover:brightness-110 transition">
            <Rewind className="w-3.5 h-3.5" /> Slower
          </button>
          <button onClick={faster} className="py-1.5 rounded-md bg-[#4a69bd] text-xs font-semibold flex items-center justify-center gap-1 hover:brightness-110 transition">
            <FastForward className="w-3.5 h-3.5" /> Faster
          </button>
        </div>

        <button onClick={handleReset}
          className="w-full py-2 rounded-md bg-[#c0392b] text-sm font-semibold mb-4 flex items-center justify-center gap-1.5 hover:brightness-110 transition">
          <RotateCcw className="w-3.5 h-3.5" /> Stop / reset
        </button>

        <div className="rounded-lg border border-neutral-700 p-3 mb-3 flex-1">
          <div className="text-[10px] italic text-neutral-400 mb-2">Live analytics</div>
          {statsLines ? (
            <div className="font-mono text-[10.5px] leading-relaxed text-neutral-200 space-y-0.5">
              {statsLines.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-neutral-500">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-neutral-500">Waiting for input...</div>
          )}
        </div>

        <div className="rounded-md py-2.5 text-center text-xs font-bold" style={{ backgroundColor: RISK_COLOR[riskLevel] }}>
          RISK LEVEL: {riskLevel}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 bg-[#111] flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-neutral-800">
          <span className="text-xs font-semibold text-neutral-200">{statusBannerText[status]}</span>
          <span className="font-mono text-xs text-neutral-400">{timeLabel}</span>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-4 min-h-0">
          <div className="rounded-lg overflow-hidden border border-neutral-800 bg-white">
            <canvas
              ref={canvasRef}
              width={720}
              height={480}
              onClick={handleCanvasClick}
              className={`w-full h-auto block ${status === 'ready' ? 'cursor-crosshair' : ''}`}
            />
          </div>

          <div className="h-48 shrink-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'Time (30 min steps)', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Healthy" stroke="#27ae60" dot={false} strokeWidth={2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Burning" stroke="#eaa400" dot={false} strokeWidth={2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Burned" stroke="#888888" dot={false} strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                Cell-count history will appear once the simulation starts
              </div>
            )}
          </div>
        </div>
      </div>

      {alertInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-sm w-full rounded-xl border border-neutral-700 bg-[#242424] p-5">
            <div className="text-sm font-bold text-red-400 mb-2">{alertInfo.title}</div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">{alertInfo.body}</p>
            <button onClick={() => setAlertInfo(null)} className="w-full py-2 rounded-md bg-[#4a69bd] text-xs font-semibold hover:brightness-110 transition">
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Portfolio page
// ---------------------------------------------------------------------------
export const LCCompSci26: React.FC = () => {
  type TabType = 'overview' | 'simulation' | 'report' | 'brief';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [simView, setSimView] = useState<'live' | 'code'>('live');

  const REPO_URL = 'https://github.com/Channers8432/LeavingCertCompSciProject2026';

  const URLS = {
    simulation: 'https://raw.githubusercontent.com/Channers8432/LeavingCertCompSciProject2026/main/Artefact/main.py',
    report: 'https://raw.githack.com/Channers8432/LeavingCertCompSciProject2026/main/Report/index_vid.html',
    brief: 'https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Channers8432/LeavingCertCompSciProject2026/main/Computer%20Science%20Coursework%20Project%20Brief%202026.pdf&embedded=true',
  };

  const SOURCE_URLS = {
    simulation: `${REPO_URL}/blob/main/Artefact/main.py`,
    report: `${REPO_URL}/blob/main/Report/index_vid.html`,
    brief: `${REPO_URL}/blob/main/Computer%20Science%20Coursework%20Project%20Brief%202026.pdf`,
  };

  return (
    <div className="pt-24 pb-16 min-h-screen text-text-default">
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

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-text-default text-background shadow-lg' : 'bg-surface hover:bg-surface-hover text-text-secondary'}`}
            >
              <Layers className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'simulation' ? 'bg-text-default text-background shadow-lg' : 'bg-surface hover:bg-surface-hover text-text-secondary'}`}
            >
              <Code2 className="w-4 h-4" />
              Project Code
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'report' ? 'bg-text-default text-background shadow-lg' : 'bg-surface hover:bg-surface-hover text-text-secondary'}`}
            >
              <FileText className="w-4 h-4" />
              Project Report
            </button>

            <button
              onClick={() => setActiveTab('brief')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'brief' ? 'bg-text-default text-background shadow-lg' : 'bg-surface hover:bg-surface-hover text-text-secondary'}`}
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

      <section className="max-w-[94%] mx-auto px-4">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
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

        {activeTab === 'simulation' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl border border-border/60 overflow-hidden bg-surface/20"
          >
            <div className="p-4 bg-surface/80 border-b border-border/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimView('live')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${simView === 'live' ? 'bg-text-default text-background' : 'bg-surface-hover text-text-secondary'}`}
                >
                  Live Demo
                </button>
                <button
                  onClick={() => setSimView('code')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${simView === 'code' ? 'bg-text-default text-background' : 'bg-surface-hover text-text-secondary'}`}
                >
                  Source Code
                </button>
              </div>
              <a
                href={SOURCE_URLS.simulation}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-secondary hover:text-text-default flex items-center gap-1 shrink-0"
              >
                View on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {simView === 'live' ? <WildfireSimulator /> : <PythonCodeViewer url={URLS.simulation} />}
          </motion.div>
        )}

        {(activeTab === 'report' || activeTab === 'brief') && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl border border-border/60 overflow-hidden bg-surface/20"
          >
            <div className="p-4 bg-surface/80 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase">
                {activeTab === 'brief' ? 'SEC Coursework Brief' : 'HTML Report'}
              </span>
              <a
                href={SOURCE_URLS[activeTab]}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-secondary hover:text-text-default flex items-center gap-1"
              >
                View on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <iframe
              src={URLS[activeTab]}
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