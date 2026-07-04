import { useEffect, useRef } from "react";

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(DPR, DPR);

    const count = Math.floor((w * h) / 14000);
    const particles = Array.from({ length: count }, () => {
      const z = Math.random(); // 0 to 1
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        z,
        vx: (Math.random() - 0.5) * (0.1 + z * 0.4),
        vy: (Math.random() - 0.5) * (0.1 + z * 0.4),
        r: z * 2.5 + 0.5,
        hue: Math.random() > 0.5 ? 280 : 200,
        blur: Math.abs(z - 0.5) * 4, // Center focus: 0.5 is sharpest
      };
    });

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Sort by Z for proper rendering order (back to front)
      particles.sort((a, b) => a.z - b.z);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const f = (150 - dist) / 150;
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
      
      // subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 100) {
            ctx.strokeStyle = `hsla(270, 80%, 70%, ${(1 - d / 100) * 0.15 * a.z * b.z})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
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
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(DPR, DPR);
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
}
