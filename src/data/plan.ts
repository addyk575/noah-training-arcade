export const PLAN_COPY = {
  mission: {
    title: 'The Mission',
    body: 'Build an <b>explosive, durable athlete</b> for basketball year-round and football in fall. 4 days a week, 45 minutes a session. The plan rotates <b>upper/lower</b> and <b>strength/power</b> so nothing gets overtrained — and you still have legs for the court.',
  },
  why: [
    { h: 'Why 4 days', p: "Enough volume to actually get stronger. Little enough that you can still hoop, recover, and grow. Miss one — push it forward, don't stack two lower days." },
    { h: 'Why rotate A / B / C / D', p: 'A & C hit upper (push/pull/build). B & D hit lower (cuts, jumps, sprint). Mixing <b>strength days</b> (heavy, low reps) with <b>power/hypertrophy days</b> (fast or medium) keeps the nervous system sharp for game day.' },
    { h: 'Why jumps & sprints count as work', p: 'Vertical and first-step speed come from force produced <b>fast</b>, not just heavy. Box jumps, broad jumps, and 5-10-5s are the actual sport — treat them like a lift.' },
  ],
  phases: [
    { wk: '1–4',  name: 'Foundation',  reps: '5×5 / 3×10', load: 'Light → moderate',    focus: 'Lock in form. Add weight only when every rep looks clean.', sets: "Sets feel easy at first — that's intentional." },
    { wk: '5–8',  name: 'Build',       reps: '4×5 / 4×8',  load: 'Push each session',   focus: 'Top of rep range hit? Add weight next time. Miss it? Repeat.', sets: 'First real pushing phase. PRs start landing here.' },
    { wk: '9–11', name: 'Peak',        reps: '4×3 / 3×6',  load: 'Heavy, slower tempo', focus: 'Max strength + power. Longer rest (2–3 min on big lifts).',  sets: "You'll feel strong. You'll feel fast. This is the payoff." },
    { wk: '12',   name: 'Deload',      reps: '3×5 @ 60%',  load: 'Back off',            focus: 'Half the weight, half the sets. Let the body catch up.',     sets: "Don't skip this. It's what makes the next 12 weeks work." },
  ],
  rules: [
    { h: 'Log every set', p: "If it isn't written down it didn't happen. The app tracks it — use it." },
    { h: 'Warm up, every time', p: '5 min easy row/bike, then 2 ramp-up sets on your first big lift. Non-negotiable.' },
    { h: 'Form > weight', p: 'One ugly rep wipes out a good set. If a spotter would frown, drop the weight.' },
    { h: 'Sleep 9+ hrs', p: "You're 14. Growth + strength happen at night. Non-negotiable." },
    { h: 'Eat to grow', p: 'At 100 lb you need 100+ g protein a day and real meals. Weight room work without food = nothing.' },
    { h: 'Injury = stop', p: 'Sharp pain, anything that changes your form — stop. Tell a parent/coach. Come back when it\'s gone, not before.' },
  ],
  allowance: {
    h: 'The allowance rule',
    p: 'Hit <b>4 workouts in any rolling 8-day window</b> → allowance earned. Miss the window, the count resets. This keeps you consistent without punishing one bad week. Your progress bar on Today tracks it.',
  },
};
