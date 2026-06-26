'use client';

import { motion } from 'framer-motion';

export const BlurText = ({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      initial={{ filter: 'blur(20px)', opacity: 0, y: 15 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {text}
    </motion.div>
  );
};
