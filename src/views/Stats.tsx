import { useMemo } from 'react';
import type { Session } from '../state/store';
import { ACHIEVEMENTS } from '../data/achievements';
import { rankInfo, totalXp } from '../state/progress';
import { getExercise, WORKOUTS } from '../data/workouts';
import { PixelCard, SectionHead, Divider } from '../components/PixelCard';

type Props = { sessions: Session[] };

const TIER_COLORS = ['#FFD93D', '#C0C8E0', '#D4894F'] as const;

export function Stats({ sessions }: Props) {
  const rank = rankInfo(sessions);
  const unlocked = useMemo(
    () => new Set(ACHIEVEMENTS.filter((a) => a.check(sessions)).map((a) => a.id)),
    [sessions],
  );

  const prs = useMemo(() => {
    const best: Record<string, { weight: number; reps: number; at: string }> = {};
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
            };
          }
        }
      }
    }
    return Object.entries(best).slice(0, 6);
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
      { l: 'STR', v: Math.min(50, Math.floor(total / 50)), c: '#FF4785' },
      { l: 'END', v: Math.min(50, Math.floor(planks / 40)), c: '#4DD4FF' },
      { l: 'DEX', v: Math.min(50, boxjumps), c: '#10F8A0' },
      { l: 'FOCUS', v: Math.min(50, done.length * 3), c: '#FFD93D' },
    ];
  }, [sessions]);

  return (
    <div className="pb-[80px]">
      <SectionHead>HERO STATS</SectionHead>

      <div className="mx-[14px]">
        <PixelCard accent="legendary">
          <div className="grid grid-cols-2 gap-[14px]">
            {attrs.map((s) => (
              <div key={s.l}>
                <div className="pixel text-[10px] tracking-[0.1em]" style={{ color: s.c }}>
                  {s.l}
                </div>
                <div className="pixel text-[26px] text-ink mt-[6px]">{s.v}</div>
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

      <div className="mx-[14px] mt-[14px]">
        <PixelCard accent="xp">
          <div className="flex items-center gap-[12px]">
            <div className="text-[26px]">⭐</div>
            <div className="flex-1">
              <div className="pixel text-[10px] tracking-[0.1em] text-xp">
                TOTAL XP · LVL {rank.rank}
              </div>
              <div className="pixel text-[22px] text-ink mt-[6px]">{rank.totalXp.toLocaleString()}</div>
            </div>
          </div>
        </PixelCard>
      </div>

      <SectionHead>PERSONAL RECORDS</SectionHead>

      {prs.length === 0 && (
        <div className="mx-[14px]">
          <PixelCard accent="line">
            <div className="text-center text-[13px] text-mute font-semibold">No records yet</div>
            <div className="text-center text-[12px] text-dim mt-[4px]">
              Finish a workout to set your first PR.
            </div>
          </PixelCard>
        </div>
      )}

      <div className="flex flex-col gap-[10px]">
        {prs.map(([id, pr], i) => {
          const ex = getExercise(id);
          if (!ex) return null;
          const tierColor = TIER_COLORS[i] ?? '#6B6B95';
          const tierName = i === 0 ? 'Gold' : i === 1 ? 'Silver' : i === 2 ? 'Bronze' : `#${i + 1}`;
          const accent = i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze';
          return (
            <div key={id} className="mx-[14px]">
              <PixelCard accent={accent as 'gold' | 'silver' | 'bronze'}>
                <div className="flex items-center gap-[12px]">
                  <div className="text-[28px]">🏆</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-ink truncate">
                      {ex.name}
                    </div>
                    <div
                      className="text-[11px] mt-[2px] font-semibold"
                      style={{ color: tierColor }}
                    >
                      {tierName} · Day {getDayForExercise(id)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="pixel text-[14px] text-ink">
                      {pr.weight ? `${pr.weight}×${pr.reps}` : pr.reps}
                    </div>
                    {pr.weight > 0 && (
                      <div className="text-[10px] text-mute mt-[2px]">lb</div>
                    )}
                  </div>
                </div>
              </PixelCard>
            </div>
          );
        })}
      </div>

      <SectionHead>
        <span>
          ACHIEVEMENTS · {unlocked.size}/{ACHIEVEMENTS.length}
        </span>
      </SectionHead>

      <div className="mx-[14px] grid grid-cols-3 gap-[8px]">
        {ACHIEVEMENTS.map((a) => {
          const has = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className="aspect-square grid place-items-center p-[6px] text-center rounded-sm"
              style={
                has
                  ? {
                      background: '#151A2E',
                      border: '2px solid #FFD93D',
                      boxShadow: '0 0 10px rgba(255,217,61,0.3)',
                    }
                  : {
                      background: '#151A2E',
                      border: '2px solid #2D3560',
                      opacity: 0.4,
                      filter: 'grayscale(1)',
                    }
              }
              title={a.description}
            >
              <div>
                <div className="text-[26px]">{has ? a.icon : '🔒'}</div>
                <div className="text-[10px] text-dim mt-[4px] leading-tight font-semibold">
                  {a.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Divider>{ACHIEVEMENTS.length - unlocked.size} MORE TO UNLOCK</Divider>
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
