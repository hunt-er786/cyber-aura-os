import { create } from "zustand";

export type AttackVector =
  | "phishing" | "ransomware" | "brute-force" | "botnet"
  | "exploit" | "deepfake" | "ddos" | "zero-day" | "supply-chain";

export type CyberEvent = {
  id: number;
  ts: number;
  srcIp: string;
  dstIp: string;
  port: number;
  protocol: "TCP" | "UDP" | "HTTPS" | "DNS" | "SMB" | "SSH";
  vector: AttackVector;
  severity: number; // 1-100
  mitre: string;   // ATT&CK ID
  cve?: string;
  region: "NA" | "EU" | "APAC" | "LATAM" | "MEA";
  blocked: boolean;
  confidence: number; // 0-1 defense AI
  reasons: string[]; // explainable AI reasons
};

const VECTOR_META: Record<AttackVector, { mitre: string[]; ports: number[]; protos: CyberEvent["protocol"][]; cve?: string[] }> = {
  phishing:        { mitre: ["T1566.001","T1566.002"], ports: [443,587], protos: ["HTTPS"] },
  ransomware:      { mitre: ["T1486","T1490"], ports: [445,3389], protos: ["SMB","TCP"], cve: ["CVE-2024-21412"] },
  "brute-force":   { mitre: ["T1110.001","T1110.003"], ports: [22,3389], protos: ["SSH","TCP"] },
  botnet:          { mitre: ["T1583.005","T1071.001"], ports: [80,8080], protos: ["TCP","HTTPS"] },
  exploit:         { mitre: ["T1190","T1203"], ports: [443,8443], protos: ["HTTPS","TCP"], cve: ["CVE-2024-3094","CVE-2023-50164"] },
  deepfake:        { mitre: ["T1656"], ports: [443], protos: ["HTTPS"] },
  ddos:            { mitre: ["T1498.001","T1499.002"], ports: [53,80,443], protos: ["UDP","DNS","TCP"] },
  "zero-day":      { mitre: ["T1190","T1068"], ports: [443], protos: ["HTTPS"], cve: ["CVE-2025-0001"] },
  "supply-chain":  { mitre: ["T1195.002"], ports: [443], protos: ["HTTPS"], cve: ["CVE-2024-3094"] },
};

const REASONS: Record<AttackVector, string[]> = {
  phishing: ["AI-generated language structure detected", "Lookalike sender domain", "Anomalous URL entropy"],
  ransomware: ["Mass file rename behavior", "Shadow copy deletion attempt", "Anomalous SMB encryption pattern"],
  "brute-force": ["Login velocity > 220 req/min", "Credential spray across accounts", "Impossible geolocation transition"],
  botnet: ["C2 beacon periodicity 60s ± 2s", "DGA-style domain lookups", "Coordinated outbound spike"],
  exploit: ["Malformed packet header", "Heap-spray pattern in payload", "Privilege boundary crossed"],
  deepfake: ["Voice biometric mismatch (4.2kHz)", "Phoneme entropy anomaly", "Synthetic spectrogram artifacts"],
  ddos: ["SYN flood at 412k pps", "Amplification factor 71x", "Source IP entropy near-uniform"],
  "zero-day": ["Unknown opcode sequence", "Sandbox detonation flagged anomalous", "Behavioral cluster outlier"],
  "supply-chain": ["Unsigned binary in build artifact", "Out-of-band package mutation", "Hash drift vs manifest"],
};

const REGIONS: CyberEvent["region"][] = ["NA","EU","APAC","LATAM","MEA"];
const VECTORS = Object.keys(VECTOR_META) as AttackVector[];

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const ip = () =>
  `${10 + Math.floor(Math.random() * 240)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

let _id = 0;
export function makeEvent(intensity: number): CyberEvent {
  const vector = rand(VECTORS);
  const meta = VECTOR_META[vector];
  const severity = Math.max(5, Math.min(100, Math.round(20 + intensity * 60 + (Math.random() - 0.5) * 30)));
  const confidence = Math.max(0.4, Math.min(0.99, 0.65 + (severity / 200) + (Math.random() - 0.5) * 0.2));
  const blocked = confidence > 0.72;
  return {
    id: ++_id,
    ts: Date.now(),
    srcIp: ip(),
    dstIp: ip(),
    port: rand(meta.ports),
    protocol: rand(meta.protos),
    vector,
    severity,
    mitre: rand(meta.mitre),
    cve: meta.cve ? rand(meta.cve) : undefined,
    region: rand(REGIONS),
    blocked,
    confidence: Math.round(confidence * 1000) / 1000,
    reasons: REASONS[vector].slice(0, 2 + Math.floor(Math.random() * 2)),
  };
}

type EngineState = {
  events: CyberEvent[];
  running: boolean;
  intensity: number; // 0-1, drives Attack AI sophistication
  defensePosture: number; // 0-1, drives Defense AI strength
  attackEvolution: number; // counter
  defenseEvolution: number;
  threats: number;
  mitigated: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  setIntensity: (n: number) => void;
  tick: () => void;
  reset: () => void;
};

export const useCyberEngine = create<EngineState>((set, get) => ({
  events: [],
  running: true,
  intensity: 0.55,
  defensePosture: 0.78,
  attackEvolution: 0,
  defenseEvolution: 0,
  threats: 0,
  mitigated: 0,
  start: () => set({ running: true }),
  stop: () => set({ running: false }),
  toggle: () => set((s) => ({ running: !s.running })),
  setIntensity: (n) => set({ intensity: Math.max(0, Math.min(1, n)) }),
  reset: () => set({ events: [], threats: 0, mitigated: 0, attackEvolution: 0, defenseEvolution: 0 }),
  tick: () => {
    const s = get();
    if (!s.running) return;
    const burst = 1 + Math.floor(Math.random() * (1 + Math.round(s.intensity * 3)));
    const next: CyberEvent[] = [];
    let mitigated = 0;
    for (let i = 0; i < burst; i++) {
      const e = makeEvent(s.intensity);
      // Defense posture re-evaluates blocked
      if (Math.random() < s.defensePosture) {
        e.blocked = true;
        e.confidence = Math.min(0.99, e.confidence + 0.08);
        mitigated++;
      }
      next.push(e);
    }
    // Adversary mutates: intensity drifts up; defense slowly retrains toward it
    const newIntensity = Math.min(1, s.intensity + (Math.random() - 0.45) * 0.02);
    const newPosture = Math.min(0.99, s.defensePosture + (newIntensity - s.defensePosture) * 0.04);
    set({
      events: [...next, ...s.events].slice(0, 120),
      threats: s.threats + burst,
      mitigated: s.mitigated + mitigated,
      intensity: newIntensity,
      defensePosture: newPosture,
      attackEvolution: s.attackEvolution + (Math.random() < 0.15 ? 1 : 0),
      defenseEvolution: s.defenseEvolution + (Math.random() < 0.18 ? 1 : 0),
    });
  },
}));

// Singleton ticker — start once on client.
let _interval: ReturnType<typeof setInterval> | null = null;
export function ensureEngineRunning() {
  if (typeof window === "undefined" || _interval) return;
  _interval = setInterval(() => useCyberEngine.getState().tick(), 1100);
}
