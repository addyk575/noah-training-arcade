import { useState } from 'react';
import { WORKOUTS, DAY_ORDER, type DayKey } from '../data/workouts';
import type { Session } from '../state/store';
import { allowanceCount, computeStreak, nextRecommendedDay, sessionsThisWeek, todayIndexInWeek } from '../state/progress';
import { Thumb } from '../components/ExerciseImage';
import { CheckIcon, FlameIcon } from '../components/Icons';

type Props = {
  sessions: Session[];
  inProgress?: Session;
  onStart: (day?: DayKey) => void;
};

const GOAL = 3;
export function Today({ sessions, inProgress, onStart }: Props) {
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
          <div className="text-[22px] font-medium text-mute">
            {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-[40px] font-bold leading-tight mt-0.5">Hi, Addy</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-card border border-line px-3 h-9 mt-1">
          <FlameIcon size={22} className={streak > 0 ? 'text-warn' : 'text-mute'} />
          <span className="text-[23px] font-semibold tabular-nums">{streak}</span>
        </div>
      </div>


      <div className="section-title">Kayla’s program</div>
      <div className="card mx-4 overflow-hidden">
        <div className="flex flex-col gap-2 p-3 pb-0">
          {DAY_ORDER.map((d) => {
            const w = WORKOUTS[d];
            const on = d === picked;
            const tag = d === inProgress?.day ? 'In progress' : d === recommended && !inProgress ? 'Up next' : '';
            return (
              <button
                key={d}
                onClick={() => setPicked(d)}
                className={`w-full min-h-[72px] px-4 py-2 rounded-xl flex items-center gap-3 text-left border-2 transition-colors ${
                  on ? 'bg-card2' : 'border-transparent bg-bg'
                }`}
                style={on ? { borderColor: w.color } : undefined}
              >
                <span className="text-[26px] font-extrabold w-9 shrink-0" style={{ color: w.color }}>
                  {d}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-[24px] font-semibold leading-tight ${on ? 'text-ink' : 'text-dim'}`}>{w.name}</span>
                  {tag && <span className="block text-[19px] text-mute">{tag}</span>}
                </span>
                {on && <CheckIcon size={28} className="shrink-0" />}
              </button>
            );
          })}
        </div>
        <div className="p-4">
          <div className="text-[23px] text-dim">
            {day.exercises.length} exercises · about {day.duration} min
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto -mx-4 px-4 no-scrollbar">
            {day.exercises.map((ex) => (
              <div key={ex.id} className="w-[168px] shrink-0">
                <Thumb id={ex.id} size={168} />
                <div className="text-[19px] text-dim leading-tight mt-1 line-clamp-2">{ex.name}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(picked)} className="btn-primary w-full h-[76px] rounded-none text-[28px]">
          {picked === inProgress?.day ? 'Resume workout' : `Start Day ${picked}`}
        </button>
      </div>

      <div className="card mx-4 mt-6 p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[24px] font-semibold">Weekly goal</div>
          <div className="text-[22px] text-mute">last 7 days</div>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-[48px] font-bold leading-none tabular-nums">{count}</span>
          <span className="text-[30px] text-mute font-semibold">/ {GOAL} workouts</span>
        </div>
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: GOAL }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < count ? 'bg-good' : 'bg-card2'}`} />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-[19px] font-medium ${i === todayIdx ? 'text-ink' : 'text-mute'}`}>{l}</span>
              <div
                className={`w-10 h-10 rounded-full grid place-items-center ${
                  week[i] ? 'bg-good text-white' : i === todayIdx ? 'border-2 border-accent' : 'bg-card2'
                }`}
              >
                {week[i] && <CheckIcon size={20} />}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
