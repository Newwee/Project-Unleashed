import React, { useRef, useState } from 'react';

/**
 * Magnet inspired by reactbits.dev
 * Magnetic pull effect for buttons and badges
 */
export default function Magnet({
  children,
  padding = 60,
  magnetStrength = 0.35,
  activeTransition = 'transform 0.1s ease-out',
  inactiveTransition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    if (Math.abs(distX) < width / 2 + padding && Math.abs(distY) < height / 2 + padding) {
      setIsHovered(true);
      setPosition({ x: distX * magnetStrength, y: distY * magnetStrength });
    } else {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? activeTransition : inactiveTransition,
      }}
      className={`inline-block will-change-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
