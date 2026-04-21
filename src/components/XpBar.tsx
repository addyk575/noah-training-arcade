type Props = {
  value: number;
  max: number;
  label?: string;
  color?: string;
  segments?: number;
};

export function XpBar({ value, max, label, color = '#FFD93D', segments = 20 }: Props) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-[4px]">
          <span className="pixel text-[8px] text-dim">{label}</span>
          <span className="pixel text-[8px]" style={{ color }}>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className="flex gap-[2px] h-[14px] p-[2px] rounded-xs"
        style={{ background: '#000', border: '1px solid #2D3560' }}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const on = (i / segments) * 100 < pct;
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                background: on ? color : 'transparent',
                boxShadow: on ? `0 0 4px ${color}` : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
