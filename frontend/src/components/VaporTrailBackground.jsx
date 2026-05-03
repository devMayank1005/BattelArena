import { useEffect, useRef } from 'react';

export default function VaporTrailBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.opacity = 0.7; // Increased from 0.4
        // Bright rainbow colors
        const rainbowColors = [
          '#FF0000', // Red
          '#FF7F00', // Orange
          '#FFFF00', // Yellow
          '#00FF00', // Green
          '#0000FF', // Blue
          '#4B0082', // Indigo
          '#9D00FF', // Violet
          '#00FFFF', // Cyan
          '#FF00FF', // Magenta
          '#00FF88', // Spring Green
        ];
        this.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.003; // Reduced fade rate for longer visibility
        if (this.opacity <= 0) return false;
        return true;
      }

      draw() {
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = 4; // Increased from 2.5
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15; // Glow radius
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vx * 15, this.y + this.vy * 15); // Extended trail
        ctx.stroke();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
      }
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Increased from 0.05 to fade faster
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.15) particles.push(new Particle()); // Increased particle spawn rate

      particles.forEach((p, i) => {
        if (!p.update()) particles.splice(i, 1);
        p.draw();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40"
    />
  );
}
