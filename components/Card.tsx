'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
