'use client';

import React from 'react';

export const StarBorder = ({
  as: Component = 'div',
  className = '',
  color = 'white',
  speed = '6s',
  children,
  ...rest
}: any) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-full p-[1px] ${className}`}
      {...rest}
    >
      <div
        className="absolute inset-[-100%] w-[300%] h-[300%] animate-[star-movement-bottom_linear_infinite]"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, transparent 50%, ${color} 100%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute inset-[-100%] w-[300%] h-[300%] animate-[star-movement-top_linear_infinite]"
        style={{
          background: `conic-gradient(from -90deg at 50% 50%, transparent 50%, ${color} 100%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative w-full h-full bg-white dark:bg-black rounded-full overflow-hidden">
        {children}
      </div>
    </Component>
  );
};
