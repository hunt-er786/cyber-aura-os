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
