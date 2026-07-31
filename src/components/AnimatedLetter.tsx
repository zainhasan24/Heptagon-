import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
}

export const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  char,
  index,
  totalChars,
  progress,
}) => {
  const charProgress = index / Math.max(totalChars, 1);
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text,
  className,
}) => {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p ref={targetRef} className={className}>
      {characters.map((char, i) => (
        <AnimatedLetter
          key={i}
          char={char}
          index={i}
          totalChars={totalChars}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
};
