import type { ReactNode, CSSProperties } from 'react';

export type ArcadeColor = 'xp' | 'hp' | 'mana' | 'legendary' | 'win' | 'line' | 'bronze' | 'silver' | 'gold';

const HEX: Record<ArcadeColor, string> = {
  xp: '#FFD93D',
  hp: '#FF4785',
  mana: '#4DD4FF',
  legendary: '#A855F7',
  win: '#10F8A0',
  line: '#2D3560',
  bronze: '#D4894F',
  silver: '#C0C8E0',
  gold: '#FFD93D',
};

type Props = {
  children: ReactNode;
  accent?: ArcadeColor;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

export function PixelCard({ children, accent = 'legendary', glow = false, onClick, className = '', style }: Props) {
  const color = HEX[accent];
  const shadow = glow
    ? `0 0 20px ${color}66, inset 0 0 20px ${color}14`
    : `4px 4px 0 ${color}40`;
  const base: CSSProperties = {
    background: '#151A2E',
    border: `2px solid ${color}`,
    borderRadius: 4,
    padding: 14,
    position: 'relative',
    boxShadow: shadow,
    ...style,
  };
  const bracket = (pos: 'tl' | 'tr' | 'bl' | 'br'): CSSProperties => {
    const base: CSSProperties = { position: 'absolute', width: 8, height: 8 };
    if (pos === 'tl') return { ...base, top: -2, left: -2, borderTop: `3px solid ${color}`, borderLeft: `3px solid ${color}` };
    if (pos === 'tr') return { ...base, top: -2, right: -2, borderTop: `3px solid ${color}`, borderRight: `3px solid ${color}` };
    if (pos === 'bl') return { ...base, bottom: -2, left: -2, borderBottom: `3px solid ${color}`, borderLeft: `3px solid ${color}` };
    return { ...base, bottom: -2, right: -2, borderBottom: `3px solid ${color}`, borderRight: `3px solid ${color}` };
  };
  return (
    <div className={className} style={base} onClick={onClick}>
      <span style={bracket('tl')} />
      <span style={bracket('tr')} />
      <span style={bracket('bl')} />
      <span style={bracket('br')} />
      {children}
    </div>
  );
}

export function SectionHead({ children, color = '#6B6B95' }: { children: ReactNode; color?: string }) {
  return (
    <div className="px-[14px] py-[12px] flex items-center justify-between">
      <div className="pixel text-[9px]" style={{ color }}>
        ▸ {children}
      </div>
    </div>
  );
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="divider py-[14px]">
      ─── {children} ───
    </div>
  );
}
