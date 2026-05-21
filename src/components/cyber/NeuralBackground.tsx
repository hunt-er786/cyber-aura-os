import { useEffect, useRef } from "react";

/**
 * Animated neural network background with floating intelligence particles.
 * Pure canvas, GPU-friendly, no deps.
 */
export function NeuralBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(70, Math.round((w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 2,
        hue: Math.random() < 0.5 ? 200 : 155,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // Soft radial wash
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.2);
      g.addColorStop(0, "oklch(0.22 0.06 250 / 0.35)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const alpha = (1 - d2 / (140 * 140)) * 0.35;
            ctx.strokeStyle = `oklch(0.85 0.18 ${a.hue} / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10; else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10; else if (n.y > h + 10) n.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `oklch(0.85 0.2 ${n.hue} / 0.9)`;
        ctx.shadowColor = `oklch(0.85 0.2 ${n.hue})`;
        ctx.shadowBlur = 8;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      aria-hidden
    />
  );
}
