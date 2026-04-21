import type { Session } from '../state/store';
import { WORKOUTS, type DayKey } from '../data/workouts';
import { PixelCard, SectionHead } from '../components/PixelCard';
import type { ArcadeColor } from '../components/PixelCard';

type Props = { sessions: Session[] };

const DAY_ACCENT: Record<DayKey, ArcadeColor> = {
  A: 'mana',
  B: 'win',
  C: 'hp',
  D: 'legendary',
};

export function Log({ sessions }: Props) {
  const done = [...sessions].filter((s) => s.finishedAt).reverse();
  return (
    <div className="pb-[80px]">
      <SectionHead>
        <span>SESSION LOG · {done.length} CLEARED</span>
      </SectionHead>

      {done.length === 0 && (
        <div className="mx-[14px]">
          <PixelCard accent="line">
            <div className="text-center text-[14px] text-mute font-semibold">No sessions logged</div>
            <div className="text-center text-[12px] text-dim mt-[4px]">
              Finish a workout and it shows up here.
            </div>
          </PixelCard>
        </div>
      )}

      <div className="flex flex-col gap-[10px]">
        {done.map((s) => {
          const day = WORKOUTS[s.day];
          const completed = s.exercises.filter((e) => e.completed).length;
          const date = new Date(s.finishedAt!);
          const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          const hasPR = (s.pr?.length ?? 0) > 0;
          return (
            <div key={s.id} className="mx-[14px]">
              <PixelCard accent={DAY_ACCENT[s.day]}>
                <div className="flex items-center gap-[12px]">
                  <div
                    className="w-[44px] h-[44px] rounded-xs grid place-items-center pixel text-[15px] text-black"
                    style={{ background: day.color }}
                  >
                    {s.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-ink truncate">{day.name}</div>
                    <div className="text-[12px] text-dim mt-[2px]">
                      {dateStr} · {completed} lifts · <span className="text-xp">+{s.xp} XP</span>
                    </div>
                  </div>
                  {hasPR && (
                    <div
                      className="pixel text-[10px] text-xp tracking-[0.1em] px-[8px] py-[4px] rounded-xs"
                      style={{ background: '#000', border: '1px solid #FFD93D' }}
                    >
                      PR
                    </div>
                  )}
                </div>
              </PixelCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
