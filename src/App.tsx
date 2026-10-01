import { useState } from 'react';
import { useStore } from './state/useStore';
import { nextRecommendedDay } from './state/progress';
import { BottomNav, type Tab } from './components/BottomNav';
import { Today, type FinishedSummary } from './views/Today';
import { LiveSession } from './views/LiveSession';
import { Plan } from './views/Plan';
import { Stats } from './views/Stats';
import { Log } from './views/Log';
import { getExercise, WORKOUTS, type DayKey } from './data/workouts';
import type { Session } from './state/store';
import { ConfirmSheet, type ConfirmRequest } from './components/ConfirmSheet';

function summarize(session: Session): FinishedSummary {
  const day = WORKOUTS[session.day];
  const lines = [`Day ${session.day} · ${day.name} done.`];
  let sets = 0;
  for (const le of session.exercises) {
    if (le.sets.length === 0) continue;
    const ex = getExercise(le.exerciseId);
    if (!ex) continue;
    sets += le.sets.length;
    const str = le.sets
      .map((s) => (ex.unit === 'lb' ? `${s.weight}×${s.reps}` : ex.unit === 'sec' ? `${s.reps}s` : `${s.reps}`))
      .join(', ');
    lines.push(`${ex.name}: ${str}`);
  }
  const minutes = Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000);
  return { dayName: day.name, sets, minutes, text: lines.join('\n') };
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
    setFinished(summarize(current));
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
    <div className="max-w-[480px] mx-auto min-h-screen pb-[90px] relative">
      {tab === 'today' && (
        <Today
          sessions={store.sessions}
          inProgress={store.currentSession}
          finished={finished}
          onDismissFinished={() => setFinished(null)}
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
