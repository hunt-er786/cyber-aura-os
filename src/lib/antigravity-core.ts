import { create } from "zustand";

/**
 * Antigravity Neural Core
 * -----------------------
 * Fully self-contained, internal AI simulation engine. No network.
 * Orchestrates 6 autonomous agents, a reasoning timeline, a predictive
 * threat engine, and an adaptive cyber defense heatmap.
 */

export type AgentId = "sentinel" | "hydra" | "athena" | "cortex" | "ghost" | "eclipse";

export type AgentStatus = "IDLE" | "SCANNING" | "REASONING" | "ENGAGING" | "SYNCING";

export type AgentMode = "PASSIVE" | "MONITOR" | "ACTIVE" | "AGGRESSIVE" | "STEALTH" | "FORECAST";

export type Agent = {
  id: AgentId;
  codename: string;
  role: string;
  status: AgentStatus;
  mode: AgentMode;
  reasoning: string;
  signals: string[];        // recent detected signals (max 4)
  lastAction: string;       // most recent defense action
  lastActionAt: number;     // timestamp
  confidence: number;       // 0-1
  threatLevel: number;      // 0-100
  latencyMs: number;        // response latency
  memorySync: number;       // 0-1
  activity: number;         // 0-1 pulse
  color: "cyan" | "emerald" | "amber" | "red" | "violet" | "blue";
};


export type ReasoningEvent = {
  id: number;
  ts: number;
  agent: AgentId;
  channel: "COGNITION" | "SWARM" | "ACTION" | "MEMORY";
  message: string;
};

export type ThreatPrediction = {
  id: number;
  vector: string;
  region: "NA" | "EU" | "APAC" | "LATAM" | "MEA";
  probability: number; // 0-1
  eta: number;         // seconds
  severity: number;    // 0-100
};

const AGENT_SEED: Record<AgentId, Pick<Agent, "codename" | "role" | "color">> = {
  sentinel: { codename: "SENTINEL", role: "Perimeter Watch · Signal Intake",   color: "cyan" },
  hydra:    { codename: "HYDRA",    role: "Multi-Vector Counter-Offensive",    color: "red" },
  athena:   { codename: "ATHENA",   role: "Strategic Cognition · War Council", color: "violet" },
  cortex:   { codename: "CORTEX",   role: "Neural Memory · Pattern Synthesis", color: "blue" },
  ghost:    { codename: "GHOST",    role: "Covert Recon · Deception Mesh",     color: "emerald" },
  eclipse:  { codename: "ECLIPSE",  role: "Predictive Threat Horizon",         color: "amber" },
};

const REASONING_TEMPLATES: Record<AgentId, string[]> = {
  sentinel: [
    "Ingest spike on edge-mesh node 14 → fingerprinting payload signature",
    "Cross-referencing TLS fingerprint against known C2 corpus",
    "Anomaly Δ=0.81 detected on east-1 perimeter — escalating to Athena",
  ],
  hydra: [
    "Spawning 3 counter-vectors against incoming ransomware swarm",
    "Adaptive payload morph in progress — generation 14",
    "Neutralization confirmed · honeynet relays absorbed 92% of blast",
  ],
  athena: [
    "Strategic posture re-evaluated: shift to ACTIVE DENIAL recommended",
    "Game-theoretic model converged — adversary expected to pivot to supply-chain",
    "Issuing coordination directive to Hydra + Ghost swarm cluster",
  ],
  cortex: [
    "Indexing 14,221 new event embeddings into long-term memory lattice",
    "Pattern match: current vector resembles CVE-2024-3094 cluster (sim=0.87)",
    "Memory synchronization complete · neural delta committed",
  ],
  ghost: [
    "Deploying decoy credentials across 7 honeytokens",
    "Adversary engaged decoy in eu-west-2 — capturing TTPs",
    "Intel package handed off to Cortex for memory fusion",
  ],
  eclipse: [
    "Forecast horizon T+60s: 71% probability of deepfake escalation",
    "Predictive heatmap recalibrated — APAC threat surface widening",
    "Issuing pre-emptive shield directive to Sentinel grid",
  ],
};

const AGENT_MODES: Record<AgentId, AgentMode[]> = {
  sentinel: ["MONITOR", "ACTIVE", "PASSIVE"],
  hydra:    ["ACTIVE", "AGGRESSIVE"],
  athena:   ["MONITOR", "ACTIVE", "FORECAST"],
  cortex:   ["PASSIVE", "MONITOR"],
  ghost:    ["STEALTH", "PASSIVE", "MONITOR"],
  eclipse:  ["FORECAST", "MONITOR"],
};

const INIT_AGENT_MODE: Record<AgentId, AgentMode> = {
  sentinel: "MONITOR", hydra: "ACTIVE", athena: "MONITOR",
  cortex: "PASSIVE", ghost: "STEALTH", eclipse: "FORECAST",
};

const SIGNAL_TEMPLATES: Record<AgentId, string[]> = {
  sentinel: ["TLS-fp::ja3_anomaly", "edge-mesh::n14_spike", "perimeter::Δ0.81", "c2-corpus::match_0.74", "ingress::burst_2.4kpps"],
  hydra:    ["payload::morph_g14", "ransomware::swarm_active", "honeynet::absorb_92%", "counter-vec::3_spawned", "blast::contained"],
  athena:   ["posture::active_denial", "game-theory::pivot_supply", "swarm::directive_issued", "model::converged", "intent::adversarial_0.88"],
  cortex:   ["embedding::14221_indexed", "pattern::CVE-2024-3094", "lattice::sync_ok", "memory::Δ_committed", "recall::sim_0.87"],
  ghost:    ["decoy::7_honeytokens", "eu-west-2::engaged", "ttp::captured", "deception::layer_3", "intel::handoff_cortex"],
  eclipse:  ["forecast::T+60s_0.71", "horizon::APAC_widening", "predict::deepfake_esc", "shield::preempt_issued", "trend::rising"],
};

const ACTION_TEMPLATES: Record<AgentId, string[]> = {
  sentinel: ["Quarantined ingress flow on edge-mesh n14", "Hardened TLS policy on east-1 perimeter", "Escalated anomaly to Athena council"],
  hydra:    ["Deployed counter-payload generation 14", "Absorbed ransomware blast via honeynet relay", "Neutralized 3 attack vectors simultaneously"],
  athena:   ["Shifted swarm posture to ACTIVE DENIAL", "Issued coordination directive to Hydra+Ghost", "Recalibrated game-theoretic response model"],
  cortex:   ["Committed neural delta to long-term lattice", "Fused threat embedding into pattern memory", "Synthesized new defense heuristic v4.21"],
  ghost:    ["Deployed 7 honeytokens across eu-west-2", "Captured adversary TTPs via decoy engagement", "Rotated deception mesh credentials"],
  eclipse:  ["Issued pre-emptive shield to Sentinel grid", "Recalibrated predictive heatmap (APAC)", "Forecasted T+60s deepfake escalation"],
};

const STRATEGY_DELTAS = [
  "weights rebalanced toward zero-day surface",
  "recall window 30s → 45s",
  "honeypot fidelity tier 2 → tier 3",
  "phishing threshold 0.62 → 0.71",
  "counter-vector pool +2 strategies",
  "exploration rate 0.18 → 0.12",
  "fused new TTP signature into lattice",
  "perimeter sensitivity east-1 raised",
  "deprecated rule cluster R-118",
  "swarm coherence target +4%",
];

const VECTORS = ["phishing", "ransomware", "deepfake", "zero-day", "ddos", "supply-chain", "botnet", "exploit"] as const;
const REGIONS: ThreatPrediction["region"][] = ["NA", "EU", "APAC", "LATAM", "MEA"];
const STATUSES: AgentStatus[] = ["SCANNING", "REASONING", "ENGAGING", "SYNCING"];

const rand = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export type LearningEvent = {
  id: number;
  ts: number;
  agent: AgentId;
  trigger: string;
  delta: string;
  impact: number;        // 0-1
  modelVersion: string;
};

export type BrainMode = "LEARNING" | "NEUTRALIZE" | "ESCALATE";

export const BRAIN_MODE_META: Record<BrainMode, { label: string; tagline: string; color: "emerald" | "cyan" | "red" }> = {
  LEARNING:   { label: "LEARNING",   tagline: "passive observation · maximize adaptation",      color: "emerald" },
  NEUTRALIZE: { label: "NEUTRALIZE", tagline: "balanced engagement · contain & neutralize",     color: "cyan" },
  ESCALATE:   { label: "ESCALATE",   tagline: "full aggression · counter-strike all vectors",   color: "red" },
};

type CoreState = {
  online: boolean;
  brainMode: BrainMode;
  cognitionLoad: number;
  swarmCoherence: number;
  defensePosture: number;
  threatsNeutralized: number;
  agents: Record<AgentId, Agent>;
  timeline: ReasoningEvent[];
  predictions: ThreatPrediction[];
  heatmap: number[];
  simulationCycle: number;
  learningEvents: LearningEvent[];
  modelVersion: { major: number; minor: number };
  learningRate: number;
  adaptationScore: number;
  tick: () => void;
  runSimulation: () => void;
  reset: () => void;
  setBrainMode: (m: BrainMode) => void;
  injectConflictSignal: (input: { who: "ATTACK" | "DEFENSE" | "SYSTEM"; msg: string }) => void;
};

let _eid = 0;
let _pid = 0;
let _lid = 0;

// Deterministic initial values — must match on server and client to avoid
// React hydration mismatches. Randomization happens only after mount via tick().
const INIT_AGENT_VALUES: Record<AgentId, { confidence: number; threatLevel: number; latencyMs: number; memorySync: number }> = {
  sentinel: { confidence: 0.72, threatLevel: 18, latencyMs: 62, memorySync: 0.82 },
  hydra:    { confidence: 0.68, threatLevel: 24, latencyMs: 78, memorySync: 0.76 },
  athena:   { confidence: 0.81, threatLevel: 15, latencyMs: 54, memorySync: 0.88 },
  cortex:   { confidence: 0.77, threatLevel: 12, latencyMs: 48, memorySync: 0.91 },
  ghost:    { confidence: 0.65, threatLevel: 21, latencyMs: 70, memorySync: 0.79 },
  eclipse:  { confidence: 0.74, threatLevel: 17, latencyMs: 58, memorySync: 0.85 },
};

const INIT_HEATMAP = [0.12, 0.28, 0.41, 0.19, 0.33, 0.47, 0.22, 0.38, 0.15, 0.44, 0.26, 0.31];

const INIT_SIGNALS: Record<AgentId, string[]> = {
  sentinel: ["edge-mesh::n14_spike", "TLS-fp::ja3_anomaly"],
  hydra:    ["counter-vec::armed"],
  athena:   ["model::idle"],
  cortex:   ["lattice::sync_ok"],
  ghost:    ["decoy::layer_2_armed"],
  eclipse:  ["forecast::scanning"],
};

const INIT_ACTIONS: Record<AgentId, string> = {
  sentinel: "Calibrated perimeter sensors on east-1",
  hydra:    "Pre-armed counter-payload pool",
  athena:   "Reviewed swarm posture · holding MONITOR",
  cortex:   "Committed baseline embeddings to lattice",
  ghost:    "Seeded decoy credential grid",
  eclipse:  "Initialized T+90s forecast horizon",
};

const initialAgents = (): Record<AgentId, Agent> =>
  Object.fromEntries(
    (Object.keys(AGENT_SEED) as AgentId[]).map((id) => [
      id,
      {
        id,
        ...AGENT_SEED[id],
        status: "IDLE" as AgentStatus,
        mode: INIT_AGENT_MODE[id],
        reasoning: "standing by",
        signals: [...INIT_SIGNALS[id]],
        lastAction: INIT_ACTIONS[id],
        lastActionAt: 0,
        ...INIT_AGENT_VALUES[id],
        activity: 0.3,
      },
    ]),
  ) as Record<AgentId, Agent>;

export const useAntigravity = create<CoreState>((set, get) => ({
  online: true,
  cognitionLoad: 0.42,
  swarmCoherence: 0.78,
  defensePosture: 0.74,
  threatsNeutralized: 0,
  agents: initialAgents(),
  timeline: [],
  predictions: [],
  heatmap: [...INIT_HEATMAP],
  simulationCycle: 0,
  learningEvents: [],
  modelVersion: { major: 4, minor: 21 },
  learningRate: 0.42,
  adaptationScore: 0.68,

  reset: () => set({
    agents: initialAgents(),
    timeline: [],
    predictions: [],
    threatsNeutralized: 0,
    simulationCycle: 0,
    heatmap: [...INIT_HEATMAP],
    learningEvents: [],
    modelVersion: { major: 4, minor: 21 },
    learningRate: 0.42,
    adaptationScore: 0.68,
  }),

  tick: () => {
    const s = get();
    if (!s.online) return;
    const ids = Object.keys(s.agents) as AgentId[];
    const focus = rand(ids);

    const a = s.agents[focus];
    const nextStatus = rand(STATUSES);
    const reasoning = rand(REASONING_TEMPLATES[focus]);
    const newSignal = rand(SIGNAL_TEMPLATES[focus]);
    const isEngaging = nextStatus === "ENGAGING";
    const isSyncing = nextStatus === "SYNCING";

    const updatedAgent: Agent = {
      ...a,
      status: nextStatus,
      mode: Math.random() < 0.25 ? rand(AGENT_MODES[focus]) : a.mode,
      reasoning,
      signals: [newSignal, ...a.signals.filter((s) => s !== newSignal)].slice(0, 4),
      lastAction: isEngaging ? rand(ACTION_TEMPLATES[focus]) : a.lastAction,
      lastActionAt: isEngaging ? Date.now() : a.lastActionAt,
      confidence: Math.max(0.4, Math.min(0.99, a.confidence + (Math.random() - 0.45) * 0.08)),
      threatLevel: Math.max(0, Math.min(100, a.threatLevel + (Math.random() - 0.5) * 18)),
      latencyMs: Math.max(12, Math.min(420, a.latencyMs + (Math.random() - 0.5) * 40)),
      memorySync: Math.max(0.5, Math.min(1, a.memorySync + (Math.random() - 0.45) * 0.06)),
      activity: 0.5 + Math.random() * 0.5,
    };

    const channel: ReasoningEvent["channel"] =
      isEngaging ? "ACTION" :
      isSyncing  ? "MEMORY" :
      Math.random() < 0.35 ? "SWARM" : "COGNITION";

    const event: ReasoningEvent = {
      id: ++_eid, ts: Date.now(), agent: focus, channel, message: reasoning,
    };

    let predictions = s.predictions
      .map((p) => ({ ...p, eta: Math.max(0, p.eta - 1) }))
      .filter((p) => p.eta > 0)
      .slice(0, 8);

    if (Math.random() < 0.55) {
      predictions = [
        {
          id: ++_pid, vector: rand(VECTORS), region: rand(REGIONS),
          probability: 0.4 + Math.random() * 0.55,
          eta: 20 + Math.floor(Math.random() * 90),
          severity: Math.round(30 + Math.random() * 65),
        },
        ...predictions,
      ].slice(0, 8);
    }

    const heatmap = s.heatmap.map((v) =>
      Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.15)),
    );

    // Adaptive learning: ENGAGING / SYNCING events trigger strategy updates
    let learningEvents = s.learningEvents;
    let modelVersion = s.modelVersion;
    let learningRate = s.learningRate;
    let adaptationScore = s.adaptationScore;

    if (isEngaging || isSyncing || Math.random() < 0.18) {
      const impact = 0.35 + Math.random() * 0.6;
      const minor = s.modelVersion.minor + 1;
      const bumpMajor = minor >= 99;
      modelVersion = bumpMajor
        ? { major: s.modelVersion.major + 1, minor: 0 }
        : { major: s.modelVersion.major, minor };
      const ver = `v${modelVersion.major}.${modelVersion.minor.toString().padStart(2, "0")}`;
      const le: LearningEvent = {
        id: ++_lid, ts: Date.now(), agent: focus,
        trigger: isEngaging ? `engaged · ${a.codename} action` : isSyncing ? `memory sync · ${a.codename}` : `passive drift · ${a.codename}`,
        delta: rand(STRATEGY_DELTAS),
        impact, modelVersion: ver,
      };
      learningEvents = [le, ...s.learningEvents].slice(0, 40);
      learningRate = Math.max(0.15, Math.min(0.95, s.learningRate + (Math.random() - 0.4) * 0.04));
      adaptationScore = Math.max(0.3, Math.min(0.99, s.adaptationScore * 0.85 + impact * 0.15));
    }

    set({
      agents: { ...s.agents, [focus]: updatedAgent },
      timeline: [event, ...s.timeline].slice(0, 60),
      predictions,
      heatmap,
      cognitionLoad: Math.max(0.1, Math.min(1, s.cognitionLoad + (Math.random() - 0.5) * 0.05)),
      swarmCoherence: Math.max(0.4, Math.min(1, s.swarmCoherence + (Math.random() - 0.5) * 0.04)),
      defensePosture: Math.max(0.4, Math.min(0.99, s.defensePosture + (Math.random() - 0.45) * 0.03)),
      threatsNeutralized: s.threatsNeutralized + (isEngaging ? 1 + Math.floor(Math.random() * 4) : 0),
      learningEvents, modelVersion, learningRate, adaptationScore,
    });
  },

  runSimulation: () => {
    const s = get();
    const ids = Object.keys(s.agents) as AgentId[];
    const agents = { ...s.agents };
    const newEvents: ReasoningEvent[] = [];
    const newLearning: LearningEvent[] = [];
    let modelVersion = s.modelVersion;

    ids.forEach((id, i) => {
      const reasoning = rand(REASONING_TEMPLATES[id]);
      const action = rand(ACTION_TEMPLATES[id]);
      agents[id] = {
        ...agents[id],
        status: i % 2 === 0 ? "ENGAGING" : "REASONING",
        mode: rand(AGENT_MODES[id]),
        reasoning,
        signals: [rand(SIGNAL_TEMPLATES[id]), ...agents[id].signals].slice(0, 4),
        lastAction: action,
        lastActionAt: Date.now() + i,
        confidence: Math.min(0.99, agents[id].confidence + 0.05),
        threatLevel: Math.min(100, agents[id].threatLevel + 15),
        latencyMs: Math.max(18, agents[id].latencyMs - 10),
        memorySync: Math.min(1, agents[id].memorySync + 0.04),
        activity: 1,
      };
      newEvents.push({
        id: ++_eid, ts: Date.now() + i, agent: id, channel: "SWARM",
        message: `[CYCLE ${s.simulationCycle + 1}] ${reasoning}`,
      });
      const minor = modelVersion.minor + 1;
      modelVersion = minor >= 99
        ? { major: modelVersion.major + 1, minor: 0 }
        : { major: modelVersion.major, minor };
      newLearning.push({
        id: ++_lid, ts: Date.now() + i, agent: id,
        trigger: `simulation cycle ${s.simulationCycle + 1}`,
        delta: rand(STRATEGY_DELTAS),
        impact: 0.6 + Math.random() * 0.35,
        modelVersion: `v${modelVersion.major}.${modelVersion.minor.toString().padStart(2, "0")}`,
      });
    });

    set({
      agents,
      timeline: [...newEvents.reverse(), ...s.timeline].slice(0, 80),
      learningEvents: [...newLearning.reverse(), ...s.learningEvents].slice(0, 40),
      modelVersion,
      simulationCycle: s.simulationCycle + 1,
      cognitionLoad: Math.min(1, s.cognitionLoad + 0.15),
      swarmCoherence: Math.min(1, s.swarmCoherence + 0.08),
      defensePosture: Math.min(0.99, s.defensePosture + 0.05),
      adaptationScore: Math.min(0.99, s.adaptationScore + 0.06),
      learningRate: Math.min(0.95, s.learningRate + 0.03),
      threatsNeutralized: s.threatsNeutralized + 12 + Math.floor(Math.random() * 18),
    });
  },
}));

let _interval: ReturnType<typeof setInterval> | null = null;
export function ensureAntigravityRunning() {
  if (typeof window === "undefined" || _interval) return;
  _interval = setInterval(() => useAntigravity.getState().tick(), 1200);
}
