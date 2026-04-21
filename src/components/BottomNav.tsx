export type Tab = 'today' | 'plan' | 'session' | 'stats' | 'log';

type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
  onStart: () => void;
};

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'today', label: 'TODAY', icon: '⌂' },
  { key: 'plan', label: 'PLAN', icon: '▤' },
  { key: 'session', label: 'START', icon: '⚔' },
  { key: 'stats', label: 'STATS', icon: '◆' },
  { key: 'log', label: 'LOG', icon: '▦' },
];

export function BottomNav({ active, onChange, onStart }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] h-[60px] flex z-20"
      style={{
        background: '#0A0B1A',
        borderTop: '1px solid #2D3560',
      }}
    >
      {TABS.map(({ key, label, icon }) => {
        const isCenter = key === 'session';
        const isActive = active === key;
        const color = isCenter ? '#FFD93D' : isActive ? '#FFD93D' : '#6B6B95';
        const handle = () => (isCenter ? onStart() : onChange(key));
        return (
          <button
            key={key}
            onClick={handle}
            className={`flex-1 flex flex-col items-center justify-center gap-[3px] ${
              isCenter ? '-mt-[10px]' : ''
            }`}
          >
            <div
              className="grid place-items-center"
              style={
                isCenter
                  ? {
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #FFD93D, #FF4785)',
                      color: '#000',
                      fontSize: 20,
                      boxShadow: '0 0 16px rgba(255,217,61,0.6)',
                    }
                  : {
                      width: 26,
                      height: 26,
                      fontSize: 18,
                      color,
                    }
              }
            >
              {icon}
            </div>
            <span
              className="display text-[9px] tracking-[0.12em]"
              style={{ color }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
