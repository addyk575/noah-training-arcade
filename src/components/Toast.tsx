import { useEffect } from 'react';

export type ToastMsg = { id: number; icon: string; title: string; detail?: string };

export function Toast({ msg, onDone }: { msg: ToastMsg; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [msg.id, onDone]);
  return (
    <div className="fixed top-20 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div
        role="status"
        className="animate-pop pointer-events-auto max-w-[440px] w-full rounded-2xl bg-card2 border-2 border-warn/60 shadow-2xl px-4 py-3 flex items-center gap-3"
        onClick={onDone}
      >
        <span className="text-[40px] leading-none">{msg.icon}</span>
        <div className="min-w-0">
          <div className="text-[25px] font-extrabold leading-tight">{msg.title}</div>
          {msg.detail && <div className="text-[20px] text-dim leading-snug">{msg.detail}</div>}
        </div>
      </div>
    </div>
  );
}
