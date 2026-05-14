export const attackPayloads = [
  { type: "PHISHING", name: "Semantic Bank Phish", severity: "HIGH", vector: "Email", payload: "Your account has been temporarily suspended. Verify identity within 24 hours: secure-banking-portal.vip" },
  { type: "RANSOMWARE", name: "BlackCipher v3.2", severity: "CRITICAL", vector: "Endpoint", payload: "AES-512 file encryption initiated across 14,221 nodes. BTC ransom: 12.4" },
  { type: "DEEPFAKE", name: "Voice Clone — CFO", severity: "CRITICAL", vector: "Audio", payload: "Authorize wire transfer of $2.8M to vendor account 8829-XX-441" },
  { type: "OTP SCAM", name: "MFA Fatigue", severity: "HIGH", vector: "Push", payload: "Send 47 push notifications until user accepts" },
  { type: "SOCIAL ENG", name: "IT Helpdesk Pretext", severity: "MEDIUM", vector: "Voice", payload: "This is IT support. We need your VPN credentials to fix the outage." },
  { type: "ZERO-DAY", name: "Kernel Race CVE-?", severity: "CRITICAL", vector: "Network", payload: "Exploiting unpatched memory corruption in libcyberx 2.4.1" },
  { type: "AI GEN MAIL", name: "Spear Phishing GPT", severity: "HIGH", vector: "Email", payload: "Hi Sarah, following up on Q3 forecast. Spreadsheet attached." },
  { type: "DDoS", name: "Botnet Wave", severity: "MEDIUM", vector: "Network", payload: "421k zombie nodes targeting load balancer 10.0.0.1" },
];

export type IngestionSource = {
  id: string;
  name: string;
  channel: string;
  signal: string;
  ageSec: number; // freshness — lower is newer
  trust: number;  // 0-1
};

// Section 7 — Multi-Source Ingestion (5 mock sources)
export const ingestionSources: IngestionSource[] = [
  { id: "S1", name: "Firewall Dashboard",       channel: "NET/EDGE",   signal: "Suspicious outbound traffic spike on egress 10.0.0.1", ageSec: 38,   trust: 0.94 },
  { id: "S2", name: "Employee Report",          channel: "HUMINT",     signal: "Employees receiving phishing email (subject: 'Q3 Bonus')", ageSec: 112, trust: 0.71 },
  { id: "S3", name: "Threat Intelligence Feed", channel: "EXT/TI",     signal: "Known ransomware campaign 'BlackCipher v3' active in region", ageSec: 64,  trust: 0.88 },
  { id: "S4", name: "Endpoint Logs",            channel: "EDR",        signal: "Unusual encryption activity on 14 endpoints — entropy spike", ageSec: 22,  trust: 0.96 },
  { id: "S5", name: "SOC Report",               channel: "SOC/HUMAN",  signal: "Operator claim: systems stable, no incidents",              ageSec: 47 * 60, trust: 0.55 },
];

// Section 8 — Contradiction Engine resolution between S4 and S5
export const contradictionResolution = {
  conflict: ["S4", "S5"] as const,
  verdict: "S5_STALE" as const,
  reasoning: [
    "Conflict detected: S4 (Endpoint Logs) reports active encryption, S5 (SOC Report) reports stable.",
    "Comparing source freshness · S4 age = 22s · S5 age = 47m 00s.",
    "Cross-referencing S1 (egress spike) and S3 (campaign active) — corroborates S4.",
    "Verdict: marking S5 as STALE — outdated by 47 minutes. Trusting S4 over S5.",
  ],
};

// Section 12 — Constraint Engine evaluation trace
export const constraintTrace = [
  { action: "Immediate full network shutdown", status: "REJECTED", reason: "Excessive operational downtime · violates availability constraint (SLA 99.9%)" },
  { action: "Disable all user accounts",       status: "REJECTED", reason: "Business continuity impact — blocks 14,221 active sessions" },
  { action: "Partial Isolation Strategy",      status: "SELECTED", reason: "Quarantines 14 affected endpoints · preserves 99.9% of operational capacity" },
] as const;

export const conflictScript = [
  { who: "ATTACK",  msg: "Generating semantic phishing payload v4.2..." },
  { who: "ATTACK",  msg: "Mutating linguistic signatures to bypass NLP filters." },
  { who: "DEFENSE", msg: "Anomalous email vector detected on inbound queue 0x42." },
  { who: "DEFENSE", msg: "Engaging neural classifier · confidence 0.91 · phishing." },
  { who: "ATTACK",  msg: "Switching to deepfake audio injection vector." },
  { who: "DEFENSE", msg: "Voice biometric mismatch — frequency band 4.2kHz anomaly." },
  { who: "ATTACK",  msg: "Deploying polymorphic ransomware payload..." },
  { who: "DEFENSE", msg: "Behavioral kernel monitor isolating process tree 8842." },
  { who: "ATTACK",  msg: "Attempting privilege escalation via CVE chain..." },
  { who: "DEFENSE", msg: "Sandbox quarantine initiated. Threat surface reduced." },
  { who: "SYSTEM",  msg: "All vectors neutralized. Defense AI learning rate +0.003." },
];

export const sectors = [
  { name: "Finance",   value: 38 },
  { name: "Health",    value: 22 },
  { name: "Energy",    value: 18 },
  { name: "Defense",   value: 14 },
  { name: "Retail",    value: 8  },
];

export const radarSkills = [
  { axis: "Phishing",      defense: 95, attack: 78 },
  { axis: "Ransomware",    defense: 88, attack: 84 },
  { axis: "Deepfake",      defense: 82, attack: 91 },
  { axis: "Zero-Day",      defense: 71, attack: 88 },
  { axis: "Social Eng.",   defense: 90, attack: 76 },
  { axis: "DDoS",          defense: 96, attack: 65 },
];

export const regions = [
  { name: "NA",  value: 412 },
  { name: "EU",  value: 388 },
  { name: "APAC",value: 524 },
  { name: "LATAM", value: 142 },
  { name: "MEA", value: 198 },
];

export const initialLogs = [
  "[BOOT] Shield OS kernel v4.2.1 initialized",
  "[NET ] Mesh telemetry online — 14,221 nodes",
  "[AI  ] Defense neural net loaded — 4.2B params",
  "[SEC ] AES-256 + post-quantum lattice keys rotated",
  "[OK  ] System nominal · awaiting threats",
];
