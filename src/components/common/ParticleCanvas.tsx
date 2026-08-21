import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  opacity?: number;
  className?: string;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ opacity = 1, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = Math.min(48, Math.floor((W * H) / 32000));
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const linkDist = 140;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!reduceMotion) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < linkDist) {
            ctx.strokeStyle = `rgba(139, 53, 214, ${(0.12 * (1 - dist / linkDist) * opacity).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let k = 0; k < nodes.length; k++) {
        ctx.fillStyle = `rgba(167, 155, 196, ${(0.45 * opacity).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(nodes[k].x, nodes[k].y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
