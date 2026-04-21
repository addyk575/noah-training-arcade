type Props = {
  rank: number;
  totalXp: number;
  streak: number;
};

export function Header({ rank, totalXp, streak }: Props) {
  const rankText = rank.toString().padStart(2, '0');
  return (
    <header
      className="sticky top-0 z-10 px-[16px] py-[12px] flex items-center justify-between"
      style={{
        background: 'rgba(10, 11, 26, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #2D3560',
      }}
    >
      <div className="flex items-center gap-[10px]">
        <div
          className="w-[34px] h-[34px] rounded-full grid place-items-center text-black font-black"
          style={{
            background: 'linear-gradient(135deg, #FFD93D, #FF4785)',
            boxShadow: '0 0 14px rgba(255,217,61,0.5)',
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: 16,
          }}
        >
          N
        </div>
        <div>
          <div className="display text-[14px] text-ink leading-none">NOAH</div>
          <div className="mono text-[10px] text-dim tracking-[0.08em] leading-none mt-[3px]">
            LVL {rankText} · {totalXp.toLocaleString()} XP
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <div
          className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-xs"
          style={{ background: '#151A2E', border: '1px solid #2D3560' }}
        >
          <span className="animate-flame text-[12px]">🔥</span>
          <span className="mono text-[11px] font-bold text-ink">{streak}</span>
        </div>
      </div>
    </header>
  );
}
