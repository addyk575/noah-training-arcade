type Props = {
  label: string;
  meta?: string;
  metaClass?: string;
  className?: string;
};

export function Eyebrow({ label, meta, metaClass = 'text-mute', className = '' }: Props) {
  return (
    <div className={`flex items-baseline justify-between px-[18px] mt-[22px] mb-[10px] ${className}`}>
      <span className="eyebrow">{label}</span>
      {meta && <span className={`mono text-[10px] tracking-[0.08em] ${metaClass}`}>{meta}</span>}
    </div>
  );
}
