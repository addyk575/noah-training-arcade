import type { Session } from '../state/store';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (sessions: Session[]) => boolean;
};

function totalSets(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + s.exercises.reduce((n, e) => n + e.sets.length, 0), 0);
}

function longestStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const days = new Set(sessions.filter((s) => s.finishedAt).map((s) => s.finishedAt!.slice(0, 10)));
  const sorted = [...days].sort();
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const a = new Date(sorted[i - 1]);
    const b = new Date(sorted[i]);
    const diff = (b.getTime() - a.getTime()) / 86400000;
    if (diff === 1) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session',  name: 'First Rep',        description: 'Finish your first session',    icon: '🏁',
    check: (s) => s.filter((x) => x.finishedAt).length >= 1 },
  { id: 'three_sessions', name: 'Hat Trick',        description: 'Finish 3 sessions',            icon: '🎯',
    check: (s) => s.filter((x) => x.finishedAt).length >= 3 },
  { id: 'ten_sessions',   name: 'Ten Under Belt',   description: 'Finish 10 sessions',           icon: '🔟',
    check: (s) => s.filter((x) => x.finishedAt).length >= 10 },
  { id: 'streak_3',       name: '3-Day Streak',     description: '3 training days in a row',     icon: '🔥',
    check: (s) => longestStreak(s) >= 3 },
  { id: 'streak_7',       name: '7-Day Streak',     description: '7 training days in a row',     icon: '⚡',
    check: (s) => longestStreak(s) >= 7 },
  { id: 'first_pr',       name: 'First PR',         description: 'Set a personal record',        icon: '🏆',
    check: (s) => s.some((x) => x.pr && x.pr.length > 0) },
  { id: 'five_pr',        name: 'Record Holder',    description: '5 personal records',           icon: '🥇',
    check: (s) => s.reduce((n, x) => n + (x.pr?.length ?? 0), 0) >= 5 },
  { id: '100_sets',       name: '100 Sets',         description: 'Log 100 total sets',           icon: '💯',
    check: (s) => totalSets(s) >= 100 },
  { id: 'week_perfect',   name: 'Week Perfect',     description: 'All 4 sessions in one week',   icon: '✨',
    check: (s) => {
      const by: Record<string, number> = {};
      for (const sess of s) {
        if (!sess.finishedAt) continue;
        const d = new Date(sess.finishedAt);
        const year = d.getUTCFullYear();
        const week = Math.floor((d.getTime() / 86400000 + 4) / 7);
        const key = `${year}-${week}`;
        by[key] = (by[key] ?? 0) + 1;
      }
      return Object.values(by).some((n) => n >= 4);
    } },
  { id: 'all_days',       name: 'Full Rotation',    description: 'Complete all 4 day types',     icon: '🔄',
    check: (s) => new Set(s.filter((x) => x.finishedAt).map((x) => x.day)).size === 4 },
  { id: 'bench_two_plate',name: 'Bench 2 Plates',   description: 'Bench press 135 lb',           icon: '💪',
    check: (s) => s.some((x) => x.exercises.some((e) => e.exerciseId === 'bench' && e.sets.some((st) => st.weight >= 135))) },
  { id: 'pullup_10',      name: '10 Strict Pulls',  description: '10 unbroken pull-ups',         icon: '🆙',
    check: (s) => s.some((x) => x.exercises.some((e) => e.exerciseId === 'pullup' && e.sets.some((st) => st.reps >= 10))) },
  { id: 'xp_1000',        name: 'Rank 03',          description: 'Earn 1,000 total XP',          icon: '⭐',
    check: (s) => s.reduce((n, x) => n + (x.xp ?? 0), 0) >= 1000 },
  { id: 'xp_5000',        name: 'Rank 11',          description: 'Earn 5,000 total XP',          icon: '🌟',
    check: (s) => s.reduce((n, x) => n + (x.xp ?? 0), 0) >= 5000 },
];
