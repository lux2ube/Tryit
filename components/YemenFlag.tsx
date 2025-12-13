import React from 'react';

export const YemenFlag: React.FC<{ className?: string }> = ({ className = "w-6 h-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 900 600" 
    className={className}
    aria-label="Flag of Yemen"
  >
    {/* Top Stripe: Red */}
    <rect width="900" height="200" y="0" fill="#CE1126"/>
    
    {/* Middle Stripe: White */}
    <rect width="900" height="200" y="200" fill="#FFFFFF"/>
    
    {/* Bottom Stripe: Black */}
    <rect width="900" height="200" y="400" fill="#000000"/>
  </svg>
);