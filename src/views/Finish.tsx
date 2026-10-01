import { useEffect } from 'react';
import type { Session } from '../state/store';
import { allowanceCount } from '../state/progress';
import { bigCelebration } from '../lib/celebrate';
import { LinkIcon } from '../components/Icons';

export type FinishedSummary = {
  dayName: string;
  color: string;
  minutes: number;
  sets: number;
  volume: number;
  prs: { name: string; set: string }[];
  text: string;
};

const GOAL = 3;

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

export function Finish({ summary, sessions, onDone }: { summary: FinishedSummary; sessions: Session[]; onDone: () => void }) {
  const week = Math.min(allowanceCount(sessions), GOAL);

  useEffect(() => {
    bigCelebration();
  }, []);

  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
  const tiles = [
    { label: plural(summary.minutes, 'Minute', 'Minutes'), value: summary.minutes.toString() },
    { label: plural(summary.sets, 'Set', 'Sets'), value: summary.sets.toString() },
    { label: 'Pounds lifted', value: summary.volume.toLocaleString() },
    { label: plural(summary.prs.length, 'Personal best', 'Personal bests'), value: summary.prs.length.toString() },
  ];

  return (
    <div className="min-h-screen px-4 pt-10 pb-10 animate-pop">
      <div className="text-center">
        <div className="text-[72px] leading-none">🎉</div>
        <h1 className="text-[40px] font-extrabold leading-tight mt-3">Workout complete!</h1>
        <div className="text-[25px] font-semibold mt-1" style={{ color: summary.color }}>
          {summary.dayName}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-7">
        {tiles.map((t) => (
          <div key={t.label} className="card p-4 text-center">
            <div className="text-[38px] font-extrabold tabular-nums leading-none">{t.value}</div>
            <div className="text-[19px] text-mute mt-2">{t.label}</div>
          </div>
        ))}
      </div>

      {summary.prs.length > 0 && (
        <div className="card mt-3 p-4 border-warn/50">
          <div className="text-[23px] font-bold text-warn">🏆 New personal bests</div>
          {summary.prs.map((pr) => (
            <div key={pr.name} className="flex justify-between gap-3 text-[21px] mt-2">
              <span className="text-dim">{pr.name}</span>
              <span className="font-bold tabular-nums shrink-0">{pr.set}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-3 p-4">
        <div className="text-[23px] font-bold">
          {week >= GOAL ? 'Weekly goal hit! ✅' : `${week} of ${GOAL} workouts this week`}
        </div>
        <div className="flex gap-2 mt-3">
          {Array.from({ length: GOAL }).map((_, i) => (
            <div key={i} className={`flex-1 h-4 rounded-full ${i < week ? 'bg-good' : 'bg-card2'}`} />
          ))}
        </div>
        {week < GOAL && <div className="text-[20px] text-mute mt-2">{GOAL - week} more to hit your goal.</div>}
      </div>

      <button onClick={() => share(summary.text)} className="btn-primary w-full h-[72px] mt-6 text-[25px] flex items-center justify-center gap-2">
        <LinkIcon size={26} /> Send to Kayla
      </button>
      <button onClick={onDone} className="btn-secondary w-full h-16 mt-3 text-[23px]">
        Done
      </button>
    </div>
  );
}
