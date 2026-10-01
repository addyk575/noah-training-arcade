import { useEffect, useState } from 'react';
import { demoSrc } from '../data/workouts';

export function Thumb({ id, size = 56 }: { id: string; size?: number }) {
  return (
    <img
      src={demoSrc(id, 1)}
      alt=""
      loading="lazy"
      className="rounded-xl object-cover bg-card2 shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function Photo({ id }: { id: string }) {
  return <img src={demoSrc(id, 1)} alt="" loading="lazy" className="w-full aspect-[16/10] rounded-xl object-cover bg-card2" />;
}

/** Alternates the start and end photos so the movement reads like a short loop. */
export function Demo({ id }: { id: string }) {
  const [frame, setFrame] = useState<0 | 1>(0);
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 1100);
    return () => clearInterval(t);
  }, [id]);
  return (
    <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-card2">
      {([0, 1] as const).map((f) => (
        <img
          key={f}
          src={demoSrc(id, f)}
          alt={f === 0 ? 'Start position' : 'End position'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: frame === f ? 1 : 0 }}
        />
      ))}
      <div className="absolute bottom-2 left-2 flex gap-1">
        {(['Start', 'Finish'] as const).map((l, i) => (
          <span
            key={l}
            className={`text-[19px] font-semibold px-2 py-0.5 rounded-full ${
              frame === i ? 'bg-white text-black' : 'bg-black/50 text-white/70'
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
