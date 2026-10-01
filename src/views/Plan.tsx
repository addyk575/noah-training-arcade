import { useState } from 'react';
import { PLAN_COPY } from '../data/plan';
import { DAY_ORDER, WORKOUTS, type DayKey } from '../data/workouts';
import { Thumb } from '../components/ExerciseImage';

const html = (s: string) => ({ __html: s });

export function Plan() {
  const [day, setDay] = useState<DayKey>('A');
  const w = WORKOUTS[day];

  return (
    <div>
      <div className="px-5 pt-8">
        <h1 className="text-[28px] font-bold">Program</h1>
        <p
          className="text-[15px] text-dim leading-relaxed mt-2 [&>b]:text-ink [&>b]:font-semibold"
          dangerouslySetInnerHTML={html(PLAN_COPY.mission.body)}
        />
      </div>

      <div className="mx-4 mt-6 grid grid-cols-3 gap-1 p-1 rounded-xl bg-card border border-line">
        {DAY_ORDER.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`h-10 rounded-lg text-[14px] font-semibold transition-colors ${day === d ? 'bg-card2 text-ink' : 'text-mute'}`}
          >
            Day {d}
          </button>
        ))}
      </div>

      <div className="card mx-4 mt-3 p-4">
        <div className="text-[18px] font-bold">{w.name}</div>
        <div className="text-[14px] text-dim mt-0.5">{w.focus}</div>
        <div className="mt-3 flex flex-col divide-y divide-line">
          {w.exercises.map((ex, i) => (
            <div key={ex.id} className="flex items-center gap-3 py-2.5">
              <Thumb id={ex.id} size={48} />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium leading-snug">
                  <span className="text-mute mr-1.5">{i + 1}</span>
                  {ex.name}
                </div>
                <div className="text-[13px] text-mute">{ex.target}</div>
              </div>
              {ex.superset && <span className="text-[11px] font-bold uppercase tracking-wide text-accent bg-accent/10 rounded-full px-2 py-1">Superset</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">How it works</div>
      <div className="mx-4 flex flex-col gap-2">
        {PLAN_COPY.why.map((x) => (
          <div key={x.h} className="card p-4">
            <div className="text-[15px] font-semibold">{x.h}</div>
            <p className="text-[14px] text-dim leading-relaxed mt-1 [&>b]:text-ink [&>b]:font-semibold" dangerouslySetInnerHTML={html(x.p)} />
          </div>
        ))}
        <div className="card p-4">
          <div className="text-[15px] font-semibold">Weekly goal</div>
          <p className="text-[14px] text-dim leading-relaxed mt-1 [&>b]:text-ink [&>b]:font-semibold" dangerouslySetInnerHTML={html(PLAN_COPY.allowance.p)} />
        </div>
      </div>

      <div className="section-title">12-week phases</div>
      <div className="card mx-4 divide-y divide-line">
        {PLAN_COPY.phases.map((p) => (
          <div key={p.wk} className="p-4">
            <div className="flex items-baseline justify-between">
              <div className="text-[15px] font-semibold">{p.name}</div>
              <div className="text-[12px] font-semibold text-mute">Weeks {p.wk}</div>
            </div>
            <div className="text-[13px] text-accent mt-0.5">{p.load}</div>
            <div className="text-[14px] text-dim leading-relaxed mt-1">{p.focus}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Rules</div>
      <div className="card mx-4 divide-y divide-line">
        {PLAN_COPY.rules.map((r, i) => (
          <div key={r.h} className="p-4 flex gap-3">
            <div className="w-6 h-6 rounded-full bg-card2 grid place-items-center text-[12px] font-bold text-dim shrink-0">{i + 1}</div>
            <div>
              <div className="text-[15px] font-semibold">{r.h}</div>
              <div className="text-[14px] text-dim leading-relaxed mt-0.5">{r.p}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
