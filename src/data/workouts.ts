export type DayKey = 'A' | 'B' | 'C' | 'D';

export type Exercise = {
  id: string;
  name: string;
  target: string;
  sets: number;
  unit: 'lb' | 'reps' | 'sec' | 'rounds';
  cues: string[];
  search: string;
  /** XP awarded for completing this exercise */
  xp: number;
};

export type WorkoutDay = {
  key: DayKey;
  name: string;
  color: string;
  focus: string;
  duration: number;
  exercises: Exercise[];
};

const primary = 40;
const accessory = 25;
const conditioning = 20;

export const WORKOUTS: Record<DayKey, WorkoutDay> = {
  A: {
    key: 'A',
    name: 'Upper Strength',
    color: '#5B8DEF',
    focus: 'Push / pull strength. Builds the pressing & pulling foundation.',
    duration: 45,
    exercises: [
      { id: 'bench',  name: 'Barbell Bench Press',      target: '4×5',         sets: 4, unit: 'lb',   xp: primary,
        cues: ['Spotter required', 'Feet planted, shoulder blades pinched', 'Bar to mid-chest, drive through feet'],
        search: 'barbell bench press form' },
      { id: 'pullup', name: 'Pull-ups',                 target: '4×5–8',       sets: 4, unit: 'reps', xp: primary,
        cues: ['Goal: 10 strict pull-ups by week 8', 'Full hang, chin over bar', 'Band assist allowed'],
        search: 'pull up proper form' },
      { id: 'ohp',    name: 'Seated DB Overhead Press', target: '3×8',         sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Seated with back support', 'Press straight up, not forward', 'Core tight, no arching'],
        search: 'seated dumbbell overhead press' },
      { id: 'dbrow',  name: 'One-Arm DB Row',           target: '3×10 / side', sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Hand and knee on bench', 'Pull elbow to hip, not armpit', 'Flat back, no twisting'],
        search: 'one arm dumbbell row' },
      { id: 'ezcurl', name: 'EZ-Bar Curl',              target: '3×10',        sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Elbows pinned at sides', 'Control the down phase', 'No swinging'],
        search: 'ez bar curl form' },
      { id: 'plank',  name: 'Plank',                    target: '3×40s',       sets: 3, unit: 'sec',  xp: conditioning,
        cues: ['Straight line head to heels', 'Squeeze glutes, brace core', 'No sagging'],
        search: 'plank proper form' },
    ],
  },
  B: {
    key: 'B',
    name: 'Lower Strength + Agility',
    color: '#62B778',
    focus: 'Squat, hinge, cuts. The basketball/football engine.',
    duration: 50,
    exercises: [
      { id: '5105',     name: '5-10-5 Pro Agility',     target: '4 reps',      sets: 4, unit: 'reps',   xp: conditioning,
        cues: ['3 cones, 5 yards apart', 'Sprint right 5, left 10, back 5', 'Full rest between reps'],
        search: '5-10-5 pro agility shuttle' },
      { id: 'lshuffle', name: 'Lateral Shuffle',        target: '4 rounds',    sets: 4, unit: 'rounds', xp: conditioning,
        cues: ['Low athletic stance', "Don't cross feet", 'Push off outside foot'],
        search: 'lateral shuffle drill' },
      { id: 'goblet',   name: 'Goblet Squat',           target: '4×8',         sets: 4, unit: 'lb',     xp: primary,
        cues: ['Heaviest DB at chest', 'Chest up, elbows inside knees', 'Full depth if mobility allows'],
        search: 'goblet squat form' },
      { id: 'rdl',      name: 'Romanian Deadlift',      target: '3×8',         sets: 3, unit: 'lb',     xp: primary,
        cues: ['Push hips back, slight knee bend', 'Bar close to legs, flat back', 'Feel hamstrings stretch'],
        search: 'romanian deadlift dumbbell' },
      { id: 'wlunge',   name: 'Walking Lunges (DBs)',   target: '3×8 / leg',   sets: 3, unit: 'lb',     xp: accessory,
        cues: ['Long step, front knee over ankle', 'Back knee light tap', 'Drive through front heel'],
        search: 'walking lunges dumbbell' },
      { id: 'calf',     name: 'Single-Leg Calf Raise',  target: '3×12 / side', sets: 3, unit: 'reps',   xp: accessory,
        cues: ['Stand on step edge if possible', 'Full range — toes up, heel below', 'Strong ankles = injury-proof cuts'],
        search: 'single leg calf raise' },
    ],
  },
  C: {
    key: 'C',
    name: 'Upper Hypertrophy + Power',
    color: '#E8A24A',
    focus: 'Size work. Fills out the frame + explosive medball power.',
    duration: 45,
    exercises: [
      { id: 'slam',    name: 'Slam Ball',               target: '4×6',       sets: 4, unit: 'reps', xp: conditioning,
        cues: ['Full extension overhead first', 'Slam hard, fully commit', 'Reset and go again'],
        search: 'medicine ball slam form' },
      { id: 'incline', name: 'Incline DB Press',        target: '4×10',      sets: 4, unit: 'lb',   xp: primary,
        cues: ['Bench at ~30° incline', 'DBs just outside shoulders', 'Press up and slightly together'],
        search: 'incline dumbbell press' },
      { id: 'trxrow',  name: 'TRX Inverted Row',        target: '4×10–12',   sets: 4, unit: 'reps', xp: primary,
        cues: ['Feet forward = harder', 'Straight body, squeeze blades', 'Chest to hands at top'],
        search: 'trx inverted row' },
      { id: 'lraise',  name: 'DB Lateral Raise',        target: '3×12',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Slight elbow bend', 'Lead with elbows', 'Stop at shoulder height'],
        search: 'dumbbell lateral raise' },
      { id: 'pushup',  name: 'Push-ups on Handles',     target: '3×AMRAP-2', sets: 3, unit: 'reps', xp: accessory,
        cues: ['Stop 2 reps shy of failure', 'Body straight, elbows ~45°', 'Deeper range than floor'],
        search: 'push up proper form' },
      { id: 'farmer',  name: 'Farmer Carry',            target: '3×30s',     sets: 3, unit: 'lb',   xp: conditioning,
        cues: ['Heaviest DBs he can hold', 'Walk tall, shoulders back', 'Grip + traps + core'],
        search: 'farmer carry walk' },
    ],
  },
  D: {
    key: 'D',
    name: 'Lower Power + Conditioning',
    color: '#E26A6A',
    focus: 'Jumping, sprinting, single-leg. Vert + first-step speed.',
    duration: 45,
    exercises: [
      { id: 'boxjump',   name: 'Box Jump',              target: '4×3',        sets: 4, unit: 'reps', xp: primary,
        cues: ['Stable box only', 'Land soft, quiet feet', "Step down each rep — don't rebound"],
        search: 'box jump form' },
      { id: 'broadjump', name: 'Broad Jump',            target: '3×3',        sets: 3, unit: 'reps', xp: primary,
        cues: ['Explode horizontally', 'Stick the landing — no stumble', 'Arms drive forward'],
        search: 'broad jump standing' },
      { id: 'skater',    name: 'Lateral Bound (Skater)', target: '3×4 / side', sets: 3, unit: 'reps', xp: accessory,
        cues: ['Push off outside foot', 'Land opposite foot, stick 1 sec', 'Basketball D-slide power'],
        search: 'skater jump lateral bound' },
      { id: 'frontsq',   name: 'Front Squat / Goblet',  target: '3×6',        sets: 3, unit: 'lb',   xp: primary,
        cues: ['Bar / DB on front delts, elbows up', 'Torso stays upright', 'Switch to front squat at 70+ lb goblet'],
        search: 'front squat form' },
      { id: 'slrdl',     name: 'Single-Leg RDL (DB)',   target: '3×8 / leg',  sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Tall on one leg', 'Hinge forward, back leg kicks', 'Huge for cuts + jump balance'],
        search: 'single leg romanian deadlift' },
      { id: 'bss',       name: 'Bulgarian Split Squat', target: '3×8 / leg',  sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Back foot on bench', 'Most weight on front leg', 'Drop straight down'],
        search: 'bulgarian split squat dumbbell' },
      { id: 'rowerg',    name: 'Row Intervals',         target: '5×250m',     sets: 5, unit: 'sec',  xp: conditioning,
        cues: ['Hard effort, not all-out', '1 min rest between', 'Off-season: 6×300m'],
        search: 'concept 2 rower form' },
    ],
  },
};

export const DAY_ORDER: DayKey[] = ['A', 'B', 'C', 'D'];

export function nextDay(prev: DayKey): DayKey {
  const i = DAY_ORDER.indexOf(prev);
  return DAY_ORDER[(i + 1) % DAY_ORDER.length];
}

export function getExercise(id: string): Exercise | undefined {
  for (const d of DAY_ORDER) {
    const e = WORKOUTS[d].exercises.find((x) => x.id === id);
    if (e) return e;
  }
  return undefined;
}
