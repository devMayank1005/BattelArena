import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    
    cursor.className = 'custom-cursor';
    dot.className = 'custom-cursor-dot';
    
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor {
        width: 40px;
        height: 40px;
        border: 2px solid #00f0ff;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        left: -20px;
        top: -20px;
        box-shadow: 0 0 10px #00f0ff, inset 0 0 10px rgba(0, 240, 255, 0.3);
        opacity: 0.8;
        transition: opacity 0.3s ease;
      }

      .custom-cursor-dot {
        width: 8px;
        height: 8px;
        background: #00f0ff;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        left: -4px;
        top: -4px;
        box-shadow: 0 0 10px #00f0ff;
      }

      * {
        cursor: none !important;
      }

      a, button {
        cursor: none !important;
      }

      .custom-cursor.active {
        width: 60px;
        height: 60px;
        left: -30px;
        top: -30px;
        border-color: #ff006e;
        box-shadow: 0 0 30px #ff006e, inset 0 0 15px rgba(255, 0, 110, 0.3);
        opacity: 1;
      }

      .custom-cursor-dot.active {
        width: 12px;
        height: 12px;
        background: #ff006e;
        box-shadow: 0 0 15px #ff006e;
        left: -6px;
        top: -6px;
      }
    `;
    document.head.appendChild(style);

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      cursor.style.left = cursorX - 20 + 'px';
      cursor.style.top = cursorY - 20 + 'px';
      dot.style.left = mouseX - 4 + 'px';
      dot.style.top = mouseY - 4 + 'px';

      requestAnimationFrame(animateCursor);
    };

    const handleMouseEnter = () => {
      cursor.classList.add('active');
      dot.classList.add('active');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('active');
      dot.classList.remove('active');
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    animateCursor();

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cursor.remove();
      dot.remove();
      style.remove();
    };
  }, []);

  return null;
}
