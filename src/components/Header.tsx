type Props = {
  rank: number;
  totalXp: number;
  streak: number;
};

export function Header({ rank, totalXp, streak }: Props) {
  return (
    <header className="px-[16px] py-[12px] flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <div
          className="w-[34px] h-[34px] rounded-full grid place-items-center pixel text-[11px] text-black"
          style={{
            background: 'linear-gradient(135deg, #FFD93D, #FF4785)',
            boxShadow: '0 0 16px rgba(255,217,61,0.5)',
          }}
        >
          N
        </div>
        <div>
          <div className="pixel text-[9px] text-xp tracking-[0.08em]">LVL {rank}</div>
          <div className="text-[13px] font-bold leading-none mt-[3px]">NOAH_14</div>
        </div>
      </div>
      <div className="flex items-center gap-[10px]">
        <div className="flex items-center gap-[4px]">
          <span className="animate-flame text-[12px]">🔥</span>
          <span className="pixel text-[9px] text-hp">
            <span className="text-ink">{streak}</span>
          </span>
        </div>
        <div className="flex items-center gap-[4px]">
          <span className="text-xp text-[14px] leading-none">★</span>
          <span className="pixel text-[9px] text-xp">
            <span className="text-ink">{totalXp.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
