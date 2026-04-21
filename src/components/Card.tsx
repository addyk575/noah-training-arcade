import type { ReactNode, CSSProperties } from 'react';
import type { ArcadeColor } from './PixelCard';

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
  accent?: ArcadeColor | 'none';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  leftStripe?: boolean;
};

export function Card({ children, accent = 'none', onClick, className = '', style, leftStripe = false }: Props) {
  const color = accent === 'none' ? '#2D3560' : HEX[accent];
  const base: CSSProperties = {
    background: '#151A2E',
    border: `1px solid ${color}`,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };
  return (
    <div className={className} style={base} onClick={onClick}>
      {leftStripe && accent !== 'none' && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: color,
          }}
        />
      )}
      {children}
    </div>
  );
}
