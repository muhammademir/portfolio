'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const Magnet = ({
  children,
  className = '',
  padding = 100,
  disabled = false,
  magnetStrength = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Check if within padding
    const isWithinBounds =
      clientX >= left - padding &&
      clientX <= left + width + padding &&
      clientY >= top - padding &&
      clientY <= top + height + padding;

    if (isWithinBounds) {
      setPosition({ x: middleX * magnetStrength, y: middleY * magnetStrength });
    } else {
      reset();
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
