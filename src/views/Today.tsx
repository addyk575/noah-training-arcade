import { WORKOUTS, DAY_ORDER, type DayKey } from '../data/workouts';
import type { Session } from '../state/store';
import { allowanceCount, computeStreak, nextRecommendedDay, sessionsThisWeek, todayIndexInWeek } from '../state/progress';
import { Thumb } from '../components/ExerciseImage';
import { CheckIcon, ChevronRight, FlameIcon, LinkIcon } from '../components/Icons';

export type FinishedSummary = { dayName: string; sets: number; minutes: number; text: string };

type Props = {
  sessions: Session[];
  inProgress?: Session;
  finished: FinishedSummary | null;
  onDismissFinished: () => void;
  onStart: (day?: DayKey) => void;
};

const GOAL = 3;

function greeting(now: Date): string {
  const h = now.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

async function share(text: string) {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return;
    }
  } catch {
    return;
  }
  window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
}

export function Today({ sessions, inProgress, finished, onDismissFinished, onStart }: Props) {
  const now = new Date();
  const count = Math.min(allowanceCount(sessions, now), GOAL);
  const streak = computeStreak(sessions, now);
  const week = sessionsThisWeek(sessions, now);
  const todayIdx = todayIndexInWeek(now);
  const nextKey = inProgress?.day ?? nextRecommendedDay(sessions);
  const next = WORKOUTS[nextKey];

  return (
    <div>
      <div className="px-5 pt-8 flex items-start justify-between">
        <div>
          <div className="text-[13px] font-medium text-mute">
            {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-[28px] font-bold leading-tight mt-0.5">{greeting(now)}, Addy</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-card border border-line px-3 h-9 mt-1">
          <FlameIcon size={16} className={streak > 0 ? 'text-warn' : 'text-mute'} />
          <span className="text-[14px] font-semibold tabular-nums">{streak}</span>
        </div>
      </div>

      {finished && (
        <div className="mx-4 mt-5 rounded-2xl bg-good/10 border border-good/30 p-4">
          <div className="flex items-center gap-2 text-good font-semibold text-[15px]">
            <CheckIcon size={18} /> Workout saved
          </div>
          <div className="text-[14px] text-dim mt-1">
            {finished.dayName} · {finished.sets} sets · {finished.minutes} min
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => share(finished.text)} className="btn-primary flex-1 h-10 text-[14px] flex items-center justify-center gap-1.5">
              <LinkIcon size={16} /> Share with coach
            </button>
            <button onClick={onDismissFinished} className="btn-secondary px-4 h-10 text-[14px]">
              Done
            </button>
          </div>
        </div>
      )}

      <div className="card mx-4 mt-5 p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[15px] font-semibold">Weekly goal</div>
          <div className="text-[13px] text-mute">last 7 days</div>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-[34px] font-bold leading-none tabular-nums">{count}</span>
          <span className="text-[18px] text-mute font-semibold">/ {GOAL} workouts</span>
        </div>
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: GOAL }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < count ? 'bg-good' : 'bg-card2'}`} />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-[11px] font-medium ${i === todayIdx ? 'text-ink' : 'text-mute'}`}>{l}</span>
              <div
                className={`w-8 h-8 rounded-full grid place-items-center ${
                  week[i] ? 'bg-good text-white' : i === todayIdx ? 'border-2 border-accent' : 'bg-card2'
                }`}
              >
                {week[i] && <CheckIcon size={14} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">{inProgress ? 'In progress' : 'Up next'}</div>
      <div className="card mx-4 overflow-hidden">
        <div className="p-4">
          <div className="text-[13px] font-semibold" style={{ color: next.color }}>
            Day {next.key}
          </div>
          <div className="text-[22px] font-bold leading-tight">{next.name}</div>
          <div className="text-[14px] text-dim mt-1">
            {next.exercises.length} exercises · about {next.duration} min
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto -mx-4 px-4 no-scrollbar">
            {next.exercises.map((ex) => (
              <div key={ex.id} className="w-[76px] shrink-0">
                <Thumb id={ex.id} size={76} />
                <div className="text-[11px] text-dim leading-tight mt-1 line-clamp-2">{ex.name}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(nextKey)} className="btn-primary w-full h-14 rounded-none text-[16px]">
          {inProgress ? 'Resume workout' : 'Start workout'}
        </button>
      </div>

      <div className="section-title">All workouts</div>
      <div className="mx-4 flex flex-col gap-2">
        {DAY_ORDER.map((d) => {
          const w = WORKOUTS[d];
          const active = inProgress?.day === d;
          return (
            <button
              key={d}
              onClick={() => onStart(d)}
              className={`card w-full p-3 flex items-center gap-3 text-left active:bg-card2 transition-colors ${active ? 'border-accent' : ''}`}
            >
              <Thumb id={w.exercises[1]?.id ?? w.exercises[0].id} size={52} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold" style={{ color: w.color }}>
                  Day {d}
                </div>
                <div className="text-[16px] font-semibold leading-tight">{w.name}</div>
                <div className="text-[13px] text-mute mt-0.5">
                  {active ? 'In progress' : `${w.exercises.length} exercises`}
                </div>
              </div>
              <ChevronRight size={18} className="text-mute" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
