export type DayKey = 'A' | 'B' | 'C';

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
    name: 'Chest + Triceps',
    color: '#5B8DEF',
    focus: 'Pressing strength and tricep volume.',
    duration: 50,
    exercises: [
      { id: 'tsys',     name: 'Warm-up: Ts + Ys',              target: '12 each',   sets: 1, unit: 'reps', xp: conditioning,
        cues: ['12 Ts, then 12 Ys', 'Light or no weight', 'Squeeze shoulder blades on every rep'],
        search: 'T Y raises warm up' },
      { id: 'dbbench',  name: 'DB Bench Press',                target: '4×8–12', sets: 4, unit: 'lb', xp: primary,
        cues: ['Set 1: easy 10–12 reps to get blood flowing', 'Sets 2–4: 8 reps', 'Last 2 sets should be a struggle'],
        search: 'dumbbell bench press form' },
      { id: 'bench',    name: 'Barbell Chest Press',           target: '4×8',       sets: 4, unit: 'lb',   xp: primary,
        cues: ["Don't bounce off the chest", 'Hold the bottom for a second', 'Drive through your feet'],
        search: 'paused barbell bench press' },
      { id: 'cabletri', name: 'Single-Arm Cable Tricep Ext.',  target: '3×15',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Superset with close-grip push-ups', 'Elbow pinned in place', 'Full lockout at the bottom'],
        search: 'single arm cable tricep extension' },
      { id: 'cgpushup', name: 'Close-Grip Push-ups',           target: '3×20',      sets: 3, unit: 'reps', xp: accessory,
        cues: ['Superset with cable tricep extensions', 'Hands under shoulders, elbows tight', 'Body in one straight line'],
        search: 'close grip push up' },
      { id: 'dbtri',    name: 'DB Tricep Extension',           target: '3×12',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Elbows point up, stay narrow', 'Lower behind the head under control', 'No arching the low back'],
        search: 'dumbbell overhead tricep extension' },
      { id: 'inclfly',  name: 'Incline DB Chest Flys',         target: '3×12',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Slight bend in elbows, keep it fixed', 'Stretch wide, squeeze together at the top', 'Go light, feel the chest'],
        search: 'incline dumbbell fly' },
    ],
  },
  B: {
    key: 'B',
    name: 'Back + Biceps',
    color: '#62B778',
    focus: 'Vertical and horizontal pulling, then bicep volume.',
    duration: 50,
    exercises: [
      { id: 'latpd',    name: 'Lat Pulldown (Overhand)',       target: '3×12',      sets: 3, unit: 'lb',   xp: primary,
        cues: ['Pull bar to upper chest', 'Drive elbows down to your sides', 'Control it back up'],
        search: 'lat pulldown form' },
      { id: 'pullup',   name: 'Underhand Pull-ups',            target: '3×max',     sets: 3, unit: 'reps', xp: primary,
        cues: ['Ribs down, pelvis tucked', 'Max effort each set', 'Full hang to chin over bar'],
        search: 'chin up proper form' },
      { id: 'vbarrow',  name: 'V-Bar Seated Row',              target: '3×12',      sets: 3, unit: 'lb',   xp: primary,
        cues: ['Chest tall, no rocking', 'Pull handle to your stomach', 'Squeeze shoulder blades together'],
        search: 'v bar seated cable row' },
      { id: 'dbcurl',   name: 'DB Bicep Curl',                 target: '3×10–12',   sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Superset with Pallof press', 'Elbows pinned at sides', 'No swinging'],
        search: 'dumbbell bicep curl form' },
      { id: 'pallof',   name: 'Cable Pallof Press',            target: '3×10 + 10s hold', sets: 3, unit: 'reps', xp: conditioning,
        cues: ['Superset with DB curls', '10 reps, then hold 10 seconds', "Don't let the cable rotate you"],
        search: 'pallof press cable' },
      { id: 'cablerow1',name: 'Standing 1-Arm Cable Row',      target: '3×12',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Superset with mini barbell curls', 'Staggered stance is fine', 'Pull elbow back to hip'],
        search: 'standing single arm cable row' },
      { id: 'minibb',   name: 'Mini Barbell Bicep Curl',       target: '3×12',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Superset with 1-arm cable rows', 'Control the lowering', 'Elbows stay still'],
        search: 'ez bar bicep curl' },
      { id: 'inclcurl', name: 'Incline DB Bicep Curl',         target: '3×10',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Bench at about 45°', 'Arms hang straight down behind you', 'Full stretch at the bottom'],
        search: 'incline dumbbell curl' },
    ],
  },
  C: {
    key: 'C',
    name: 'Shoulders',
    color: '#E8A24A',
    focus: 'Pressing, then side, front and rear delts.',
    duration: 45,
    exercises: [
      { id: 'machpress',name: 'Seated Shoulder Machine Press', target: '3×10',      sets: 3, unit: 'lb',   xp: primary,
        cues: ['Back flat against the pad', 'Press straight up', "Don't lock out hard"],
        search: 'seated shoulder press machine' },
      { id: 'hkpress',  name: 'Half-Kneeling DB Shoulder Press', target: '3×10',    sets: 3, unit: 'lb',   xp: primary,
        cues: ['Superset with plank', 'Lock ribs down', 'Slight forward lean'],
        search: 'half kneeling dumbbell shoulder press' },
      { id: 'plank',    name: 'Plank',                         target: '3×1 min',   sets: 3, unit: 'sec',  xp: conditioning,
        cues: ['Superset with half-kneeling press', 'Straight line head to heels', 'Squeeze glutes, brace core'],
        search: 'plank proper form' },
      { id: 'arnold',   name: 'Arnold Press',                  target: '3×10',      sets: 3, unit: 'lb',   xp: primary,
        cues: ['Start palms facing you', 'Rotate palms out as you press', 'Look up the form if unsure'],
        search: 'arnold press form' },
      { id: 'leanraise',name: 'Side-Leaning Cable Raise',      target: '3×12–15',   sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Hold the post and lean away', 'Lead with the elbow', 'Stop at shoulder height'],
        search: 'leaning cable lateral raise' },
      { id: 'frontraise',name: 'DB Front Raise',               target: '3×12',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Superset with rope face pulls', 'Raise to eye level', 'No swinging'],
        search: 'dumbbell front raise' },
      { id: 'facepull', name: 'Rope Face Pull',                target: '3×15',      sets: 3, unit: 'lb',   xp: accessory,
        cues: ['Superset with front raises', 'Pull rope toward your forehead', 'Split the rope, elbows high'],
        search: 'rope face pull form' },
    ],
  },
};

export const DAY_ORDER: DayKey[] = ['A', 'B', 'C'];

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
