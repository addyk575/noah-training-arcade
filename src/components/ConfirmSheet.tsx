export type ConfirmRequest = {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
};

/** In-app replacement for window.confirm, which in-app browsers can silently block. */
export function ConfirmSheet({ req, onClose }: { req: ConfirmRequest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={req.title}
        className="w-full max-w-[480px] bg-card border-t border-line rounded-t-3xl p-5"
        style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[30px] font-bold">{req.title}</div>
        <p className="text-[24px] text-dim leading-relaxed mt-1.5">{req.body}</p>
        <button
          onClick={() => {
            onClose();
            req.onConfirm();
          }}
          className="w-full h-16 mt-5 rounded-xl bg-bad text-white font-semibold text-[25px] active:opacity-80"
        >
          {req.confirmLabel}
        </button>
        <button onClick={onClose} className="btn-secondary w-full h-16 mt-2 text-[25px]">
          Keep current workout
        </button>
      </div>
    </div>
  );
}
