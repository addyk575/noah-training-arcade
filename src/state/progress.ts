import type { Session } from './store';
import { WORKOUTS, type DayKey, type Exercise, getExercise } from '../data/workouts';

const XP_PER_RANK = 500;

export type RankInfo = {
  rank: number;
  totalXp: number;
  xpInRank: number;
  xpToNext: number;
  progress: number;
};

export function totalXp(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + (s.xp ?? 0), 0);
}

export function rankInfo(sessions: Session[]): RankInfo {
  const total = totalXp(sessions);
  const rank = Math.floor(total / XP_PER_RANK) + 1;
  const xpInRank = total % XP_PER_RANK;
  return {
    rank,
    totalXp: total,
    xpInRank,
    xpToNext: XP_PER_RANK,
    progress: xpInRank / XP_PER_RANK,
  };
}

export function sessionXp(session: Session): number {
  let xp = 0;
  for (const le of session.exercises) {
    if (!le.completed) continue;
    const ex = getExercise(le.exerciseId);
    if (ex) xp += ex.xp;
  }
  const completedCount = session.exercises.filter((e) => e.completed).length;
  if (completedCount >= 3) xp += 25;
  if (session.finishedAt) {
    const day = WORKOUTS[session.day];
    if (completedCount >= day.exercises.length) xp += 50;
  }
  return xp;
}

export function allowanceCount(sessions: Session[], now = new Date()): number {
  const windowStart = new Date(now.getTime() - 8 * 86400000);
  return sessions.filter((s) => {
    if (!s.finishedAt) return false;
    const exCompleted = s.exercises.filter((e) => e.completed).length;
    if (exCompleted < 3) return false;
    return new Date(s.finishedAt) >= windowStart;
  }).length;
}

export function computeStreak(sessions: Session[], now = new Date()): number {
  const days = new Set(
    sessions.filter((s) => s.finishedAt).map((s) => s.finishedAt!.slice(0, 10)),
  );
  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  if (streak === 0) {
    cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }
  return streak;
}

export function sessionsThisWeek(sessions: Session[], now = new Date()): boolean[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const monOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + monOffset);
  const done = new Array(7).fill(false);
  const doneDays = new Set(sessions.filter((s) => s.finishedAt).map((s) => s.finishedAt!.slice(0, 10)));
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    done[i] = doneDays.has(d.toISOString().slice(0, 10));
  }
  return done;
}

export function todayIndexInWeek(now = new Date()): number {
  const day = now.getDay();
  return day === 0 ? 6 : day - 1;
}

export function nextRecommendedDay(sessions: Session[]): DayKey {
  const last = [...sessions].reverse().find((s) => s.finishedAt);
  if (!last) return 'A';
  const order: DayKey[] = ['A', 'B', 'C', 'D'];
  return order[(order.indexOf(last.day) + 1) % order.length];
}

export function lastPerformance(sessions: Session[], exerciseId: string): { weight: number; reps: number; when: string } | null {
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i];
    if (!s.finishedAt) continue;
    const le = s.exercises.find((e) => e.exerciseId === exerciseId);
    if (le && le.sets.length > 0) {
      const best = le.sets.reduce((a, b) => (a.weight * a.reps >= b.weight * b.reps ? a : b));
      return { weight: best.weight, reps: best.reps, when: s.finishedAt };
    }
  }
  return null;
}

export function isPR(sessions: Session[], exerciseId: string, weight: number, reps: number): boolean {
  const score = weight * reps;
  for (const s of sessions) {
    const le = s.exercises.find((e) => e.exerciseId === exerciseId);
    if (!le) continue;
    for (const st of le.sets) {
      if (st.weight * st.reps >= score) return false;
    }
  }
  return score > 0;
}

export function exerciseXpLabel(ex: Exercise): string {
  return `+${ex.xp}`;
}

export function suggestedNextWeight(sessions: Session[], exerciseId: string): number | null {
  const last = lastPerformance(sessions, exerciseId);
  if (!last) return null;
  return last.weight;
}
