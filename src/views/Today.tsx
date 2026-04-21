import { WORKOUTS, type DayKey } from '../data/workouts';
import type { Session } from '../state/store';
import {
  allowanceCount,
  computeStreak,
  nextRecommendedDay,
  rankInfo,
  sessionsThisWeek,
  todayIndexInWeek,
} from '../state/progress';
import { PixelCard } from '../components/PixelCard';
import { Card } from '../components/Card';
import { XpBar } from '../components/XpBar';

type Props = {
  sessions: Session[];
  onStart: (day: DayKey) => void;
};

const DAY_COLOR: Record<DayKey, string> = {
  A: '#4DD4FF',
  B: '#10F8A0',
  C: '#FF9A3C',
  D: '#A855F7',
};

export function Today({ sessions, onStart }: Props) {
  const now = new Date();
  const rank = rankInfo(sessions);
  const count = allowanceCount(sessions, now);
  const goal = 4;
  const unlocked = count >= goal;
  const nextDay = nextRecommendedDay(sessions);
  const day = WORKOUTS[nextDay];
  const streak = computeStreak(sessions, now);
  const week = sessionsThisWeek(sessions, now);
  const todayIdx = todayIndexInWeek(now);
  const weekLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const remaining = Math.max(0, goal - count);

  return (
    <div className="pb-[80px]">
      <div className="px-[16px] pt-[14px] pb-[6px]">
        <XpBar
          value={rank.xpInRank}
          max={rank.xpToNext}
          label={`LVL ${rank.rank.toString().padStart(2, '0')} → ${(rank.rank + 1).toString().padStart(2, '0')}`}
          color="#FFD93D"
        />
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[20px] mb-[10px]">
        <span className="eyebrow">ACTIVE QUEST</span>
        <span className="meta">8-DAY WINDOW</span>
      </div>

      <div className="mx-[16px]">
        <PixelCard accent={unlocked ? 'win' : 'xp'} glow>
          <div
            className="absolute top-0 right-0 text-black px-[10px] py-[5px]"
            style={{
              background: unlocked ? '#10F8A0' : '#FFD93D',
              borderBottomLeftRadius: 10,
              fontFamily: 'Press Start 2P, monospace',
              fontSize: 9,
              letterSpacing: '0.1em',
            }}
          >
            +500 XP
          </div>
          <div className="meta text-[10px] tracking-[0.1em] uppercase">
            QUEST · EARN SCREEN TIME
          </div>
          <div className="flex items-baseline mt-[2px]">
            <span className="display text-[56px] leading-none text-ink">{count}</span>
            <span className="display text-[28px] leading-none text-mute ml-[6px]">/ {goal}</span>
          </div>
          <div className="text-[13px] text-dim mt-[4px]">sessions in the last 8 days</div>

          <div className="flex gap-[6px] mt-[14px]">
            {Array.from({ length: goal }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[6px] rounded-[3px]"
                style={{
                  background: i < count ? (unlocked ? '#10F8A0' : '#FFD93D') : '#1E2545',
                  boxShadow: i < count ? `0 0 6px ${unlocked ? '#10F8A0' : '#FFD93D'}` : 'none',
                }}
              />
            ))}
          </div>

          <div className="mt-[14px] text-[14px]">
            {unlocked ? (
              <span className="text-win font-bold">🔓 Phone unlocked for the week</span>
            ) : (
              <>
                <span className="text-dim">{remaining} more</span>{' '}
                <span className="text-xp font-bold">→ phone unlocks</span>
              </>
            )}
          </div>
        </PixelCard>
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">NEXT UP</span>
        <span className="meta">RECOMMENDED</span>
      </div>

      <div className="mx-[16px]">
        <Card accent={getAccent(nextDay)} leftStripe>
          <div className="flex items-center gap-[14px] p-[16px] pl-[22px]">
            <div className="flex-1 min-w-0">
              <div className="mono text-[10px] text-mute tracking-[0.08em]">
                DAY {nextDay} · +150 XP
              </div>
              <div className="display text-[22px] text-ink truncate mt-[2px]">{day.name}</div>
              <div className="mono text-[10px] text-mute tracking-[0.08em] mt-[2px]">
                {day.exercises.length} LIFTS · ~{day.duration} MIN
              </div>
            </div>
            <button
              onClick={() => onStart(nextDay)}
              className="px-[16px] py-[11px] rounded-md text-black display text-[12px] tracking-[0.1em] active:scale-[0.97] transition-transform"
              style={{
                background: DAY_COLOR[nextDay],
                boxShadow: `0 0 14px ${DAY_COLOR[nextDay]}80`,
              }}
            >
              START ›
            </button>
          </div>
        </Card>
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">THIS WEEK</span>
        <span className="flex items-center gap-[4px] text-[11px]">
          <span className="animate-flame">🔥</span>
          <span className="font-bold text-hp">
            {streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : '—'}
          </span>
        </span>
      </div>

      <div className="mx-[16px] flex gap-[6px]">
        {week.map((done, i) => {
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-[4px]">
              <span className="mono text-[9px] text-mute">{weekLetters[i]}</span>
              <div
                className="w-full aspect-square rounded-md grid place-items-center"
                style={{
                  background: done ? '#FF4785' : '#1E2545',
                  border: `1.5px solid ${
                    done ? '#FF4785' : isToday ? '#FFD93D' : 'transparent'
                  }`,
                  boxShadow: done ? '0 0 8px rgba(255,71,133,0.4)' : 'none',
                  color: done ? '#fff' : isToday ? '#FFD93D' : '#6B6B95',
                }}
              >
                {done && <span className="display text-[13px] leading-none">✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mx-[16px] mt-[20px] rounded-lg px-[14px] py-[11px] flex items-center gap-[12px]"
        style={{ background: '#151A2E', border: '1px solid #2D3560' }}
      >
        <span className="animate-flame text-[16px]">🔥</span>
        <span className="flex-1 text-[12px] text-dim">
          {streak > 0 ? 'Train tomorrow to keep the streak alive' : 'Finish a session to start a streak'}
        </span>
        <span className="display text-[11px] text-hp tracking-[0.1em]">{streak}D</span>
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">PICK ANY DAY</span>
        <span className="meta">OVERRIDE</span>
      </div>

      <div className="mx-[16px] grid grid-cols-4 gap-[8px]">
        {(['A', 'B', 'C', 'D'] as DayKey[]).map((d) => {
          const isNext = d === nextDay;
          return (
            <button
              key={d}
              onClick={() => onStart(d)}
              className="py-[14px] rounded-md display text-[14px] active:scale-[0.97] transition-transform"
              style={{
                background: '#151A2E',
                border: `1.5px solid ${isNext ? DAY_COLOR[d] : '#2D3560'}`,
                color: isNext ? DAY_COLOR[d] : '#6B6B95',
                boxShadow: isNext ? `0 0 10px ${DAY_COLOR[d]}40` : 'none',
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getAccent(d: DayKey): 'mana' | 'win' | 'hp' | 'legendary' {
  return d === 'A' ? 'mana' : d === 'B' ? 'win' : d === 'C' ? 'hp' : 'legendary';
}
