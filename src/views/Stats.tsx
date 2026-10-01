import type { Session } from '../state/store';
import { ACHIEVEMENTS } from '../data/achievements';
import { computeStreak } from '../state/progress';
import { DAY_ORDER, WORKOUTS, getExercise } from '../data/workouts';
import { Thumb } from '../components/ExerciseImage';

type Best = { weight: number; reps: number; at: string };

function personalBests(sessions: Session[]): [string, Best][] {
  const best: Record<string, Best> = {};
  for (const s of sessions) {
    if (!s.finishedAt) continue;
    for (const le of s.exercises) {
      for (const st of le.sets) {
        const cur = best[le.exerciseId];
        const better = !cur || st.weight > cur.weight || (st.weight === cur.weight && st.reps > cur.reps);
        if (better) best[le.exerciseId] = { weight: st.weight, reps: st.reps, at: s.finishedAt };
      }
    }
  }
  const order = DAY_ORDER.flatMap((d) => WORKOUTS[d].exercises.map((e) => e.id));
  return order.filter((id) => best[id]).map((id) => [id, best[id]]);
}

export function Stats({ sessions }: { sessions: Session[] }) {
  const done = sessions.filter((s) => s.finishedAt);
  const volume = done.reduce((n, s) => n + s.exercises.reduce((m, e) => m + e.sets.reduce((k, st) => k + st.weight * st.reps, 0), 0), 0);
  const totalSets = done.reduce((n, s) => n + s.exercises.reduce((m, e) => m + e.sets.length, 0), 0);
  const bests = personalBests(sessions);
  const unlocked = new Set(ACHIEVEMENTS.filter((a) => a.check(sessions)).map((a) => a.id));

  const tiles = [
    { label: 'Workouts', value: done.length.toString() },
    { label: 'Day streak', value: computeStreak(sessions).toString() },
    { label: 'Sets logged', value: totalSets.toLocaleString() },
    { label: 'Pounds lifted', value: volume >= 10000 ? `${Math.round(volume / 1000)}k` : volume.toLocaleString() },
  ];

  return (
    <div>
      <div className="px-5 pt-8">
        <h1 className="text-[28px] font-bold">Progress</h1>
      </div>

      <div className="mx-4 mt-5 grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="card p-4">
            <div className="text-[26px] font-bold tabular-nums leading-none">{t.value}</div>
            <div className="text-[13px] text-mute mt-1.5">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Personal bests</div>
      {bests.length === 0 ? (
        <div className="card mx-4 p-5 text-center">
          <div className="text-[15px] font-semibold">No records yet</div>
          <div className="text-[14px] text-mute mt-1">Finish a workout and your best sets show up here.</div>
        </div>
      ) : (
        <div className="card mx-4 divide-y divide-line">
          {bests.map(([id, b]) => {
            const ex = getExercise(id)!;
            return (
              <div key={id} className="flex items-center gap-3 p-3">
                <Thumb id={id} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-medium truncate">{ex.name}</div>
                  <div className="text-[12px] text-mute">
                    {new Date(b.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="text-[16px] font-bold tabular-nums">
                  {ex.unit === 'lb' ? `${b.weight} lb × ${b.reps}` : ex.unit === 'sec' ? `${b.reps}s` : `${b.reps} reps`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="section-title">
        Milestones · {unlocked.size} of {ACHIEVEMENTS.length}
      </div>
      <div className="mx-4 grid grid-cols-3 gap-2">
        {ACHIEVEMENTS.map((a) => {
          const has = unlocked.has(a.id);
          return (
            <div key={a.id} className={`card p-3 text-center ${has ? 'border-good/40' : 'opacity-50'}`} title={a.description}>
              <div className={`text-[24px] ${has ? '' : 'grayscale'}`}>{a.icon}</div>
              <div className="text-[12px] font-semibold leading-tight mt-1">{a.name}</div>
              <div className="text-[11px] text-mute leading-tight mt-0.5">{a.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
