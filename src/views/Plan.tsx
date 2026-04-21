import { PLAN_COPY } from '../data/plan';
import { PixelCard, SectionHead } from '../components/PixelCard';

export function Plan() {
  return (
    <div className="pb-[80px]">
      <SectionHead>THE MISSION</SectionHead>

      <div className="mx-[14px]">
        <PixelCard accent="xp" glow>
          <div className="pixel text-[9px] text-xp tracking-[0.1em]">MAIN QUEST · 12 WEEKS</div>
          <div className="text-[18px] font-extrabold mt-[4px]">{PLAN_COPY.mission.title}</div>
          <p
            className="text-[12px] text-dim leading-[1.55] mt-[8px] [&>b]:text-ink [&>b]:font-bold"
            dangerouslySetInnerHTML={{ __html: PLAN_COPY.mission.body }}
          />
        </PixelCard>
      </div>

      <SectionHead>WHY IT WORKS</SectionHead>

      <div className="flex flex-col gap-[10px]">
        {PLAN_COPY.why.map((w, i) => (
          <div key={i} className="mx-[14px]">
            <PixelCard accent="mana">
              <div className="pixel text-[8px] text-mana tracking-[0.1em]">TIP {i + 1}</div>
              <div className="text-[13px] font-bold text-ink mt-[3px]">{w.h}</div>
              <p
                className="text-[11px] text-dim leading-[1.55] mt-[5px] [&>b]:text-ink [&>b]:font-bold"
                dangerouslySetInnerHTML={{ __html: w.p }}
              />
            </PixelCard>
          </div>
        ))}
      </div>

      <SectionHead>PHASES</SectionHead>

      <div className="flex flex-col gap-[10px]">
        {PLAN_COPY.phases.map((p, i) => {
          const accents = ['mana', 'hp', 'legendary', 'win'] as const;
          const colors = ['#4DD4FF', '#FF4785', '#A855F7', '#10F8A0'];
          return (
            <div key={i} className="mx-[14px]">
              <PixelCard accent={accents[i]}>
                <div className="flex items-baseline justify-between">
                  <div className="pixel text-[9px] tracking-[0.1em]" style={{ color: colors[i] }}>
                    PHASE {i + 1} · {p.name.toUpperCase()}
                  </div>
                  <div className="pixel text-[8px] text-mute">WK {p.wk}</div>
                </div>
                <div className="pixel text-[8px] text-dim mt-[5px] tracking-[0.08em]">
                  {p.reps.toUpperCase()} · {p.load.toUpperCase()}
                </div>
                <div className="text-[12px] text-ink leading-[1.5] mt-[8px]">{p.focus}</div>
                <div className="text-[11px] text-mute italic mt-[6px]">{p.sets}</div>
              </PixelCard>
            </div>
          );
        })}
      </div>

      <SectionHead>RULES · NON-NEGOTIABLE</SectionHead>

      <div className="flex flex-col gap-[8px]">
        {PLAN_COPY.rules.map((r, i) => (
          <div key={i} className="mx-[14px]">
            <PixelCard accent="line">
              <div className="flex gap-[12px]">
                <div
                  className="pixel text-[11px] text-xp w-[26px] grid place-items-center rounded-xs"
                  style={{ background: '#000', border: '1px solid #FFD93D' }}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-ink">{r.h}</div>
                  <div className="text-[11px] text-dim leading-[1.5] mt-[3px]">{r.p}</div>
                </div>
              </div>
            </PixelCard>
          </div>
        ))}
      </div>

      <SectionHead>ALLOWANCE · THE DEAL</SectionHead>

      <div className="mx-[14px]">
        <PixelCard accent="xp" glow>
          <div className="text-[20px]">🔓</div>
          <div className="pixel text-[9px] text-xp tracking-[0.1em] mt-[6px]">
            {PLAN_COPY.allowance.h.toUpperCase()}
          </div>
          <p
            className="text-[11px] text-dim leading-[1.55] mt-[8px] [&>b]:text-ink [&>b]:font-bold"
            dangerouslySetInnerHTML={{ __html: PLAN_COPY.allowance.p }}
          />
        </PixelCard>
      </div>
    </div>
  );
}
