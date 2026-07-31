import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({
  text,
  className,
  showAsterisk,
  delay = 0,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className || ''}`} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative inline-block mr-[0.2em]"
        >
          {word}
          {showAsterisk && i === words.length - 1 && (
            <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none">
              *
            </span>
          )}
        </motion.span>
      ))}
    </div>
  );
};
