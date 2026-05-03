import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Swords } from 'lucide-react';

export default function AnimatedLogo() {
  const logoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to(logoRef.current, {
      rotation: 360,
      scale: 1.2,
      duration: 0.6,
      ease: 'back.out',
    })
      .to(
        logoRef.current,
        {
          scale: 1,
          duration: 0.3,
        },
        '-=0.2'
      )
      .to(logoRef.current, {
        rotation: 720,
        duration: 0.4,
        ease: 'power2.inOut',
      });
  };

  return (
    <div
      ref={logoRef}
      onClick={triggerAnimation}
      className="cursor-pointer transition-transform hover:scale-110"
      style={{
        display: 'inline-block',
      }}
    >
      <div className="p-1.5 rounded-lg bg-cyan-900/40 border-2 border-cyan-400/30 glow-effect">
        <Swords className="w-5 h-5 text-cyan-400" />
      </div>
    </div>
  );
}
