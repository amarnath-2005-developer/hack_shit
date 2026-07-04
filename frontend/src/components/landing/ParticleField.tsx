import { memo, useEffect, useRef } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  blur: number;
};

const MAX_PARTICLES = 120;
const LINE_DISTANCE = 96;
const INTERACTION_DISTANCE = 150;

export const ParticleField = memo(function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    const syncCanvasSize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const createParticles = () => {
      const count = Math.min(MAX_PARTICLES, Math.floor((w * h) / 18000));
      return Array.from({ length: count }, (_, id) => {
        const z = Math.random(); // 0 to 1
        return {
          id,
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * (0.1 + z * 0.4),
          vy: (Math.random() - 0.5) * (0.1 + z * 0.4),
          r: z * 2.5 + 0.5,
          hue: Math.random() > 0.5 ? 280 : 200,
          blur: Math.abs(z - 0.5) * 4, // Center focus: 0.5 is sharpest
        };
      }).sort((a, b) => a.z - b.z);
    };

    syncCanvasSize();
    let particles = createParticles();

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > 0 && distSq < INTERACTION_DISTANCE * INTERACTION_DISTANCE) {
          const dist = Math.sqrt(distSq);
          const f = (INTERACTION_DISTANCE - dist) / INTERACTION_DISTANCE;
          p.x += (dx / dist) * f * (p.z + 0.5); // Closer particles react more
          p.y += (dy / dist) * f * (p.z + 0.5);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        // Depth of field bokeh
        ctx.shadowBlur = p.blur * DPR;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, 1)`;
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${0.3 + p.z * 0.7})`;

        ctx.fill();
        ctx.shadowBlur = 0; // Reset for lines
      }

      // Subtle connecting lines, checked through a spatial grid to avoid O(n^2) work.
      const cellSize = LINE_DISTANCE;
      const grid = new Map<string, Particle[]>();
      for (const p of particles) {
        const key = `${Math.floor(p.x / cellSize)},${Math.floor(p.y / cellSize)}`;
        const bucket = grid.get(key);
        if (bucket) bucket.push(p);
        else grid.set(key, [p]);
      }

      for (const [key, bucket] of grid) {
        const [cx, cy] = key.split(",").map(Number);
        const neighbors: Particle[] = [];
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const nearby = grid.get(`${cx + ox},${cy + oy}`);
            if (nearby) neighbors.push(...nearby);
          }
        }

        for (const a of bucket) {
          for (const b of neighbors) {
            if (a.id >= b.id) continue;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < LINE_DISTANCE * LINE_DISTANCE) {
              const d = Math.sqrt(dSq);
              ctx.strokeStyle = `hsla(270, 80%, 70%, ${(1 - d / LINE_DISTANCE) * 0.15 * a.z * b.z})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => (mouseRef.current = { x: -9999, y: -9999 });
    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      syncCanvasSize();
      particles = createParticles();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden
    />
  );
});
