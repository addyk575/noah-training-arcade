import { useState } from 'react';
import { useStore } from './state/useStore';
import { nextRecommendedDay, setScore } from './state/progress';
import { BottomNav, type Tab } from './components/BottomNav';
import { Today } from './views/Today';
import { Finish, type FinishedSummary } from './views/Finish';
import { LiveSession } from './views/LiveSession';
import { Plan } from './views/Plan';
import { Stats } from './views/Stats';
import { Log } from './views/Log';
import { getExercise, WORKOUTS, type DayKey } from './data/workouts';
import type { Session } from './state/store';
import { ConfirmSheet, type ConfirmRequest } from './components/ConfirmSheet';

function summarize(session: Session, history: Session[]): FinishedSummary {
  const day = WORKOUTS[session.day];
  const minutes = Math.max(1, Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000));
  const lines = [`Hi Kayla! Day ${session.day} · ${day.name} done in ${minutes} min.`];
  const prs: FinishedSummary['prs'] = [];
  let sets = 0;
  let volume = 0;
  for (const le of session.exercises) {
    if (le.sets.length === 0) continue;
    const ex = getExercise(le.exerciseId);
    if (!ex) continue;
    sets += le.sets.length;
    volume += le.sets.reduce((n, s) => n + s.weight * s.reps, 0);
    const fmt = (s: { weight: number; reps: number }) =>
      ex.unit === 'lb' ? `${s.weight}×${s.reps}` : ex.unit === 'sec' ? `${s.reps}s` : `${s.reps}`;
    lines.push(`${ex.name}: ${le.sets.map(fmt).join(', ')}`);
    const past = history.flatMap((h) => h.exercises.filter((e) => e.exerciseId === ex.id).flatMap((e) => e.sets));
    const best = le.sets.reduce((a, b) => (setScore(ex, b) > setScore(ex, a) ? b : a));
    if (past.length > 0 && setScore(ex, best) > Math.max(...past.map((s) => setScore(ex, s)))) prs.push({ name: ex.name, set: fmt(best) });
  }
  return { dayName: `Day ${session.day} · ${day.name}`, color: day.color, minutes, sets, volume, prs, text: lines.join('\n') };
}

export default function App() {
  const { store, startSession, logSet, markExerciseComplete, undoLastSet, cancelSession, finishSession } = useStore();
  const [tab, setTab] = useState<Tab>('today');
  const [viewingSession, setViewingSession] = useState(false);
  const [finished, setFinished] = useState<FinishedSummary | null>(null);
  const [ask, setAsk] = useState<ConfirmRequest | null>(null);

  const openSession = () => {
    setFinished(null);
    setViewingSession(true);
    window.scrollTo(0, 0);
  };

  const handleStart = (day?: DayKey) => {
    const current = store.currentSession;
    const target = day ?? current?.day ?? nextRecommendedDay(store.sessions);
    if (!current) {
      startSession(target);
    } else if (current.day !== target) {
      const switchDay = () => {
        cancelSession();
        startSession(target);
        openSession();
      };
      if (current.exercises.some((e) => e.sets.length > 0)) {
        setAsk({
          title: `Switch to Day ${target}?`,
          body: `You have sets logged for Day ${current.day}. Switching deletes them.`,
          confirmLabel: `Delete and start Day ${target}`,
          onConfirm: switchDay,
        });
        return;
      }
      switchDay();
      return;
    }
    openSession();
  };

  const handleFinish = () => {
    const current = store.currentSession;
    if (!current) return;
    for (const le of current.exercises) {
      if (le.sets.length > 0 && !le.completed) markExerciseComplete(le.exerciseId, true);
    }
    setFinished(summarize(current, store.sessions));
    finishSession();
    setViewingSession(false);
    setTab('today');
    window.scrollTo(0, 0);
  };

  const handleCancel = () => {
    setAsk({
      title: 'Discard this workout?',
      body: 'Any sets you logged in this workout will be deleted.',
      confirmLabel: 'Discard workout',
      onConfirm: () => {
        cancelSession();
        setViewingSession(false);
      },
    });
  };

  const sheet = ask && <ConfirmSheet req={ask} onClose={() => setAsk(null)} />;

  if (finished) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen">
        <Finish summary={finished} sessions={store.sessions} onDone={() => setFinished(null)} />
      </div>
    );
  }

  if (viewingSession && store.currentSession) {
    return (
      <div className="max-w-[480px] mx-auto min-h-screen">
        <LiveSession
          current={store.currentSession}
          allSessions={store.sessions}
          onLogSet={logSet}
          onUndoSet={undoLastSet}
          onMarkComplete={markExerciseComplete}
          onFinish={handleFinish}
          onBack={() => setViewingSession(false)}
          onCancel={handleCancel}
        />
        {sheet}
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen pb-[110px] relative">
      {tab === 'today' && (
        <Today
          sessions={store.sessions}
          inProgress={store.currentSession}
          onStart={handleStart}
        />
      )}
      {tab === 'plan' && <Plan />}
      {tab === 'stats' && <Stats sessions={store.sessions} />}
      {tab === 'log' && <Log sessions={store.sessions} />}

      <BottomNav
        active={tab}
        onChange={(t) => {
          setTab(t);
          window.scrollTo(0, 0);
        }}
      />
      {sheet}
    </div>
  );
}
