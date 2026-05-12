import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { sectors, radarSkills, regions } from "@/data/cyber";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
  head: () => ({
    meta: [
      { title: "Threat Analytics — AI Shield OS" },
      { name: "description", content: "Deep cyber threat analytics and intelligence." },
    ],
  }),
});

const COLORS = [
  "oklch(0.85 0.18 200)",
  "oklch(0.78 0.2 155)",
  "oklch(0.65 0.26 25)",
  "oklch(0.82 0.18 75)",
  "oklch(0.65 0.24 305)",
];

function Analytics() {
  const timeline = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    d: `D-${30 - i}`,
    threats: Math.round(120 + Math.sin(i / 2) * 60 + Math.random() * 40),
    response: Math.max(40, Math.round(180 - i * 3 + Math.random() * 20)),
  })), []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// THREAT ANALYTICS</div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Cyber Intelligence Analytics</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Panel title="THREAT TIMELINE" subtitle="30-day rolling window" className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="tl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.85 0.18 200)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.85 0.18 200)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.85 0.18 200 / 0.08)" />
                  <XAxis dataKey="d" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 9 }} interval={3} />
                  <YAxis tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontSize: 11 }} />
                  <Area type="monotone" dataKey="threats" stroke="oklch(0.85 0.18 200)" strokeWidth={2} fill="url(#tl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="MOST TARGETED SECTORS" subtitle="industry breakdown" tone="amber">
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={sectors} dataKey="value" nameKey="name" innerRadius={50} outerRadius={86} stroke="none">
                    {sectors.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              {sectors.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="size-2 rounded-sm" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Panel title="DEFENSE vs ATTACK CAPABILITY" subtitle="domain coverage matrix" tone="emerald">
            <div className="h-72">
              <ResponsiveContainer>
                <RadarChart data={radarSkills}>
                  <PolarGrid stroke="oklch(0.85 0.18 200 / 0.2)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 9 }} />
                  <Radar name="Defense" dataKey="defense" stroke="oklch(0.85 0.18 200)" fill="oklch(0.85 0.18 200)" fillOpacity={0.35} />
                  <Radar name="Attack" dataKey="attack" stroke="oklch(0.65 0.26 25)" fill="oklch(0.65 0.26 25)" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="ATTACK ORIGIN BY REGION" subtitle="geo telemetry" tone="red">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={regions}>
                  <CartesianGrid stroke="oklch(0.85 0.18 200 / 0.08)" />
                  <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.65 0.26 25 / 0.4)", fontSize: 11 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {regions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="THREAT HEAT MAP" subtitle="hour × day intensity">
          <Heatmap />
        </Panel>
      </div>
    </AppLayout>
  );
}

function Heatmap() {
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const hours = Array.from({ length: 24 }, (_, h) => h);
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid" style={{ gridTemplateColumns: `auto repeat(24, minmax(18px, 1fr))`, gap: 3 }}>
        <div />
        {hours.map((h) => (
          <div key={h} className="text-[9px] text-muted-foreground text-center font-mono">{h}</div>
        ))}
        {days.map((d, di) => (
          <>
            <div key={`d${di}`} className="text-[10px] text-muted-foreground font-mono pr-2 self-center">{d}</div>
            {hours.map((h) => {
              const v = Math.abs(Math.sin((di + 1) * (h + 1) * 0.37)) * 0.9 + Math.random() * 0.1;
              return (
                <div key={`${di}-${h}`}
                  className="aspect-square rounded-sm transition-transform hover:scale-110"
                  style={{
                    background: `oklch(${0.3 + v * 0.5} ${0.1 + v * 0.18} ${250 - v * 230})`,
                    boxShadow: v > 0.8 ? "0 0 8px oklch(0.65 0.26 25 / 0.6)" : undefined,
                  }}
                  title={`${d} ${h}:00 — intensity ${(v * 100).toFixed(0)}`}
                />
              );
            })}
          </>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
        <span>LOW</span>
        <div className="h-2 w-40 rounded-full" style={{ background: "linear-gradient(to right, oklch(0.3 0.1 250), oklch(0.7 0.2 200), oklch(0.65 0.26 25))" }} />
        <span>HIGH</span>
      </div>
    </div>
  );
}
