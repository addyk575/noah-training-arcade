import type { DayKey } from '../data/workouts';

export type AccentKey = 'lime' | 'cyan' | 'pink' | 'orange' | 'violet' | 'yellow';

export type LoggedSet = { weight: number; reps: number; rpe?: number };

export type LoggedExercise = {
  exerciseId: string;
  sets: LoggedSet[];
  completed: boolean;
};

export type Session = {
  id: string;
  day: DayKey;
  startedAt: string;
  finishedAt?: string;
  exercises: LoggedExercise[];
  xp: number;
  pr: string[];
};

export type Settings = {
  accent: AccentKey;
  density: 'comfortable' | 'compact';
  coachContact: string;
};

export type WorkoutStore = {
  sessions: Session[];
  currentSession?: Session;
  settings: Settings;
};

const KEY = 'noah_workouts_v1';

const DEFAULT_STORE: WorkoutStore = {
  sessions: [],
  settings: {
    accent: 'lime',
    density: 'comfortable',
    coachContact: '514-575-3929',
  },
};

export function loadStore(): WorkoutStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_STORE;
  try {
    const parsed = JSON.parse(raw) as Partial<WorkoutStore>;
    return {
      sessions: (parsed.sessions ?? []).map(migrateSession),
      currentSession: parsed.currentSession ? migrateSession(parsed.currentSession) : undefined,
      settings: { ...DEFAULT_STORE.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: WorkoutStore) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

function migrateSession(s: Partial<Session> & { id?: string; day?: DayKey; startedAt?: string; exercises?: LoggedExercise[] }): Session {
  return {
    id: s.id ?? crypto.randomUUID(),
    day: (s.day ?? 'A') as DayKey,
    startedAt: s.startedAt ?? new Date().toISOString(),
    finishedAt: s.finishedAt,
    exercises: s.exercises ?? [],
    xp: s.xp ?? 0,
    pr: s.pr ?? [],
  };
}

export function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
