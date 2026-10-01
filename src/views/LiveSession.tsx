import { useEffect, useState } from 'react';
import { WORKOUTS, videoUrl, type Exercise } from '../data/workouts';
import type { LoggedExercise, LoggedSet, Session } from '../state/store';
import { lastSets } from '../state/progress';
import { Demo, Thumb } from '../components/ExerciseImage';
import { CheckIcon, ChevronLeft, ChevronRight, PlayIcon, PlusIcon } from '../components/Icons';

type Props = {
  current: Session;
  allSessions: Session[];
  onLogSet: (exerciseId: string, weight: number, reps: number) => void;
  onUndoSet: (exerciseId: string) => void;
  onMarkComplete: (exerciseId: string, completed: boolean) => void;
  onFinish: () => void;
  onBack: () => void;
  onCancel: () => void;
};

function formatElapsed(startedAt: string, now: number): string {
  const sec = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function groupExercises(exercises: Exercise[]): Exercise[][] {
  const groups: Exercise[][] = [];
  for (const ex of exercises) {
    const prev = groups[groups.length - 1];
    if (ex.superset && prev && prev[0].superset === ex.superset) prev.push(ex);
    else groups.push([ex]);
  }
  return groups;
}

function defaultAmount(ex: Exercise): number | null {
  if (ex.unit === 'sec') {
    const min = ex.target.match(/(\d+)\s*min/);
    if (min) return Number(min[1]) * 60;
    const s = ex.target.match(/(\d+)\s*s/);
    return s ? Number(s[1]) : null;
  }
  const after = ex.target.includes('×') ? ex.target.split('×')[1] : ex.target;
  const n = after.match(/\d+/);
  return n ? Number(n[0]) : null;
}

function formatSet(ex: Exercise, s: LoggedSet): string {
  if (ex.unit === 'sec') return `${s.reps}s`;
  if (ex.unit === 'lb') return `${s.weight} × ${s.reps}`;
  return `${s.reps}`;
}

export function LiveSession({ current, allSessions, onLogSet, onUndoSet, onMarkComplete, onFinish, onBack, onCancel }: Props) {
  const day = WORKOUTS[current.day];
  const [now, setNow] = useState(() => Date.now());
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [openId]);

  const loggedFor = (id: string): LoggedExercise =>
    current.exercises.find((e) => e.exerciseId === id) ?? { exerciseId: id, sets: [], completed: false };

  const doneCount = day.exercises.filter((e) => loggedFor(e.id).completed).length;
  const anyLogged = current.exercises.some((e) => e.sets.length > 0);

  const logSet = (ex: Exercise, weight: number, reps: number) => {
    const count = loggedFor(ex.id).sets.length + 1;
    onLogSet(ex.id, weight, reps);
    if (count >= ex.sets) onMarkComplete(ex.id, true);
  };

  const undoSet = (ex: Exercise) => {
    const le = loggedFor(ex.id);
    onUndoSet(ex.id);
    if (le.completed && le.sets.length - 1 < ex.sets) onMarkComplete(ex.id, false);
  };

  const topBar = (
    <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between px-4 h-14">
        {openId ? (
          <button onClick={() => setOpenId(null)} className="flex items-center gap-1 text-accent font-medium text-[15px] -ml-1">
            <ChevronLeft size={20} /> Exercises
          </button>
        ) : (
          <button onClick={onBack} className="flex items-center gap-1 text-accent font-medium text-[15px] -ml-1">
            <ChevronLeft size={20} /> Home
          </button>
        )}
        <div className="text-[15px] font-semibold tabular-nums">{formatElapsed(current.startedAt, now)}</div>
        <button onClick={onFinish} disabled={!anyLogged} className="btn-primary px-4 h-9 text-[14px]">
          Finish
        </button>
      </div>
      <div className="h-[3px] bg-card2">
        <div className="h-full bg-good transition-all" style={{ width: `${(doneCount / day.exercises.length) * 100}%` }} />
      </div>
    </div>
  );

  if (openId) {
    const idx = day.exercises.findIndex((e) => e.id === openId);
    const ex = day.exercises[idx];
    const partners = ex.superset ? day.exercises.filter((e) => e.superset === ex.superset && e.id !== ex.id) : [];
    const next = day.exercises[idx + 1];
    return (
      <div className="pb-[110px]">
        {topBar}
        <div className="px-4 pt-4">
          <Demo id={ex.id} />
          {ex.demoNote && <p className="text-[12px] text-mute mt-2 leading-snug">{ex.demoNote}</p>}

          <div className="flex items-start justify-between gap-3 mt-4">
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-mute">
                Exercise {idx + 1} of {day.exercises.length}
              </div>
              <h1 className="text-[22px] font-bold leading-tight mt-0.5">{ex.name}</h1>
              <div className="text-[15px] text-dim mt-1">{ex.target}</div>
            </div>
            <a
              href={videoUrl(ex)}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-1.5 btn-secondary px-3 h-9 text-[13px]"
            >
              <PlayIcon size={14} /> Video
            </a>
          </div>

          {partners.length > 0 && (
            <button
              onClick={() => setOpenId(partners[0].id)}
              className="mt-3 w-full flex items-center gap-3 rounded-xl bg-accent/10 border border-accent/30 px-3 py-2.5 text-left"
            >
              <span className="text-[11px] font-bold text-accent uppercase tracking-wide shrink-0">Superset</span>
              <span className="text-[13px] text-ink flex-1 min-w-0">
                Alternate with <b className="font-semibold">{partners[0].name}</b>
              </span>
              <ChevronRight size={16} className="text-accent shrink-0" />
            </button>
          )}

          <div className="card mt-4 p-4">
            <div className="text-[13px] font-semibold text-dim mb-2">Coach notes</div>
            <ul className="space-y-1.5">
              {ex.cues.map((c, i) => (
                <li key={i} className="text-[14px] leading-snug flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <SetTable
            key={ex.id}
            ex={ex}
            logged={loggedFor(ex.id)}
            prev={lastSets(allSessions, ex.id)}
            onLog={(w, r) => logSet(ex, w, r)}
            onUndo={() => undoSet(ex)}
          />
        </div>

        <div
          className="fixed bottom-0 inset-x-0 mx-auto max-w-[480px] px-4 pt-3 bg-bg/95 backdrop-blur border-t border-line"
          style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          {next ? (
            <button onClick={() => setOpenId(next.id)} className="btn-secondary w-full h-12 flex items-center justify-center gap-1 text-[15px]">
              Next: {next.name} <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={() => setOpenId(null)} className="btn-secondary w-full h-12 text-[15px]">
              Back to all exercises
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {topBar}
      <div className="px-4 pt-5">
        <div className="text-[13px] font-semibold" style={{ color: day.color }}>
          Day {day.key}
        </div>
        <h1 className="text-[26px] font-bold leading-tight">{day.name}</h1>
        <div className="text-[14px] text-dim mt-1">
          {doneCount} of {day.exercises.length} exercises done · tap one to start
        </div>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-3">
        {groupExercises(day.exercises).map((group) =>
          group.length === 1 ? (
            <ExerciseRow key={group[0].id} ex={group[0]} n={day.exercises.indexOf(group[0]) + 1} logged={loggedFor(group[0].id)} allSessions={allSessions} onOpen={() => setOpenId(group[0].id)} />
          ) : (
            <div key={group[0].superset} className="rounded-2xl border border-accent/30 bg-accent/5 p-2">
              <div className="px-2 pt-1 pb-2 text-[12px] text-accent">
                <b className="font-bold uppercase tracking-wide">Superset</b> · one set of each, then rest
              </div>
              <div className="flex flex-col gap-2">
                {group.map((ex) => (
                  <ExerciseRow key={ex.id} ex={ex} n={day.exercises.indexOf(ex) + 1} logged={loggedFor(ex.id)} allSessions={allSessions} onOpen={() => setOpenId(ex.id)} />
                ))}
              </div>
            </div>
          ),
        )}
      </div>

      <button onClick={onCancel} className="block mx-auto mt-8 text-[14px] text-mute underline underline-offset-4">
        Discard workout
      </button>
    </div>
  );
}

function ExerciseRow({ ex, n, logged, allSessions, onOpen }: { ex: Exercise; n: number; logged: LoggedExercise; allSessions: Session[]; onOpen: () => void }) {
  const prev = lastSets(allSessions, ex.id);
  const best = prev.length ? prev.reduce((a, b) => (a.weight * a.reps >= b.weight * b.reps ? a : b)) : null;
  const done = logged.completed;
  return (
    <button onClick={onOpen} className="card w-full p-3 flex items-center gap-3 text-left active:bg-card2 transition-colors">
      <div className="relative">
        <Thumb id={ex.id} size={64} />
        {done && (
          <div className="absolute inset-0 rounded-xl bg-good/80 grid place-items-center text-white">
            <CheckIcon size={28} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold leading-snug">
          <span className="text-mute font-medium mr-1.5">{n}</span>
          {ex.name}
        </div>
        <div className="text-[13px] text-dim mt-0.5">{ex.target}</div>
        <div className="text-[12px] text-mute mt-0.5">
          {logged.sets.length > 0
            ? `${logged.sets.length} of ${ex.sets} sets logged`
            : best
              ? `Last time: ${formatSet(ex, best)}`
              : 'First time'}
        </div>
      </div>
      <ChevronRight size={18} className="text-mute shrink-0" />
    </button>
  );
}

function SetTable({ ex, logged, prev, onLog, onUndo }: { ex: Exercise; logged: LoggedExercise; prev: LoggedSet[]; onLog: (w: number, r: number) => void; onUndo: () => void }) {
  const [extra, setExtra] = useState(0);
  const lastPrev = prev[prev.length - 1];
  const [weight, setWeight] = useState(() => {
    const w = logged.sets[logged.sets.length - 1]?.weight ?? lastPrev?.weight;
    return w ? String(w) : '';
  });
  const [amount, setAmount] = useState('');

  const done = logged.sets.length;
  const rows = Math.max(ex.sets + extra, done);
  const showWeight = ex.unit === 'lb';
  const amountLabel = ex.unit === 'sec' ? 'Seconds' : 'Reps';
  const fallback = prev[done]?.reps ?? lastPrev?.reps ?? defaultAmount(ex);

  const submit = () => {
    const r = amount ? Number(amount) : fallback ?? 0;
    const w = showWeight ? Number(weight) || 0 : 0;
    if (r <= 0) return;
    onLog(w, r);
    setAmount('');
  };

  const cell = 'h-11 rounded-lg text-center text-[16px] font-semibold tabular-nums';
  const cols = showWeight ? 'grid-cols-[36px_1fr_1fr_1fr_44px]' : 'grid-cols-[36px_1fr_1fr_44px]';

  return (
    <div className="card mt-4 p-3">
      <div className={`grid ${cols} gap-2 px-1 pb-2 text-[11px] font-semibold text-mute uppercase tracking-wide`}>
        <div className="text-center">Set</div>
        <div className="text-center">Last time</div>
        {showWeight && <div className="text-center">lb</div>}
        <div className="text-center">{amountLabel}</div>
        <div />
      </div>
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: rows }).map((_, i) => {
          const s = logged.sets[i];
          const p = prev[i];
          const isNext = i === done;
          const isLastDone = i === done - 1;
          return (
            <div
              key={i}
              className={`grid ${cols} gap-2 items-center px-1 py-1 rounded-xl ${s ? 'bg-good/10' : isNext ? 'bg-card2' : ''}`}
            >
              <div className={`text-center text-[14px] font-bold ${s ? 'text-good' : 'text-dim'}`}>{i + 1}</div>
              <div className="text-center text-[13px] text-mute tabular-nums">{p ? formatSet(ex, p) : '—'}</div>
              {showWeight &&
                (s ? (
                  <div className={`${cell} grid place-items-center`}>{s.weight}</div>
                ) : isNext ? (
                  <input
                    type="number"
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    aria-label={`Set ${i + 1} weight`}
                    className={`${cell} bg-bg border border-line focus:border-accent w-full`}
                  />
                ) : (
                  <div className={`${cell} grid place-items-center text-mute/50`}>–</div>
                ))}
              {s ? (
                <div className={`${cell} grid place-items-center`}>{s.reps}</div>
              ) : isNext ? (
                <input
                  type="number"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={fallback ? String(fallback) : '0'}
                  aria-label={`Set ${i + 1} ${amountLabel.toLowerCase()}`}
                  className={`${cell} bg-bg border border-line focus:border-accent w-full placeholder:text-mute`}
                />
              ) : (
                <div className={`${cell} grid place-items-center text-mute/50`}>–</div>
              )}
              <button
                onClick={s ? onUndo : submit}
                disabled={s ? !isLastDone : !isNext}
                aria-label={s ? `Undo set ${i + 1}` : `Log set ${i + 1}`}
                className={`h-11 w-11 rounded-lg grid place-items-center transition-colors ${
                  s ? 'bg-good text-white' : isNext ? 'bg-accent text-white' : 'bg-card2 text-mute/40'
                }`}
              >
                <CheckIcon size={20} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <button onClick={() => setExtra((n) => n + 1)} className="flex items-center gap-1 text-[14px] font-medium text-accent">
          <PlusIcon size={16} /> Add set
        </button>
        <span className="text-[12px] text-mute">Tap ✓ to log · tap a green ✓ to undo</span>
      </div>
    </div>
  );
}
