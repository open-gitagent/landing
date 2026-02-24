import { useCallback, useEffect, useRef } from "react";

const CELL_SIZE = 28;
const GLOW_RADIUS = 120;

export function ProximityGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animFrame = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, width, height);

    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    const cols = Math.ceil(width / CELL_SIZE) + 1;
    const rows = Math.ceil(height / CELL_SIZE) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
        const proximity = Math.max(0, 1 - dist / GLOW_RADIUS);

        // Base grid opacity
        const baseOpacity = 0.025;
        const glowOpacity = proximity * 0.18;
        const opacity = baseOpacity + glowOpacity;

        // Draw intersection dot
        const dotSize = 0.4 + proximity * 1;
        const greenChannel = proximity > 0 ? `142, 72%, 50%` : `0, 0%, 45%`;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${greenChannel}, ${opacity})`;
        ctx.fill();

        // Draw grid lines (right and down)
        if (col < cols - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + CELL_SIZE, y);
          ctx.strokeStyle = `hsla(${greenChannel}, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        if (row < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + CELL_SIZE);
          ctx.strokeStyle = `hsla(${greenChannel}, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const section = container.closest("section");
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      draw();
      animFrame.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrame.current);
    };
  }, [draw]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
