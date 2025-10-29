// [file name]: src/components/Icon.jsx
import React from 'react';

const icons = {
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.139l-1.76 8.295c-.125.565-.465.7-1.237.435l-3.425-2.524-1.65 1.585c-.181.181-.337.337-.69.337l.247-3.49 6.335-5.723c.275-.275-.06-.428-.42-.15l-7.834 4.935-3.374-1.055c-.614-.191-.625-.614.127-.9l13.062-5.04c.51-.191.957.127.79.9z"/>
    </svg>
  ),
  location: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  rocket: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7.07 9.33C5.77 7.89 5 6.1 5 4.23 5 3.13 5.22 2.08 5.63 1.12 7.45 4.07 9.46 6.67 12 8.67c2.54-2 4.55-4.6 6.37-7.55.41.96.63 2.01.63 3.11 0 1.87-.77 3.66-2.07 5.1C15.9 10.5 15 12.16 15 14v4l3 3-3 3H9l-3-3 3-3v-4c0-1.84-.9-3.5-1.93-4.67z"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

export default function Icon({ name, className = "", size = 20, ...props }) {
  const icon = icons[name];
  
  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span 
      className={`icon ${className}`}
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size
      }}
      {...props}
    >
      {icon}
    </span>
  );
}