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

  const handleStart = (day?: DayKey) => {
    const target = day ?? nextRecommendedDay(store.sessions);
    if (!store.currentSession) startSession(target);
    setFinished(null);
    setViewingSession(true);
    window.scrollTo(0, 0);
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
    if (confirm('Discard this workout? Logged sets will be deleted.')) {
      cancelSession();
      setViewingSession(false);
    }
  };

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
    </div>
  );
}
