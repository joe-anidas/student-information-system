import React from 'react';

function Card({ children, className = "", onClick, hover = false }) {
  const baseClasses = "bg-white rounded-xl shadow-lg border border-gray-100 p-6";
  const hoverClasses = hover ? "cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
