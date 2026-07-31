import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  // Smooth springs for cursor positioning
  const cursorX = useSpring(-100, { stiffness: 500, damping: 35 });
  const cursorY = useSpring(-100, { stiffness: 500, damping: 35 });

  useEffect(() => {
    // Only enable on non-touch fine pointer devices
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isPointerFine || !isVisible) return null;

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-primary/60 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 52 : 32,
          height: isHovered ? 52 : 32,
          backgroundColor: isHovered ? 'rgba(222, 219, 200, 0.15)' : 'rgba(222, 219, 200, 0)',
          borderColor: isHovered ? '#E1E0CC' : 'rgba(225, 224, 204, 0.5)',
          scale: isHovered ? 1.25 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 8 : 5,
          height: isHovered ? 8 : 5,
          opacity: isHovered ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </>
  );
}
