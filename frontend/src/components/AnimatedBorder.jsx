import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedBorder() {
  const borderRef = useRef(null);

  useEffect(() => {
    const border = borderRef.current;
    if (!border) return;

    // Create animated rotating border - rotate only the pseudo-element
    gsap.to(border, {
      '--rotation': 360,
      duration: 8,
      repeat: -1,
      ease: 'none',
      onUpdate() {
        border.style.setProperty('--rotation', gsap.getProperty(border, '--rotation') + 'deg');
      },
    });
  }, []);

  return (
    <div
      ref={borderRef}
      className="absolute inset-0 rounded-[3rem] pointer-events-none overflow-hidden"
      style={{
        '--rotation': '0deg',
      }}
    >
      {/* Rainbow gradient border */}
      <div
        className="absolute inset-0 rounded-[3rem]"
        style={{
          background: 'conic-gradient(from 0deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9D00FF, #FF0000)',
          transform: 'rotate(var(--rotation))',
          transformOrigin: 'center',
        }}
      />
      {/* Black inner background */}
      <div className="absolute inset-1 rounded-[3rem] bg-black" />
    </div>
  );
}
