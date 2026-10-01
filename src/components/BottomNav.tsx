import { ChartIcon, ClockIcon, HomeIcon, ListIcon } from './Icons';

export type Tab = 'today' | 'plan' | 'stats' | 'log';

const TABS = [
  { key: 'today', label: 'Today', Icon: HomeIcon },
  { key: 'plan', label: 'Program', Icon: ListIcon },
  { key: 'stats', label: 'Progress', Icon: ChartIcon },
  { key: 'log', label: 'History', Icon: ClockIcon },
] as const;

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 mx-auto max-w-[480px] flex z-20 border-t border-line bg-bg/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 h-[68px] flex flex-col items-center justify-center gap-1 ${on ? 'text-accent' : 'text-mute'}`}
          >
            <Icon size={26} />
            <span className="text-[14px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
