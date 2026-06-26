'use client';

export const ShinyText = ({
  text,
  className = '',
  shimmerWidth = 100,
}: {
  text: string;
  className?: string;
  shimmerWidth?: number;
}) => {
  return (
    <span
      className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_auto] animate-shine ${className}`}
    >
      {text}
    </span>
  );
};
