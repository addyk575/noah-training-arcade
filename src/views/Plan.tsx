import { PLAN_COPY } from '../data/plan';
import { PixelCard } from '../components/PixelCard';
import { Card } from '../components/Card';

const PHASE_COLORS = ['#4DD4FF', '#FF4785', '#A855F7', '#10F8A0'];

export function Plan() {
  return (
    <div className="pb-[80px]">
      <div className="flex items-baseline justify-between px-[18px] mt-[20px] mb-[10px]">
        <span className="eyebrow">THE MISSION</span>
        <span className="meta">12-WEEK PROGRAM</span>
      </div>

      <div className="mx-[16px]">
        <PixelCard accent="xp" glow>
          <div className="display text-[22px] text-ink">{PLAN_COPY.mission.title}</div>
          <p
            className="text-[13px] text-dim leading-[1.55] mt-[10px] [&>b]:text-ink [&>b]:font-bold"
            dangerouslySetInnerHTML={{ __html: PLAN_COPY.mission.body }}
          />
        </PixelCard>
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">WHY IT WORKS</span>
        <span className="meta">REASONING</span>
      </div>

      <div className="px-[16px] flex flex-col gap-[8px]">
        {PLAN_COPY.why.map((w, i) => (
          <div
            key={i}
            className="rounded-lg p-[14px]"
            style={{ background: '#151A2E', border: '1px solid #2D3560' }}
          >
            <div className="display text-[14px] text-ink">{w.h}</div>
            <p
              className="text-[12px] text-dim leading-[1.55] mt-[4px] [&>b]:text-ink [&>b]:font-bold"
              dangerouslySetInnerHTML={{ __html: w.p }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">PHASES</span>
        <span className="meta">4 BLOCKS</span>
      </div>

      <div className="mx-[16px]">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#151A2E', border: '1px solid #2D3560' }}
        >
          {PLAN_COPY.phases.map((p, i) => (
            <div
              key={i}
              className={`p-[14px] pl-[18px] relative ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: PHASE_COLORS[i],
                }}
              />
              <div className="flex items-baseline justify-between">
                <div className="display text-[15px] text-ink">{p.name}</div>
                <div
                  className="mono text-[10px] tracking-[0.08em]"
                  style={{ color: PHASE_COLORS[i] }}
                >
                  WK {p.wk}
                </div>
              </div>
              <div className="mono text-[11px] text-mute mt-[2px]">
                {p.reps} · {p.load}
              </div>
              <div className="text-[13px] text-dim leading-[1.5] mt-[6px]">{p.focus}</div>
              <div className="text-[11px] text-mute italic mt-[4px]">{p.sets}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">RULES</span>
        <span className="meta">NON-NEGOTIABLE</span>
      </div>

      <div className="px-[16px] flex flex-col gap-[8px]">
        {PLAN_COPY.rules.map((r, i) => (
          <div
            key={i}
            className="rounded-lg p-[12px] flex gap-[12px]"
            style={{ background: '#151A2E', border: '1px solid #2D3560' }}
          >
            <div
              className="mono text-[12px] text-xp w-[24px] h-[24px] grid place-items-center rounded-xs self-start font-bold"
              style={{ background: '#0A0B1A', border: '1px solid rgba(255,217,61,0.4)' }}
            >
              {(i + 1).toString().padStart(2, '0')}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-ink">{r.h}</div>
              <div className="text-[12px] text-dim leading-[1.5] mt-[2px]">{r.p}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px]">
        <span className="eyebrow">ALLOWANCE</span>
        <span className="meta">THE DEAL</span>
      </div>

      <div className="mx-[16px]">
        <Card accent="xp" leftStripe>
          <div className="p-[16px] pl-[22px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[22px]">🔓</span>
              <div className="display text-[14px] text-xp">{PLAN_COPY.allowance.h}</div>
            </div>
            <p
              className="text-[12px] text-dim leading-[1.55] mt-[8px] [&>b]:text-ink [&>b]:font-bold"
              dangerouslySetInnerHTML={{ __html: PLAN_COPY.allowance.p }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
