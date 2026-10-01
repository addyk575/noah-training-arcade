import { useCallback, useEffect, useState } from 'react';
import { WORKOUTS, videoUrl, type Exercise } from '../data/workouts';
import type { LoggedExercise, LoggedSet, Session } from '../state/store';
import { lastSets, setScore as score } from '../state/progress';
import { Demo, Photo } from '../components/ExerciseImage';
import { CheckIcon, ChevronLeft, ChevronRight, PlayIcon, PlusIcon } from '../components/Icons';
import { RestTimer, type RestState } from '../components/RestTimer';
import { Toast, type ToastMsg } from '../components/Toast';
import { smallBurst } from '../lib/celebrate';

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
  const [rest, setRest] = useState<RestState | null>(null);
  const [superNext, setSuperNext] = useState<Exercise | null>(null);
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

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
    const le = loggedFor(ex.id);
    const count = le.sets.length + 1;
    const set = { weight, reps };
    const history = allSessions.flatMap((s) => s.exercises.filter((e) => e.exerciseId === ex.id).flatMap((e) => e.sets));
    const prevBest = Math.max(0, ...history.map((h) => score(ex, h)), ...le.sets.map((h) => score(ex, h)));
    const isBest = history.length > 0 && score(ex, set) > prevBest;
    const finishedEx = count >= ex.sets;

    onLogSet(ex.id, weight, reps);
    if (finishedEx) onMarkComplete(ex.id, true);

    if (isBest) {
      smallBurst();
      setToast({ id: Date.now(), icon: '🏆', title: 'New personal best!', detail: `${ex.name}: ${formatSet(ex, set)}` });
    } else if (finishedEx) {
      smallBurst();
      setToast({ id: Date.now(), icon: '💪', title: 'Exercise done!', detail: ex.name });
    }

    const allDone = finishedEx && day.exercises.every((e) => e.id === ex.id || loggedFor(e.id).completed);
    if (allDone) {
      setRest(null);
      setSuperNext(null);
      setToast({ id: Date.now(), icon: '🎉', title: 'Every exercise done!', detail: 'Tap Finish to wrap up.' });
      return;
    }

    const group = ex.superset ? day.exercises.filter((e) => e.superset === ex.superset) : [ex];
    const partner = group[group.indexOf(ex) + 1];
    if (partner && loggedFor(partner.id).sets.length < count) {
      setRest(null);
      setSuperNext(partner);
      return;
    }

    let next: Exercise | undefined;
    if (group.length > 1 && group[0].id !== ex.id && loggedFor(group[0].id).sets.length < group[0].sets) next = group[0];
    else if (finishedEx) next = day.exercises.find((e, i) => i > day.exercises.indexOf(ex) && !loggedFor(e.id).completed);
    const secs = ex.xp >= 40 ? 90 : 60;
    setSuperNext(null);
    setRest({ endsAt: Date.now() + secs * 1000, total: secs, next: next ? { id: next.id, label: next.name } : undefined });
  };

  const goTo = (id: string) => {
    setRest(null);
    setSuperNext(null);
    setOpenId(id);
  };

  const overlays = (
    <>
      {toast && <Toast msg={toast} onDone={clearToast} />}
      {rest && <RestTimer rest={rest} onChange={setRest} onClose={() => setRest(null)} onGo={goTo} />}
      {superNext && !rest && (
        <div
          className="fixed bottom-0 inset-x-0 z-30 mx-auto max-w-[480px] bg-card border-t-2 border-accent rounded-t-3xl px-5 pt-4 animate-slide-up"
          style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
        >
          <div className="text-[19px] font-extrabold text-accent uppercase tracking-wide">Superset · no rest yet</div>
          <div className="text-[25px] font-bold leading-tight mt-1">Now do: {superNext.name}</div>
          <button onClick={() => goTo(superNext.id)} className="btn-primary w-full h-16 mt-3 text-[23px] flex items-center justify-center gap-1">
            Go <ChevronRight size={26} />
          </button>
          <button onClick={() => setSuperNext(null)} className="w-full h-12 mt-1 text-[20px] text-mute">
            Not now
          </button>
        </div>
      )}
    </>
  );

  const undoSet = (ex: Exercise) => {
    const le = loggedFor(ex.id);
    onUndoSet(ex.id);
    if (le.completed && le.sets.length - 1 < ex.sets) onMarkComplete(ex.id, false);
  };

  const topBar = (
    <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between px-4 h-16">
        {openId ? (
          <button onClick={() => setOpenId(null)} className="flex items-center gap-1 text-accent font-medium text-[24px] -ml-1">
            <ChevronLeft size={28} /> Back
          </button>
        ) : (
          <button onClick={onBack} className="flex items-center gap-1 text-accent font-medium text-[24px] -ml-1">
            <ChevronLeft size={28} /> Back
          </button>
        )}
        <div className="text-[24px] font-semibold tabular-nums">{formatElapsed(current.startedAt, now)}</div>
        <button onClick={onFinish} disabled={!anyLogged} className="btn-primary px-5 h-12 text-[24px]">
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
      <div className={rest || superNext ? 'pb-[400px]' : 'pb-[130px]'}>
        {topBar}
        {overlays}
        <div className="px-4 pt-4">
          <Demo id={ex.id} />
          {ex.demoNote && <p className="text-[21px] text-mute mt-2 leading-snug">{ex.demoNote}</p>}

          <div className="mt-4">
            <div className="text-[21px] font-semibold text-mute">
              Exercise {idx + 1} of {day.exercises.length}
            </div>
            <h1 className="text-[34px] font-bold leading-tight mt-0.5">{ex.name}</h1>
            <div className="text-[26px] text-dim mt-1">{ex.target}</div>
          </div>
          <a
            href={videoUrl(ex)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 btn-secondary w-full h-14 text-[23px]"
          >
            <PlayIcon size={20} /> Watch a video
          </a>

          {partners.length > 0 && (
            <button
              onClick={() => setOpenId(partners[0].id)}
              className="mt-3 w-full flex items-center gap-3 rounded-xl bg-accent/10 border border-accent/30 px-3 py-2.5 text-left"
            >
              <span className="text-[19px] font-bold text-accent uppercase tracking-wide shrink-0">Superset</span>
              <span className="text-[22px] text-ink flex-1 min-w-0">
                Alternate with <b className="font-semibold">{partners[0].name}</b>
              </span>
              <ChevronRight size={24} className="text-accent shrink-0" />
            </button>
          )}

          <div className="card mt-4 p-4">
            <div className="text-[22px] font-semibold text-dim mb-2">Kayla’s notes</div>
            <ul className="space-y-1.5">
              {ex.cues.map((c, i) => (
                <li key={i} className="text-[23px] leading-snug flex gap-2">
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
            <button onClick={() => setOpenId(next.id)} className="btn-secondary w-full h-[72px] px-4 flex items-center justify-center gap-1 text-[24px]">
              <span className="truncate">Next: {next.name}</span>
              <ChevronRight size={28} className="shrink-0" />
            </button>
          ) : (
            <button onClick={() => setOpenId(null)} className="btn-secondary w-full h-[72px] text-[24px]">
              Back to all exercises
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={rest || superNext ? 'pb-[400px]' : 'pb-10'}>
      {topBar}
      {overlays}
      <div className="px-4 pt-5">
        <div className="text-[22px] font-semibold" style={{ color: day.color }}>
          Day {day.key}
        </div>
        <h1 className="text-[38px] font-bold leading-tight">{day.name}</h1>
        <div className="text-[23px] text-dim mt-1">
          {doneCount} of {day.exercises.length} done · tap an exercise
        </div>
      </div>

      <div className="px-4 mt-5 flex flex-col gap-3">
        {groupExercises(day.exercises).map((group) =>
          group.length === 1 ? (
            <ExerciseRow key={group[0].id} ex={group[0]} n={day.exercises.indexOf(group[0]) + 1} logged={loggedFor(group[0].id)} allSessions={allSessions} onOpen={() => setOpenId(group[0].id)} />
          ) : (
            <div key={group[0].superset} className="rounded-2xl border border-accent/30 bg-accent/5 p-2">
              <div className="px-2 pt-1 pb-2 text-[21px] text-accent">
                <b className="font-bold uppercase tracking-wide">Superset</b> · alternate, then rest
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

      <button onClick={onCancel} className="block mx-auto mt-8 text-[23px] text-mute underline underline-offset-4">
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
    <button onClick={onOpen} className="card w-full p-3 text-left active:bg-card2 transition-colors">
      <div className="relative">
        <Photo id={ex.id} />
        {done && (
          <div className="absolute inset-0 rounded-xl bg-good/75 grid place-items-center text-white">
            <CheckIcon size={64} />
          </div>
        )}
      </div>
      <div className="px-1 pt-3 pb-1">
        <div className="text-[24px] font-semibold leading-snug">
          <span className="text-mute font-medium mr-1.5">{n}</span>
          {ex.name}
        </div>
        <div className="text-[22px] text-dim mt-0.5">{ex.target}</div>
        <div className="text-[21px] text-mute mt-0.5">
          {logged.sets.length > 0
            ? `${logged.sets.length} of ${ex.sets} sets logged`
            : best
              ? `Last: ${formatSet(ex, best)}`
              : ''}
        </div>
      </div>
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

  const cell = 'h-16 rounded-lg text-center text-[34px] font-bold tabular-nums';
  const cols = showWeight ? 'grid-cols-[34px_1fr_1fr_64px]' : 'grid-cols-[34px_1fr_64px]';

  return (
    <div className="card mt-4 p-3">
      {prev.length > 0 && (
        <div className="px-1 pb-3 text-[22px] text-dim">
          Last time: <span className="text-ink font-semibold">{prev.map((p) => formatSet(ex, p)).join(' · ')}</span>
        </div>
      )}
      <div className={`grid ${cols} gap-2 px-1 pb-2 text-[19px] font-semibold text-mute uppercase tracking-wide`}>
        <div className="text-center">Set</div>
        {showWeight && <div className="text-center">lb</div>}
        <div className="text-center">{amountLabel}</div>
        <div />
      </div>
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: rows }).map((_, i) => {
          const s = logged.sets[i];
          const isNext = i === done;
          const isLastDone = i === done - 1;
          return (
            <div
              key={i}
              className={`grid ${cols} gap-2 items-center px-1 py-1 rounded-xl ${s ? 'bg-good/10' : isNext ? 'bg-card2' : ''}`}
            >
              <div className={`text-center text-[26px] font-bold ${s ? 'text-good' : 'text-dim'}`}>{i + 1}</div>
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
                className={`h-16 w-16 rounded-xl grid place-items-center transition-colors ${
                  s ? 'bg-good text-white' : isNext ? 'bg-accent text-white' : 'bg-card2 text-mute/40'
                }`}
              >
                <CheckIcon size={36} />
              </button>
            </div>
          );
        })}
      </div>
      <button onClick={() => setExtra((n) => n + 1)} className="btn-secondary w-full h-14 mt-3 flex items-center justify-center gap-2 text-[23px] text-accent whitespace-nowrap">
        <PlusIcon size={24} /> Add a set
      </button>
      <p className="text-[19px] text-mute text-center mt-2">Tapped ✓ by mistake? Tap the green ✓ to undo.</p>
    </div>
  );
}
