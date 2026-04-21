import { useEffect, useMemo, useState } from 'react';
import { WORKOUTS, type DayKey, type Exercise } from '../data/workouts';
import type { Session } from '../state/store';
import { lastPerformance, suggestedNextWeight } from '../state/progress';
import { PixelCard, type ArcadeColor } from '../components/PixelCard';
import { XpBar } from '../components/XpBar';

type Props = {
  current: Session;
  allSessions: Session[];
  onLogSet: (exerciseId: string, weight: number, reps: number) => void;
  onUndoSet: (exerciseId: string) => void;
  onMarkComplete: (exerciseId: string, completed: boolean) => void;
  onFinish: () => void;
  onBack: () => void;
  onCancel: () => void;
  coachContact: string;
};

const DAY_COLOR: Record<DayKey, string> = {
  A: '#4DD4FF',
  B: '#10F8A0',
  C: '#FF9A3C',
  D: '#A855F7',
};

const DAY_ACCENT: Record<DayKey, ArcadeColor> = {
  A: 'mana',
  B: 'win',
  C: 'hp',
  D: 'legendary',
};

function formatElapsed(startedAt: string, now: number): string {
  const ms = now - new Date(startedAt).getTime();
  const sec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function LiveSession({
  current,
  allSessions,
  onLogSet,
  onUndoSet,
  onMarkComplete,
  onFinish,
  onBack,
  onCancel,
  coachContact,
}: Props) {
  const day = WORKOUTS[current.day];
  const [now, setNow] = useState(() => Date.now());
  const [activeId, setActiveId] = useState<string | null>(day.exercises[0]?.id ?? null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const completedCount = current.exercises.filter((e) => e.completed).length;
  const totalXpEarned = useMemo(() => {
    let x = 0;
    for (const le of current.exercises) {
      if (!le.completed) continue;
      const ex = day.exercises.find((e) => e.id === le.exerciseId);
      if (ex) x += ex.xp;
    }
    return x;
  }, [current.exercises, day.exercises]);

  const handleFinish = () => {
    const summary = buildSummary(current, day.exercises);
    try {
      navigator.clipboard.writeText(summary).catch(() => {});
    } catch {}
    const sms = `sms:${coachContact.replace(/[^0-9+]/g, '')}?&body=${encodeURIComponent(summary)}`;
    onFinish();
    window.setTimeout(() => {
      window.location.href = sms;
    }, 200);
  };

  return (
    <div className="pb-[80px]">
      <div className="px-[16px] py-[12px] flex justify-between items-center">
        <button onClick={onBack} className="display text-[11px] tracking-[0.1em] text-dim flex items-center gap-[4px]">
          ‹ BACK
        </button>
        <div
          className="mono text-[13px] font-bold text-ink px-[10px] py-[6px] rounded-xs"
          style={{ background: '#151A2E', border: '1px solid #2D3560' }}
        >
          ⏱ {formatElapsed(current.startedAt, now)}
        </div>
      </div>

      <div className="mx-[16px] mb-[16px]">
        <PixelCard accent={DAY_ACCENT[current.day]}>
          <div className="flex items-baseline justify-between">
            <span className="mono text-[10px] text-mute tracking-[0.08em]">
              DAY {current.day} · {day.name.toUpperCase()}
            </span>
            <span className="mono text-[10px] text-xp tracking-[0.08em]">+{totalXpEarned} XP</span>
          </div>
          <div className="display text-[24px] text-ink mt-[2px]">{day.name}</div>
          <div className="mt-[10px]">
            <XpBar
              value={completedCount}
              max={day.exercises.length}
              color={DAY_COLOR[current.day]}
              segments={day.exercises.length * 3}
            />
          </div>
          <div className="mono text-[11px] text-dim tracking-[0.06em] mt-[8px]">
            {completedCount} OF {day.exercises.length} LIFTS CLEARED
          </div>
        </PixelCard>
      </div>

      <div className="px-[16px] flex flex-col gap-[10px]">
        {day.exercises.map((ex, i) => {
          const logged = current.exercises.find((e) => e.exerciseId === ex.id);
          const isDone = logged?.completed ?? false;
          const isActive = activeId === ex.id && !isDone;
          return (
            <ExerciseRow
              key={ex.id}
              ex={ex}
              index={i + 1}
              logged={logged}
              isActive={isActive}
              isDone={isDone}
              allSessions={allSessions}
              onActivate={() => setActiveId(ex.id)}
              onLog={(w, r) => onLogSet(ex.id, w, r)}
              onUndo={() => onUndoSet(ex.id)}
              onToggleDone={(done) => {
                onMarkComplete(ex.id, done);
                if (done) {
                  const nextEx = day.exercises.find(
                    (e, idx) =>
                      idx > i && !current.exercises.find((le) => le.exerciseId === e.id)?.completed,
                  );
                  if (nextEx) setActiveId(nextEx.id);
                }
              }}
            />
          );
        })}
      </div>

      <div className="mx-[16px] mt-[14px] flex gap-[8px]">
        <button
          onClick={onCancel}
          className="flex-1 py-[14px] rounded-lg text-[13px] font-bold text-mute"
          style={{ background: '#151A2E', border: '1px solid #2D3560' }}
        >
          Cancel
        </button>
        <button
          onClick={handleFinish}
          disabled={completedCount === 0}
          className="flex-[2] py-[14px] rounded-lg display text-[13px] tracking-[0.1em] transition-transform active:scale-[0.97]"
          style={
            completedCount === 0
              ? { background: '#1E2545', color: '#6B6B95' }
              : {
                  background: 'linear-gradient(90deg, #FFD93D, #FF4785)',
                  color: '#000',
                  boxShadow: '0 0 18px rgba(255,217,61,0.5)',
                }
          }
        >
          FINISH · +{totalXpEarned} XP
        </button>
      </div>
    </div>
  );
}

type CardProps = {
  ex: Exercise;
  index: number;
  logged: Session['exercises'][number] | undefined;
  isActive: boolean;
  isDone: boolean;
  allSessions: Session[];
  onActivate: () => void;
  onLog: (weight: number, reps: number) => void;
  onUndo: () => void;
  onToggleDone: (done: boolean) => void;
};

function ExerciseRow({
  ex,
  index,
  logged,
  isActive,
  isDone,
  allSessions,
  onActivate,
  onLog,
  onUndo,
  onToggleDone,
}: CardProps) {
  const last = lastPerformance(allSessions, ex.id);
  const defaultWeight = suggestedNextWeight(allSessions, ex.id) ?? 0;
  const [weight, setWeight] = useState<string>(defaultWeight ? String(defaultWeight) : '');
  const [reps, setReps] = useState<string>('');
  const setsCount = logged?.sets.length ?? 0;

  const log = () => {
    const w = ex.unit === 'lb' ? Number(weight) || 0 : 0;
    const r = Number(reps) || 0;
    if (r <= 0 && w <= 0) return;
    onLog(w, r);
    setReps('');
  };

  const showsWeight = ex.unit === 'lb';
  const repsPlaceholder = ex.unit === 'sec' ? 'sec' : 'reps';

  const borderColor = isDone
    ? 'rgba(16,248,160,0.4)'
    : isActive
    ? '#FFD93D'
    : '#2D3560';
  const shadow = isActive ? '0 0 0 1px rgba(255,217,61,0.3), 0 0 14px rgba(255,217,61,0.2)' : 'none';

  return (
    <div
      className="rounded-xl p-[14px] transition-colors"
      style={{
        background: '#151A2E',
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
      }}
      onClick={() => !isDone && !isActive && onActivate()}
    >
      <div className="flex items-center gap-[12px]">
        <div
          className="display text-[11px] w-[16px]"
          style={{ color: isDone ? '#10F8A0' : isActive ? '#FFD93D' : '#6B6B95' }}
        >
          {isDone ? '✓' : index}
        </div>
        <div
          className="w-[54px] h-[44px] rounded-md grid place-items-center display text-[16px]"
          style={{
            background: '#000',
            border: '1px solid #2D3560',
            color: isDone ? '#10F8A0' : isActive ? '#FFD93D' : '#9B9BC7',
          }}
        >
          {ex.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[15px] font-bold truncate ${isDone ? 'text-win' : 'text-ink'}`}>
            {ex.name}
          </div>
          <div className="mono text-[11px] text-mute mt-[2px]">
            {last ? `LAST: ${last.weight ? `${last.weight} × ${last.reps}` : last.reps}` : 'NO HISTORY'}
          </div>
        </div>
        <div className="text-right">
          <div className="display text-[13px] text-dim">{ex.target}</div>
          <div className={`mono text-[10px] mt-[2px] ${isDone ? 'text-xp' : 'text-mute'}`}>
            +{ex.xp}
          </div>
        </div>
      </div>

      {isActive && (
        <div className="mt-[14px] pt-[14px] border-t border-line" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-end gap-[8px]">
            {showsWeight && (
              <div className="flex-1">
                <label className="eyebrow text-[10px] block">WEIGHT</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  className="block w-full mono text-[16px] text-ink mt-[4px] px-[12px] py-[10px] rounded-md"
                  style={{ background: '#0A0B1A', border: '1px solid #2D3560' }}
                />
              </div>
            )}
            <div className="flex-1">
              <label className="eyebrow text-[10px] block">
                {ex.unit === 'sec' ? 'TIME (s)' : 'REPS'}
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder={repsPlaceholder}
                className="block w-full mono text-[16px] text-ink mt-[4px] px-[12px] py-[10px] rounded-md"
                style={{ background: '#0A0B1A', border: '1px solid #2D3560' }}
              />
            </div>
            <button
              onClick={log}
              className="self-end display text-[11px] tracking-[0.1em] text-black rounded-md px-[16px] py-[11px] active:scale-[0.97] transition-transform"
              style={{ background: '#FFD93D', boxShadow: '0 0 10px rgba(255,217,61,0.4)' }}
            >
              LOG
            </button>
          </div>

          {setsCount > 0 && (
            <div className="mt-[12px] flex flex-wrap gap-[6px] items-center">
              {logged!.sets.map((s, i) => (
                <div
                  key={i}
                  className="mono text-[12px] text-xp font-bold px-[8px] py-[4px] rounded-md"
                  style={{ background: '#0A0B1A', border: '1px solid #FFD93D' }}
                >
                  {s.weight ? `${s.weight} × ${s.reps}` : s.reps}
                </div>
              ))}
              <button onClick={onUndo} className="text-[12px] text-mute underline">
                undo
              </button>
            </div>
          )}

          <div className="flex gap-[8px] mt-[14px] items-center">
            <div className="flex-1 text-[12px] text-dim">
              <span className="text-ink font-bold">{setsCount}</span> of {ex.sets} sets
            </div>
            <button
              onClick={() => onToggleDone(true)}
              disabled={setsCount === 0}
              className="display text-[11px] tracking-[0.1em] rounded-md px-[14px] py-[10px]"
              style={
                setsCount === 0
                  ? { background: '#1E2545', color: '#6B6B95' }
                  : { background: '#10F8A0', color: '#000', boxShadow: '0 0 10px rgba(16,248,160,0.4)' }
              }
            >
              ✓ DONE
            </button>
          </div>

          {ex.cues.length > 0 && (
            <ul className="mt-[12px] space-y-[4px]">
              {ex.cues.map((c, i) => (
                <li key={i} className="text-[12px] text-dim leading-[1.4] flex gap-[8px]">
                  <span className="text-xp">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isDone && setsCount > 0 && (
        <div className="mt-[10px] flex flex-wrap gap-[6px] items-center pl-[82px]">
          {logged!.sets.map((s, i) => (
            <div key={i} className="mono text-[11px] text-win">
              {s.weight ? `${s.weight}×${s.reps}` : s.reps}
            </div>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDone(false);
            }}
            className="text-[11px] text-mute underline"
          >
            reopen
          </button>
        </div>
      )}
    </div>
  );
}

function buildSummary(session: Session, exercises: Exercise[]): string {
  const lines: string[] = [`Noah · Day ${session.day} session done.`];
  for (const le of session.exercises) {
    if (!le.completed && le.sets.length === 0) continue;
    const ex = exercises.find((e) => e.id === le.exerciseId);
    if (!ex) continue;
    const setStr = le.sets.map((s) => (s.weight ? `${s.weight}×${s.reps}` : `${s.reps}`)).join(', ');
    lines.push(`${ex.name}: ${setStr || 'skipped'}`);
  }
  return lines.join('\n');
}
