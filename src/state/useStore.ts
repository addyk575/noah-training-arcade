import { useCallback, useEffect, useState } from 'react';
import { loadStore, saveStore, uuid, type Session, type WorkoutStore, type LoggedExercise } from './store';
import { isPR, sessionXp } from './progress';
import { WORKOUTS, type DayKey } from '../data/workouts';

export function useStore() {
  const [store, setStore] = useState<WorkoutStore>(() => loadStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const startSession = useCallback((day: DayKey) => {
    const def = WORKOUTS[day];
    const session: Session = {
      id: uuid(),
      day,
      startedAt: new Date().toISOString(),
      exercises: def.exercises.map((e) => ({ exerciseId: e.id, sets: [], completed: false })),
      xp: 0,
      pr: [],
    };
    setStore((s) => ({ ...s, currentSession: session }));
  }, []);

  const updateCurrent = useCallback((fn: (s: Session) => Session) => {
    setStore((s) => {
      if (!s.currentSession) return s;
      return { ...s, currentSession: fn(s.currentSession) };
    });
  }, []);

  const logSet = useCallback((exerciseId: string, weight: number, reps: number) => {
    updateCurrent((session) => ({
      ...session,
      exercises: session.exercises.map((le) =>
        le.exerciseId === exerciseId
          ? { ...le, sets: [...le.sets, { weight, reps }] }
          : le,
      ),
    }));
  }, [updateCurrent]);

  const markExerciseComplete = useCallback((exerciseId: string, completed: boolean) => {
    updateCurrent((session) => ({
      ...session,
      exercises: session.exercises.map((le) =>
        le.exerciseId === exerciseId ? { ...le, completed } : le,
      ),
    }));
  }, [updateCurrent]);

  const undoLastSet = useCallback((exerciseId: string) => {
    updateCurrent((session) => ({
      ...session,
      exercises: session.exercises.map((le) =>
        le.exerciseId === exerciseId
          ? { ...le, sets: le.sets.slice(0, -1) }
          : le,
      ),
    }));
  }, [updateCurrent]);

  const cancelSession = useCallback(() => {
    setStore((s) => ({ ...s, currentSession: undefined }));
  }, []);

  const finishSession = useCallback((): Session | null => {
    let finished: Session | null = null;
    setStore((s) => {
      if (!s.currentSession) return s;
      const prs: string[] = [];
      for (const le of s.currentSession.exercises) {
        for (const st of le.sets) {
          if (isPR(s.sessions, le.exerciseId, st.weight, st.reps)) {
            prs.push(le.exerciseId);
            break;
          }
        }
      }
      const base: Session = {
        ...s.currentSession,
        finishedAt: new Date().toISOString(),
        pr: Array.from(new Set(prs)),
      };
      const withXp: Session = { ...base, xp: sessionXp(base) };
      finished = withXp;
      return {
        ...s,
        currentSession: undefined,
        sessions: [...s.sessions, withXp],
      };
    });
    return finished;
  }, []);

  const updateSettings = useCallback((patch: Partial<WorkoutStore['settings']>) => {
    setStore((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  return {
    store,
    startSession,
    logSet,
    markExerciseComplete,
    undoLastSet,
    cancelSession,
    finishSession,
    updateSettings,
  };
}

export type StoreApi = ReturnType<typeof useStore>;
export type { LoggedExercise };
