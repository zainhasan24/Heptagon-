import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export interface StyleSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: StyleSegment[];
  className?: string;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({
  segments,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  let globalWordCount = 0;

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className || ''}`}>
      {segments.map((segment, sIdx) => {
        const words = segment.text.split(" ");
        return words.map((word, wIdx) => {
          const currentIdx = globalWordCount++;
          return (
            <motion.span
              key={`${sIdx}-${wIdx}`}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: currentIdx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`${segment.className || ''} inline-block mr-[0.25em]`}
            >
              {word}
            </motion.span>
          );
        });
      })}
    </div>
  );
};
