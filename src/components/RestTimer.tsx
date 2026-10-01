import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from './Icons';

export type RestState = { endsAt: number; total: number; next?: { id: string; label: string } };

type Ctx = { ctx: AudioContext; oscs: OscillatorNode[] };

/** Beeps are scheduled ahead on an AudioContext created during the tap, so iOS lets them play. */
function scheduleBeeps(ref: { current: Ctx | null }, endsAt: number) {
  try {
    if (!ref.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ref.current = { ctx: new AC(), oscs: [] };
    }
    const { ctx } = ref.current;
    ref.current.oscs.forEach((o) => o.stop());
    ref.current.oscs = [];
    const start = ctx.currentTime + Math.max(0, (endsAt - Date.now()) / 1000);
    [0, 0.3, 0.6].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = i === 2 ? 1320 : 880;
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(0.4, start + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start + offset);
      osc.stop(start + offset + 0.25);
      ref.current!.oscs.push(osc);
    });
  } catch {
    /* sound is a nice-to-have */
  }
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
}

export function RestTimer({ rest, onChange, onClose, onGo }: { rest: RestState; onChange: (r: RestState) => void; onClose: () => void; onGo: (id: string) => void }) {
  const [now, setNow] = useState(() => Date.now());
  const audio = useRef<Ctx | null>(null);

  useEffect(() => {
    scheduleBeeps(audio, rest.endsAt);
  }, [rest.endsAt]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(
    () => () => {
      audio.current?.oscs.forEach((o) => o.stop());
      audio.current?.ctx.close();
    },
    [],
  );

  const left = Math.max(0, Math.ceil((rest.endsAt - now) / 1000));
  const done = left === 0;
  const pct = Math.min(1, 1 - (rest.endsAt - now) / (rest.total * 1000));
  const adjust = (d: number) => onChange({ ...rest, endsAt: Math.max(Date.now() + 5000, rest.endsAt + d * 1000), total: Math.max(5, rest.total + d) });
  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 mx-auto max-w-[480px] bg-card border-t-2 border-accent rounded-t-3xl px-5 pt-4 animate-slide-up"
      style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-[128px] h-[128px] shrink-0">
          <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" stroke="#1E1F27" strokeWidth="12" />
            <circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke={done ? '#22C55E' : '#4F7CFF'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 250ms linear' }}
            />
          </svg>
          <div className={`absolute inset-0 grid place-items-center text-[34px] font-extrabold tabular-nums ${done ? 'text-good animate-pulse' : ''}`}>
            {done ? 'GO!' : fmt(left)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[25px] font-bold leading-tight">{done ? 'Rest over!' : 'Rest'}</div>
          <div className="text-[20px] text-dim leading-snug mt-0.5">
            {rest.next ? `Then: ${rest.next.label}` : done ? 'Time for your next set' : 'Catch your breath'}
          </div>
          {!done && (
            <div className="flex gap-2 mt-3">
              <button onClick={() => adjust(-15)} className="btn-secondary h-12 flex-1 text-[21px]">−15s</button>
              <button onClick={() => adjust(15)} className="btn-secondary h-12 flex-1 text-[21px]">+15s</button>
            </div>
          )}
        </div>
      </div>
      {rest.next ? (
        <button onClick={() => onGo(rest.next!.id)} className="btn-primary w-full h-16 mt-4 text-[23px] flex items-center justify-center gap-1 px-4">
          <span className="truncate">{done ? 'Go' : 'Skip rest'}: {rest.next.label}</span>
          <ChevronRight size={26} className="shrink-0" />
        </button>
      ) : (
        <button onClick={onClose} className={`${done ? 'btn-primary' : 'btn-secondary'} w-full h-16 mt-4 text-[23px]`}>
          {done ? 'Start next set' : 'Skip rest'}
        </button>
      )}
    </div>
  );
}
