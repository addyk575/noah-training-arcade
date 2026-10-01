import { useState } from 'react';
import type { Session } from '../state/store';
import { WORKOUTS, getExercise } from '../data/workouts';
import { ChevronRight } from '../components/Icons';

export function Log({ sessions }: { sessions: Session[] }) {
  const done = sessions.filter((s) => s.finishedAt).reverse();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <div className="px-5 pt-8">
        <h1 className="text-[36px] font-bold">History</h1>
        <div className="text-[20px] text-mute mt-1">{done.length} workout{done.length === 1 ? '' : 's'} logged</div>
      </div>

      {done.length === 0 && (
        <div className="card mx-4 mt-5 p-5 text-center">
          <div className="text-[21px] font-semibold">Nothing here yet</div>
          <div className="text-[20px] text-mute mt-1">Finished workouts show up here.</div>
        </div>
      )}

      <div className="mx-4 mt-5 flex flex-col gap-2">
        {done.map((s) => {
          const day = WORKOUTS[s.day];
          if (!day) return null;
          const end = new Date(s.finishedAt!);
          const minutes = Math.round((end.getTime() - new Date(s.startedAt).getTime()) / 60000);
          const logged = s.exercises.filter((e) => e.sets.length > 0);
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full p-4 flex items-center gap-3 text-left">
                <div className="w-1 self-stretch rounded-full" style={{ background: day.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[19px] text-mute">
                    {end.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-[22px] font-semibold">{day.name}</div>
                  <div className="text-[19px] text-dim mt-0.5">
                    {logged.length} exercise{logged.length === 1 ? '' : 's'} · {minutes} min
                    {s.pr.length > 0 && <span className="text-warn font-semibold"> · {s.pr.length} PR</span>}
                  </div>
                </div>
                <ChevronRight size={18} className={`text-mute transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {logged.map((le) => {
                    const ex = getExercise(le.exerciseId);
                    if (!ex) return null;
                    return (
                      <div key={le.exerciseId} className="flex justify-between gap-3 text-[20px]">
                        <span className="text-dim">{ex.name}</span>
                        <span className="tabular-nums text-right">
                          {le.sets.map((st) => (ex.unit === 'lb' ? `${st.weight}×${st.reps}` : ex.unit === 'sec' ? `${st.reps}s` : st.reps)).join(', ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
