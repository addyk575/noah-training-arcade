import { useState } from 'react';
import { WORKOUTS, DAY_ORDER, type DayKey } from '../data/workouts';
import type { Session } from '../state/store';
import { allowanceCount, computeStreak, nextRecommendedDay, sessionsThisWeek, todayIndexInWeek } from '../state/progress';
import { Thumb } from '../components/ExerciseImage';
import { CheckIcon, FlameIcon, LinkIcon } from '../components/Icons';

export type FinishedSummary = { dayName: string; sets: number; minutes: number; text: string };

type Props = {
  sessions: Session[];
  inProgress?: Session;
  finished: FinishedSummary | null;
  onDismissFinished: () => void;
  onStart: (day?: DayKey) => void;
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

export function Today({ sessions, inProgress, finished, onDismissFinished, onStart }: Props) {
  const now = new Date();
  const count = Math.min(allowanceCount(sessions, now), GOAL);
  const streak = computeStreak(sessions, now);
  const week = sessionsThisWeek(sessions, now);
  const todayIdx = todayIndexInWeek(now);
  const recommended = nextRecommendedDay(sessions);
  const [picked, setPicked] = useState<DayKey>(inProgress?.day ?? recommended);
  const day = WORKOUTS[picked];

  return (
    <div>
      <div className="px-5 pt-8 flex items-start justify-between">
        <div>
          <div className="text-[19px] font-medium text-mute">
            {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-[36px] font-bold leading-tight mt-0.5">Hi, Addy</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-card border border-line px-3 h-9 mt-1">
          <FlameIcon size={16} className={streak > 0 ? 'text-warn' : 'text-mute'} />
          <span className="text-[20px] font-semibold tabular-nums">{streak}</span>
        </div>
      </div>

      {finished && (
        <div className="mx-4 mt-5 rounded-2xl bg-good/10 border border-good/30 p-4">
          <div className="flex items-center gap-2 text-good font-semibold text-[21px]">
            <CheckIcon size={18} /> Workout saved
          </div>
          <div className="text-[20px] text-dim mt-1">
            {finished.dayName} · {finished.sets} sets · {finished.minutes} min
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => share(finished.text)} className="btn-primary flex-1 h-10 text-[20px] flex items-center justify-center gap-1.5">
              <LinkIcon size={16} /> Share with coach
            </button>
            <button onClick={onDismissFinished} className="btn-secondary px-4 h-10 text-[20px]">
              Done
            </button>
          </div>
        </div>
      )}

      <div className="section-title">Workout</div>
      <div className="card mx-4 overflow-hidden">
        <div className="grid grid-cols-3 gap-1 p-1 m-3 mb-0 rounded-xl bg-bg">
          {DAY_ORDER.map((d) => {
            const w = WORKOUTS[d];
            const on = d === picked;
            return (
              <button
                key={d}
                onClick={() => setPicked(d)}
                className={`h-16 rounded-lg flex flex-col items-center justify-center transition-colors ${on ? 'bg-card2' : ''}`}
              >
                <span className="text-[18px] font-bold" style={{ color: on ? w.color : undefined }}>
                  Day {d}
                </span>
                <span className={`text-[19px] font-medium ${on ? 'text-ink' : 'text-mute'}`}>{w.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        <div className="p-4">
          <div className="text-[19px] font-semibold" style={{ color: day.color }}>
            Day {day.key}
            {picked === inProgress?.day ? ' · in progress' : picked === recommended && !inProgress ? ' · up next' : ''}
          </div>
          <div className="text-[30px] font-bold leading-tight">{day.name}</div>
          <div className="text-[20px] text-dim mt-1">
            {day.exercises.length} exercises · about {day.duration} min
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto -mx-4 px-4 no-scrollbar">
            {day.exercises.map((ex) => (
              <div key={ex.id} className="w-[136px] shrink-0">
                <Thumb id={ex.id} size={136} />
                <div className="text-[17px] text-dim leading-tight mt-1 line-clamp-2">{ex.name}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(picked)} className="btn-primary w-full h-16 rounded-none text-[23px]">
          {picked === inProgress?.day ? 'Resume workout' : `Start Day ${picked}`}
        </button>
      </div>

      <div className="card mx-4 mt-6 p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[21px] font-semibold">Weekly goal</div>
          <div className="text-[19px] text-mute">last 7 days</div>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-[44px] font-bold leading-none tabular-nums">{count}</span>
          <span className="text-[26px] text-mute font-semibold">/ {GOAL} workouts</span>
        </div>
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: GOAL }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < count ? 'bg-good' : 'bg-card2'}`} />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-[17px] font-medium ${i === todayIdx ? 'text-ink' : 'text-mute'}`}>{l}</span>
              <div
                className={`w-10 h-10 rounded-full grid place-items-center ${
                  week[i] ? 'bg-good text-white' : i === todayIdx ? 'border-2 border-accent' : 'bg-card2'
                }`}
              >
                {week[i] && <CheckIcon size={14} />}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
