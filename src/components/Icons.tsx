export function FlameIcon({ className = '', size = 14 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2s4 4 4 8a4 4 0 0 1-4 4 4 4 0 0 1-4-4c0-2 1-4 2-5 .5 1 1 2 2 2 0-2 0-4 0-5zM6 14c0 4 3 8 6 8s6-4 6-8c0 0-2 2-4 2-1 0-2-1-2-2 0 3-2 4-3 4-1 0-3-1-3-4z" />
    </svg>
  );
}

export function TrophyIcon({ className = '', size = 14 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 3h12v3a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V3zm-4 1h3v3a3 3 0 0 1-3-3V4zm17 0h3v0a3 3 0 0 1-3 3V4zM10 13h4v3h2v2H8v-2h2v-3z" />
    </svg>
  );
}

export function CheckIcon({ className = '', size = 12 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChevronRight({ className = '', size = 12 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export function ChevronLeft({ className = '', size = 12 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}

export function HomeIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12L12 3l9 9" /><path d="M5 10v10h14V10" />
    </svg>
  );
}

export function PlanIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  );
}

export function DumbbellIcon({ className = '', size = 22 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="9" width="2" height="6" /><rect x="4" y="7" width="2" height="10" /><line x1="6" y1="12" x2="18" y2="12" /><rect x="18" y="7" width="2" height="10" /><rect x="20" y="9" width="2" height="6" />
    </svg>
  );
}

export function StatsIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="20" x2="6" y2="12" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="8" />
    </svg>
  );
}

export function LogIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 3h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" /><polyline points="14 3 14 8 20 8" />
    </svg>
  );
}
