import React from 'react';

/**
 * ShinyText inspired by reactbits.dev
 * Smooth metallic/iridescent shine animation across text
 */
export default function ShinyText({
  text = '',
  disabled = false,
  speed = 4,
  className = '',
  children,
}) {
  const content = children || text;

  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 via-pink-400 to-purple-300 bg-[200%_auto] ${
        disabled ? '' : 'animate-shine'
      } ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0.6) 0%, rgba(232, 93, 158, 1) 40%, rgba(192, 132, 252, 1) 60%, rgba(255, 255, 255, 0.6) 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: disabled ? 'none' : `shineText ${animationDuration} linear infinite`,
      }}
    >
      <style>{`
        @keyframes shineText {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      {content}
    </span>
  );
}
