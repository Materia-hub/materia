import React from 'react';

interface MateriaLogoProps {
  className?: string;
  size?: number;
}

export default function MateriaLogo({ className = '', size = 32 }: MateriaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern geometric "M" lettermark */}
      <path
        d="M15 75V25L35 45L50 30L65 45L85 25V75H75V45L65 55L50 40L35 55L25 45V75H15Z"
        fill="currentColor"
        className="text-blue-600"
      />
      {/* Optional accent - small dots for material/tech feel */}
      <circle cx="50" cy="70" r="3" fill="currentColor" className="text-blue-500" opacity="0.6" />
    </svg>
  );
}
