import type { Session } from '../state/store';
import { WORKOUTS, type DayKey } from '../data/workouts';

type Props = { sessions: Session[] };

const DAY_COLOR: Record<DayKey, string> = {
  A: '#4DD4FF',
  B: '#10F8A0',
  C: '#FF9A3C',
  D: '#A855F7',
};

export function Log({ sessions }: Props) {
  const done = [...sessions].filter((s) => s.finishedAt).reverse();
  return (
    <div className="pb-[80px]">
      <div className="flex items-baseline justify-between px-[18px] mt-[20px] mb-[10px]">
        <span className="eyebrow">SESSION LOG</span>
        <span className="meta">{done.length} TOTAL</span>
      </div>

      {done.length === 0 && (
        <div
          className="mx-[16px] rounded-lg p-[16px] text-center"
          style={{ background: '#151A2E', border: '1px solid #2D3560' }}
        >
          <div className="text-[14px] text-mute font-semibold">No sessions logged</div>
          <div className="text-[12px] text-dim mt-[3px]">
            Finish a workout and it shows up here.
          </div>
        </div>
      )}

      <div className="px-[16px] flex flex-col gap-[8px]">
        {done.map((s) => {
          const day = WORKOUTS[s.day];
          const completed = s.exercises.filter((e) => e.completed).length;
          const date = new Date(s.finishedAt!);
          const dateStr = date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          const hasPR = (s.pr?.length ?? 0) > 0;
          return (
            <div
              key={s.id}
              className="rounded-lg p-[12px] flex items-center gap-[12px] relative overflow-hidden"
              style={{ background: '#151A2E', border: '1px solid #2D3560' }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: DAY_COLOR[s.day],
                }}
              />
              <div
                className="w-[40px] h-[40px] rounded-md grid place-items-center display text-[15px] text-black ml-[4px]"
                style={{ background: DAY_COLOR[s.day] }}
              >
                {s.day}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-ink truncate">{day.name}</div>
                <div className="mono text-[10px] text-mute mt-[2px] tracking-[0.06em]">
                  {dateStr.toUpperCase()} · {completed} LIFTS · +{s.xp} XP
                </div>
              </div>
              {hasPR && (
                <div
                  className="display text-[10px] text-xp tracking-[0.1em] px-[8px] py-[4px] rounded-xs"
                  style={{ background: '#0A0B1A', border: '1px solid #FFD93D' }}
                >
                  PR
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
