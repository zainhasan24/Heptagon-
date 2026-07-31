import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

interface FeatureCardProps {
  delay: number;
  title?: string;
  num?: string;
  icon?: string;
  children?: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  delay,
  title,
  num,
  icon,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative h-full w-full rounded-xl overflow-hidden ${
        title ? 'bg-[#212121] p-6 flex flex-col justify-between border border-white/5' : ''
      }`}
    >
      {title ? (
        <>
          <div>
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              {icon && (
                <img
                  src={icon}
                  alt={title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover bg-black/20"
                />
              )}
              {num && (
                <span className="text-primary/40 text-xs sm:text-sm font-mono tracking-wider">
                  ({num})
                </span>
              )}
            </div>
            <h3 className="text-primary text-lg sm:text-xl font-medium mb-5 sm:mb-6">
              {title}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {children}
            </div>
          </div>
          <a
            href="#learn-more"
            onClick={(e) => e.preventDefault()}
            className="group flex items-center gap-2 text-primary/60 text-xs sm:text-sm mt-6 sm:mt-8 hover:text-primary transition-colors w-fit"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3.5 h-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </>
      ) : (
        children
      )}
    </motion.div>
  );
};

export const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3">
    <Check className="text-primary w-4 h-4 shrink-0" />
    <span className="text-gray-400 text-xs sm:text-sm">{text}</span>
  </div>
);
