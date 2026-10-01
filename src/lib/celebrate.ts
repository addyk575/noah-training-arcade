import confetti from 'canvas-confetti';

const base = { disableForReducedMotion: true, zIndex: 100 } as const;

export function smallBurst() {
  confetti({ ...base, particleCount: 60, spread: 70, startVelocity: 35, origin: { y: 0.75 } });
}

export function bigCelebration() {
  const colors = ['#4F7CFF', '#22C55E', '#F59E0B', '#ffffff'];
  confetti({ ...base, particleCount: 120, spread: 100, origin: { y: 0.6 }, colors });
  setTimeout(() => confetti({ ...base, particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors }), 250);
  setTimeout(() => confetti({ ...base, particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 400);
}
