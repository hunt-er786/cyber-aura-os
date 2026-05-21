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

export type Agent = {
  id: AgentId;
  codename: string;
  role: string;
  status: AgentStatus;
  reasoning: string;
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

const VECTORS = ["phishing", "ransomware", "deepfake", "zero-day", "ddos", "supply-chain", "botnet", "exploit"] as const;
const REGIONS: ThreatPrediction["region"][] = ["NA", "EU", "APAC", "LATAM", "MEA"];
const STATUSES: AgentStatus[] = ["SCANNING", "REASONING", "ENGAGING", "SYNCING"];

const rand = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

type CoreState = {
  online: boolean;
  cognitionLoad: number;        // 0-1
  swarmCoherence: number;       // 0-1
  defensePosture: number;       // 0-1
  threatsNeutralized: number;
  agents: Record<AgentId, Agent>;
  timeline: ReasoningEvent[];
  predictions: ThreatPrediction[];
  heatmap: number[];            // 12 cells, 0-1
  simulationCycle: number;
  tick: () => void;
  runSimulation: () => void;
  reset: () => void;
};

let _eid = 0;
let _pid = 0;

const initialAgents = (): Record<AgentId, Agent> =>
  Object.fromEntries(
    (Object.keys(AGENT_SEED) as AgentId[]).map((id) => [
      id,
      {
        id,
        ...AGENT_SEED[id],
        status: "IDLE" as AgentStatus,
        reasoning: "standing by",
        confidence: 0.6 + Math.random() * 0.2,
        threatLevel: 10 + Math.random() * 20,
        latencyMs: 40 + Math.random() * 60,
        memorySync: 0.7 + Math.random() * 0.2,
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
  heatmap: Array.from({ length: 12 }, () => Math.random() * 0.5),
  simulationCycle: 0,

  reset: () => set({
    agents: initialAgents(),
    timeline: [],
    predictions: [],
    threatsNeutralized: 0,
    simulationCycle: 0,
    heatmap: Array.from({ length: 12 }, () => Math.random() * 0.5),
  }),

  tick: () => {
    const s = get();
    if (!s.online) return;
    const ids = Object.keys(s.agents) as AgentId[];
    const focus = rand(ids);

    // Mutate the focused agent
    const a = s.agents[focus];
    const nextStatus = rand(STATUSES);
    const reasoning = rand(REASONING_TEMPLATES[focus]);
    const updatedAgent: Agent = {
      ...a,
      status: nextStatus,
      reasoning,
      confidence: Math.max(0.4, Math.min(0.99, a.confidence + (Math.random() - 0.45) * 0.08)),
      threatLevel: Math.max(0, Math.min(100, a.threatLevel + (Math.random() - 0.5) * 18)),
      latencyMs: Math.max(12, Math.min(420, a.latencyMs + (Math.random() - 0.5) * 40)),
      memorySync: Math.max(0.5, Math.min(1, a.memorySync + (Math.random() - 0.45) * 0.06)),
      activity: 0.5 + Math.random() * 0.5,
    };

    const channel: ReasoningEvent["channel"] =
      nextStatus === "ENGAGING" ? "ACTION" :
      nextStatus === "SYNCING"  ? "MEMORY" :
      Math.random() < 0.35       ? "SWARM"  : "COGNITION";

    const event: ReasoningEvent = {
      id: ++_eid,
      ts: Date.now(),
      agent: focus,
      channel,
      message: reasoning,
    };

    // Maybe spawn / decay predictions
    let predictions = s.predictions
      .map((p) => ({ ...p, eta: Math.max(0, p.eta - 1) }))
      .filter((p) => p.eta > 0)
      .slice(0, 8);

    if (Math.random() < 0.55) {
      predictions = [
        {
          id: ++_pid,
          vector: rand(VECTORS),
          region: rand(REGIONS),
          probability: 0.4 + Math.random() * 0.55,
          eta: 20 + Math.floor(Math.random() * 90),
          severity: Math.round(30 + Math.random() * 65),
        },
        ...predictions,
      ].slice(0, 8);
    }

    // Heatmap drift
    const heatmap = s.heatmap.map((v) =>
      Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.15)),
    );

    set({
      agents: { ...s.agents, [focus]: updatedAgent },
      timeline: [event, ...s.timeline].slice(0, 60),
      predictions,
      heatmap,
      cognitionLoad: Math.max(0.1, Math.min(1, s.cognitionLoad + (Math.random() - 0.5) * 0.05)),
      swarmCoherence: Math.max(0.4, Math.min(1, s.swarmCoherence + (Math.random() - 0.5) * 0.04)),
      defensePosture: Math.max(0.4, Math.min(0.99, s.defensePosture + (Math.random() - 0.45) * 0.03)),
      threatsNeutralized: s.threatsNeutralized + (nextStatus === "ENGAGING" ? 1 + Math.floor(Math.random() * 4) : 0),
    });
  },

  runSimulation: () => {
    const s = get();
    // Burst: all agents engage in coordinated simulation
    const ids = Object.keys(s.agents) as AgentId[];
    const agents = { ...s.agents };
    const newEvents: ReasoningEvent[] = [];
    ids.forEach((id, i) => {
      const reasoning = rand(REASONING_TEMPLATES[id]);
      agents[id] = {
        ...agents[id],
        status: i % 2 === 0 ? "ENGAGING" : "REASONING",
        reasoning,
        confidence: Math.min(0.99, agents[id].confidence + 0.05),
        threatLevel: Math.min(100, agents[id].threatLevel + 15),
        latencyMs: Math.max(18, agents[id].latencyMs - 10),
        memorySync: Math.min(1, agents[id].memorySync + 0.04),
        activity: 1,
      };
      newEvents.push({
        id: ++_eid,
        ts: Date.now() + i,
        agent: id,
        channel: "SWARM",
        message: `[CYCLE ${s.simulationCycle + 1}] ${reasoning}`,
      });
    });

    set({
      agents,
      timeline: [...newEvents.reverse(), ...s.timeline].slice(0, 80),
      simulationCycle: s.simulationCycle + 1,
      cognitionLoad: Math.min(1, s.cognitionLoad + 0.15),
      swarmCoherence: Math.min(1, s.swarmCoherence + 0.08),
      defensePosture: Math.min(0.99, s.defensePosture + 0.05),
      threatsNeutralized: s.threatsNeutralized + 12 + Math.floor(Math.random() * 18),
    });
  },
}));

let _interval: ReturnType<typeof setInterval> | null = null;
export function ensureAntigravityRunning() {
  if (typeof window === "undefined" || _interval) return;
  _interval = setInterval(() => useAntigravity.getState().tick(), 1200);
}
