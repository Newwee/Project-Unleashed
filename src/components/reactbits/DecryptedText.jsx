import React, { useState, useEffect, useRef } from 'react';

/**
 * DecryptedText inspired by reactbits.dev
 * Cyberpunk/matrix text scrambling animation
 */
export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  className = '',
  parentClassName = '',
  animateOn = 'view', // 'view' | 'hover'
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  const scramble = () => {
    let currentIteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (sequential) {
              if (index < currentIteration) {
                return text[index];
              }
            } else {
              if (currentIteration >= maxIterations) {
                return text[index];
              }
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      currentIteration += 1;
      if (currentIteration > text.length + maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (animateOn === 'view' && !hasAnimated) {
      const cleanup = scramble();
      setHasAnimated(true);
      return cleanup;
    }
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovering(true);
      scramble();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block ${parentClassName}`}
      {...props}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
}
