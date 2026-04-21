import { useMemo } from 'react';
import type { Session } from '../state/store';
import { ACHIEVEMENTS } from '../data/achievements';
import { rankInfo, totalXp } from '../state/progress';
import { getExercise, WORKOUTS } from '../data/workouts';
import { PixelCard } from '../components/PixelCard';
import { Card } from '../components/Card';

type Props = { sessions: Session[] };

const TIER_COLORS = ['#FFD93D', '#C0C8E0', '#D4894F'] as const;

export function Stats({ sessions }: Props) {
  const rank = rankInfo(sessions);
  const unlocked = useMemo(
    () => new Set(ACHIEVEMENTS.filter((a) => a.check(sessions)).map((a) => a.id)),
    [sessions],
  );

  const prs = useMemo(() => {
    const best: Record<string, { weight: number; reps: number; at: string; count: number }> = {};
    for (const s of sessions) {
      for (const le of s.exercises) {
        for (const st of le.sets) {
          const score = st.weight * st.reps || st.reps;
          const existing = best[le.exerciseId];
          const existScore = existing ? existing.weight * existing.reps || existing.reps : 0;
          if (!existing || existScore < score) {
            best[le.exerciseId] = {
              weight: st.weight,
              reps: st.reps,
              at: s.finishedAt ?? s.startedAt,
              count: (existing?.count ?? 0) + 1,
            };
          } else {
            best[le.exerciseId] = { ...existing, count: existing.count + 1 };
          }
        }
      }
    }
    return Object.entries(best).slice(0, 8);
  }, [sessions]);

  const attrs = useMemo(() => {
    const done = sessions.filter((s) => s.finishedAt);
    const boxjumps = done.reduce(
      (n, s) =>
        n + (s.exercises.find((e) => e.exerciseId === 'boxjump')?.sets.reduce((a, b) => a + b.reps, 0) ?? 0),
      0,
    );
    const planks = done.reduce(
      (n, s) =>
        n + (s.exercises.find((e) => e.exerciseId === 'plank')?.sets.reduce((a, b) => a + b.reps, 0) ?? 0),
      0,
    );
    const total = totalXp(sessions);
    return [
      { l: 'STRENGTH', v: Math.min(50, Math.floor(total / 50)), c: '#FFD93D' },
      { l: 'ENDURANCE', v: Math.min(50, Math.floor(planks / 40)), c: '#4DD4FF' },
      { l: 'POWER', v: Math.min(50, boxjumps), c: '#FF4785' },
      { l: 'FOCUS', v: Math.min(50, done.length * 3), c: '#A855F7' },
    ];
  }, [sessions]);

  return (
    <div className="pb-[80px]">
      <div className="flex items-baseline justify-between px-[18px] mt-[20px] mb-[10px]">
        <span className="eyebrow">ATTRIBUTES</span>
        <span className="meta">LVL {rank.rank.toString().padStart(2, '0')}</span>
      </div>

      <div className="mx-[16px]">
        <PixelCard accent="legendary">
          <div className="grid grid-cols-2 gap-[16px]">
            {attrs.map((s) => (
              <div key={s.l}>
                <div
                  className="display text-[10px] tracking-[0.14em]"
                  style={{ color: s.c }}
                >
                  {s.l}
                </div>
                <div className="display text-[32px] leading-none mt-[4px] text-ink">{s.v}</div>
                <div className="h-[3px] mt-[6px]" style={{ background: '#1E2545' }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${(s.v / 50) * 100}%`,
                      background: s.c,
                      boxShadow: `0 0 6px ${s.c}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PixelCard>
      </div>

      <div className="mx-[16px] mt-[12px]">
        <Card accent="xp" leftStripe>
          <div className="flex items-center gap-[14px] p-[14px] pl-[20px]">
            <div className="text-[26px]">⭐</div>
            <div className="flex-1">
              <div className="mono text-[10px] text-mute tracking-[0.08em]">
                TOTAL XP · LVL {rank.rank.toString().padStart(2, '0')}
              </div>
              <div className="display text-[22px] text-ink mt-[2px]">
                {rank.totalXp.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">PERSONAL RECORDS</span>
        <span className="meta">BY LIFT</span>
      </div>

      {prs.length === 0 && (
        <div className="mx-[16px]">
          <Card accent="none">
            <div className="p-[16px] text-center">
              <div className="text-[14px] text-mute font-semibold">No records yet</div>
              <div className="text-[12px] text-dim mt-[4px]">
                Finish a workout to set your first PR.
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="px-[16px] flex flex-col gap-[8px]">
        {prs.map(([id, pr], i) => {
          const ex = getExercise(id);
          if (!ex) return null;
          const tierColor = TIER_COLORS[i] ?? '#6B6B95';
          const tierName = i === 0 ? 'GOLD' : i === 1 ? 'SILVER' : i === 2 ? 'BRONZE' : `#${i + 1}`;
          return (
            <div
              key={id}
              className="rounded-lg p-[14px] flex items-center gap-[14px]"
              style={{ background: '#151A2E', border: '1px solid #2D3560' }}
            >
              <div
                className="w-[40px] h-[40px] rounded-full grid place-items-center text-[18px]"
                style={{ background: `${tierColor}20`, border: `1.5px solid ${tierColor}` }}
              >
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-ink truncate">{ex.name}</div>
                <div className="mono text-[10px] text-mute mt-[2px]">
                  DAY {getDayForExercise(id)} · {pr.count} SETS
                </div>
              </div>
              <div className="text-right">
                <div className="display text-[20px]" style={{ color: tierColor }}>
                  {pr.weight ? `${pr.weight}×${pr.reps}` : pr.reps}
                </div>
                <div
                  className="display text-[9px] tracking-[0.14em] mt-[2px]"
                  style={{ color: tierColor }}
                >
                  {tierName}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">ACHIEVEMENTS</span>
        <span className="meta">
          {unlocked.size} OF {ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="mx-[16px] grid grid-cols-4 gap-[8px]">
        {ACHIEVEMENTS.map((a) => {
          const has = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className="aspect-square grid place-items-center p-[6px] text-center rounded-md"
              style={
                has
                  ? {
                      background: '#151A2E',
                      border: '1.5px solid #FFD93D',
                      boxShadow: '0 0 8px rgba(255,217,61,0.3)',
                    }
                  : {
                      background: '#151A2E',
                      border: '1px solid #2D3560',
                      opacity: 0.35,
                      filter: 'grayscale(1)',
                    }
              }
              title={a.description}
            >
              <div>
                <div className="text-[22px]">{has ? a.icon : '🔒'}</div>
                <div className="text-[9px] text-dim mt-[3px] leading-tight font-semibold">
                  {a.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getDayForExercise(id: string): string {
  const days = ['A', 'B', 'C', 'D'] as const;
  for (const d of days) {
    if (WORKOUTS[d].exercises.find((e) => e.id === id)) return d;
  }
  return '–';
}
