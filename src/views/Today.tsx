import { WORKOUTS, type DayKey } from '../data/workouts';
import type { Session } from '../state/store';
import { allowanceCount, computeStreak, nextRecommendedDay, rankInfo, sessionsThisWeek, todayIndexInWeek } from '../state/progress';
import { PixelCard, SectionHead } from '../components/PixelCard';
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

const DAY_ICON: Record<DayKey, string> = {
  A: '🏋',
  B: '🦵',
  C: '💪',
  D: '⚡',
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
      <div className="px-[14px] pt-[4px]">
        <XpBar value={rank.xpInRank} max={rank.xpToNext} label={`LVL ${rank.rank} → ${rank.rank + 1}`} color="#FFD93D" />
      </div>

      <div className="divider py-[14px]">─── WEEKLY QUEST ───</div>

      <div className="mx-[14px]">
        <PixelCard accent={unlocked ? 'win' : 'xp'} glow>
          <div className="flex items-center gap-[12px] mb-[12px]">
            <div
              className="w-[40px] h-[40px] grid place-items-center rounded-sm text-[20px] text-black"
              style={{ background: unlocked ? '#10F8A0' : '#FFD93D' }}
            >
              {unlocked ? '✓' : '⚔'}
            </div>
            <div className="flex-1">
              <div className="pixel text-[10px] tracking-[0.1em]" style={{ color: unlocked ? '#10F8A0' : '#FFD93D' }}>
                {unlocked ? 'QUEST DONE' : 'EARN SCREEN TIME'}
              </div>
              <div className="text-[20px] font-extrabold mt-[4px]">
                {count} <span className="text-mute font-normal">/ {goal}</span> sessions
              </div>
            </div>
          </div>
          <XpBar value={count} max={goal} label={`${count} of ${goal} in last 8 days`} color={unlocked ? '#10F8A0' : '#FFD93D'} segments={goal * 5} />
          <div className="mt-[10px] text-[13px] text-dim">
            {unlocked ? (
              <span className="text-win font-bold">🔓 Phone unlocked for the week</span>
            ) : (
              <>
                <span className="text-ink font-bold">{remaining} more</span> workout{remaining === 1 ? '' : 's'} →{' '}
                <span className="text-xp font-bold">phone unlocks</span>
              </>
            )}
          </div>
        </PixelCard>
      </div>

      <SectionHead>NEXT WORKOUT</SectionHead>

      <div className="mx-[14px]">
        <PixelCard accent="mana">
          <div className="flex items-center gap-[12px]">
            <div
              className="w-[56px] h-[56px] rounded-sm grid place-items-center text-[26px]"
              style={{ background: `linear-gradient(135deg, ${DAY_COLOR[nextDay]}, #1e5aa8)` }}
            >
              {DAY_ICON[nextDay]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="pixel text-[10px] tracking-[0.1em] text-mana">
                DAY {nextDay}
              </div>
              <div className="text-[18px] font-extrabold mt-[4px] truncate">{day.name}</div>
              <div className="text-[12px] text-dim mt-[3px]">
                {day.exercises.length} exercises · ~{day.duration} min · <span className="text-xp">+150 XP</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onStart(nextDay)}
            className="w-full mt-[14px] py-[12px] pixel text-[11px] tracking-[0.1em] rounded-xs text-black active:scale-[0.98] transition-transform"
            style={{
              background: '#4DD4FF',
              boxShadow: '0 0 12px rgba(77,212,255,0.5)',
            }}
          >
            ▶ START
          </button>
        </PixelCard>
      </div>

      <div className="px-[14px] pt-[20px] pb-[10px] flex justify-between items-center">
        <div className="pixel text-[10px] text-mute tracking-[0.12em]">▸ THIS WEEK</div>
        <div className="text-[12px] font-bold flex items-center gap-[4px]">
          <span className="animate-flame">🔥</span>
          <span className="text-hp">{streak} day{streak === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="mx-[14px] flex gap-[4px]">
        {week.map((done, i) => {
          const isToday = i === todayIdx;
          return (
            <div
              key={i}
              className="flex-1 aspect-square rounded-sm grid place-items-center pixel text-[9px]"
              style={{
                background: done ? '#FF4785' : '#1E2545',
                border: `2px solid ${done ? '#FF4785' : isToday ? '#FFD93D' : '#2D3560'}`,
                color: done ? '#fff' : isToday ? '#FFD93D' : '#6B6B95',
                boxShadow: done ? '0 0 10px rgba(255,71,133,0.4)' : 'none',
              }}
            >
              {done ? '✓' : weekLetters[i]}
            </div>
          );
        })}
      </div>

      <SectionHead>PICK A DAY</SectionHead>
      <div className="mx-[14px] grid grid-cols-4 gap-[8px]">
        {(['A', 'B', 'C', 'D'] as DayKey[]).map((d) => {
          const isNext = d === nextDay;
          return (
            <button
              key={d}
              onClick={() => onStart(d)}
              className="py-[14px] rounded-sm pixel text-[12px]"
              style={{
                background: isNext ? '#151A2E' : 'transparent',
                border: `2px solid ${isNext ? DAY_COLOR[d] : '#2D3560'}`,
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
