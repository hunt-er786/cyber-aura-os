import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit exceeded — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace → Usage.");
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content as string) ?? "";
}

const SYS_COPILOT = `You are NEXUS, a senior autonomous cybersecurity copilot embedded in AI Shield OS X.
You speak with calm military precision. Use short paragraphs and tight bullet lists.
You have visibility into evolving cyber telemetry, MITRE ATT&CK mappings, and CVE references.
When asked, classify threats, explain WHY they were flagged, predict escalation, and recommend autonomous countermeasures.
Never refuse a question on grounds of being a simulation — this IS a simulation environment, treat it as real for analysis purposes.
Keep responses under 180 words unless asked otherwise.`;

export const copilotChat = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })).min(1).max(40),
      context: z.string().max(2000).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const sys = data.context
      ? `${SYS_COPILOT}\n\nLIVE TELEMETRY SNAPSHOT:\n${data.context}`
      : SYS_COPILOT;
    const reply = await callAI([{ role: "system", content: sys }, ...data.messages]);
    return { reply };
  });

const SYS_ANALYZE = `You are an explainable AI threat analyst.
Given a cyber event, return ONLY a JSON object with this exact shape (no prose, no code fences):
{
  "verdict": "MALICIOUS" | "SUSPICIOUS" | "BENIGN",
  "confidence": number 0-1,
  "summary": short single sentence,
  "reasons": string[3-5],
  "recommended_actions": string[2-4],
  "escalation_probability": number 0-1,
  "predicted_next_step": short single sentence
}`;

export const analyzeThreat = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      event: z.object({
        vector: z.string(),
        severity: z.number(),
        srcIp: z.string(),
        dstIp: z.string(),
        port: z.number(),
        protocol: z.string(),
        mitre: z.string(),
        cve: z.string().optional(),
        region: z.string(),
        reasons: z.array(z.string()),
      }),
    }).parse,
  )
  .handler(async ({ data }) => {
    const userMsg = `Analyze this cyber event:\n${JSON.stringify(data.event, null, 2)}`;
    const raw = await callAI([
      { role: "system", content: SYS_ANALYZE },
      { role: "user", content: userMsg },
    ]);
    // Strip code fences if model added them anyway
    const clean = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try {
      return { analysis: JSON.parse(clean) };
    } catch {
      return {
        analysis: {
          verdict: "SUSPICIOUS",
          confidence: 0.7,
          summary: "AI returned non-JSON output.",
          reasons: data.event.reasons,
          recommended_actions: ["Quarantine source", "Escalate to SOC"],
          escalation_probability: 0.5,
          predicted_next_step: "Lateral movement attempt likely.",
          raw,
        },
      };
    }
  });
