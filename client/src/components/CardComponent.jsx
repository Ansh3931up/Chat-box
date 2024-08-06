import React from 'react';

export function Card({ children, className }) {
  return (
    <div className={`bg-white shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={`text-2xl font-bold ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={`text-gray-600 ${className}`}>
      {children}
    </p>
  );
}

export function Button({ children, variant, size }) {
  const baseStyle = 'px-4 py-2 rounded-md focus:outline-none';
  const variantStyle = variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white';
  const sizeStyle = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle}`}>
      {children}
    </button>
  );
}
