export const PLAN_COPY = {
  mission: {
    title: 'The Mission',
    body: 'Build <b>upper-body strength and size</b> with Kayla’s 3-day gym split: <b>chest + triceps</b>, <b>back + biceps</b>, <b>shoulders</b>. About 45–50 minutes a session. Show up three times a week and beat last week’s numbers.',
  },
  why: [
    { h: 'Why 3 days', p: 'Each muscle group gets one hard, focused day a week with plenty of recovery. Miss one? Do it next time you’re in. Just keep the A → B → C order.' },
    { h: 'Why supersets', p: 'Exercises marked <b>superset</b> are done back-to-back: one set of each, then rest. Same work, less time in the gym.' },
    { h: 'Why log every set', p: 'Progress comes from adding a little <b>weight or reps</b> over time. The app shows what you did last time so you know what to beat.' },
  ],
  phases: [
    { wk: '1–4',  name: 'Dial In',   reps: 'As written', load: 'Moderate',           focus: 'Learn each movement and find working weights. Clean reps over heavy reps.', sets: 'Last set should feel hard but doable.' },
    { wk: '5–8',  name: 'Build',     reps: 'As written', load: 'Push each session',  focus: 'Hit the top of the rep range? Add weight next time. Missed it? Repeat it.',   sets: 'This is where PRs start landing.' },
    { wk: '9–11', name: 'Push',      reps: 'As written', load: 'Heavy',              focus: 'Last 2 sets of each lift should be a real struggle. Rest 2 min on big presses.', sets: 'Keep form tight as the weight climbs.' },
    { wk: '12',   name: 'Deload',    reps: 'Half sets',  load: '~60%',               focus: 'Back off for a week so you come back stronger.',                            sets: "Don't skip it. It's what makes the next block work." },
  ],
  rules: [
    { h: 'Log every set', p: "If it isn't written down it didn't happen." },
    { h: 'Warm up every time', p: 'Ts + Ys or a few light sets before your first big lift.' },
    { h: 'Form over weight', p: 'No bouncing, no swinging. If form breaks, drop the weight.' },
    { h: 'Protein + sleep', p: 'Aim for ~0.8–1 g protein per lb of bodyweight and 7–8 hours of sleep.' },
    { h: 'Pain = stop', p: 'Sharp or joint pain means stop that exercise. Check with Kayla before going back to it.' },
  ],
  allowance: {
    h: 'Hit the week',
    p: 'Finish <b>3 workouts in any rolling 7-day window</b> to complete the weekly quest. The progress bar on Today tracks it.',
  },
};
