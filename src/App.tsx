import { useState } from 'react';
import { useStore } from './state/useStore';
import { rankInfo, computeStreak, nextRecommendedDay } from './state/progress';
import { Header } from './components/Header';
import { BottomNav, type Tab } from './components/BottomNav';
import { Today } from './views/Today';
import { LiveSession } from './views/LiveSession';
import { Plan } from './views/Plan';
import { Stats } from './views/Stats';
import { Log } from './views/Log';
import type { DayKey } from './data/workouts';

export default function App() {
  const api = useStore();
  const { store, startSession, logSet, markExerciseComplete, undoLastSet, cancelSession, finishSession } = api;
  const [tab, setTab] = useState<Tab>('today');
  const [viewingSession, setViewingSession] = useState(false);

  const rank = rankInfo(store.sessions);
  const streak = computeStreak(store.sessions);

  const handleStart = (day?: DayKey) => {
    const target = day ?? nextRecommendedDay(store.sessions);
    if (!store.currentSession) startSession(target);
    setViewingSession(true);
  };

  const handleFinish = () => {
    finishSession();
    setViewingSession(false);
    setTab('today');
  };

  const handleBack = () => setViewingSession(false);

  const handleCancel = () => {
    if (confirm('Retreat from this battle? Logged sets will be discarded.')) {
      cancelSession();
      setViewingSession(false);
    }
  };

  const showLiveSession = viewingSession && store.currentSession;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen pb-[72px] relative">
      {!showLiveSession && <Header rank={rank.rank} totalXp={rank.totalXp} streak={streak} />}

      {showLiveSession ? (
        <LiveSession
          current={store.currentSession!}
          allSessions={store.sessions}
          onLogSet={logSet}
          onUndoSet={undoLastSet}
          onMarkComplete={markExerciseComplete}
          onFinish={handleFinish}
          onBack={handleBack}
          onCancel={handleCancel}
          coachContact={store.settings.coachContact}
        />
      ) : (
        <>
          {tab === 'today' && <Today sessions={store.sessions} onStart={handleStart} />}
          {tab === 'plan' && <Plan />}
          {tab === 'stats' && <Stats sessions={store.sessions} />}
          {tab === 'log' && <Log sessions={store.sessions} />}
        </>
      )}

      {!showLiveSession && <BottomNav active={tab} onChange={setTab} onStart={() => handleStart()} />}

      {store.currentSession && !showLiveSession && (
        <button
          onClick={() => setViewingSession(true)}
          className="fixed bottom-[72px] left-1/2 -translate-x-1/2 pixel text-[10px] tracking-[0.1em] text-black rounded-xs px-[18px] py-[10px] z-30 active:scale-[0.97] transition-transform"
          style={{
            background: 'linear-gradient(90deg, #FFD93D, #FF4785)',
            boxShadow: '0 0 18px rgba(255,217,61,0.6)',
          }}
        >
          ▶ RESUME WORKOUT
        </button>
      )}
    </div>
  );
}
