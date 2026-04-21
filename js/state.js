/* ============ STATE / STORAGE ============ */
const STORAGE_KEY = "noah_workouts_v1";   // keep compatible with old file

let state = (function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.workouts)) return parsed;
    }
  } catch(e) {}
  return { workouts: [], currentWorkout: null };
})();

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e) { toast("Storage full — couldn't save", 'bad'); }
}

/* ============ DATE UTILS ============ */
function todayISO() {
  const d = new Date();
  // local date, YYYY-MM-DD
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function daysAgo(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.floor((now - d) / 86400000);
}
function formatDate(dateStr) {
  const diff = daysAgo(dateStr);
  if (diff === 0) return "TODAY";
  if (diff === 1) return "YESTERDAY";
  if (diff < 7)   return `${diff}D AGO`;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}
function formatWeekday() {
  const d = new Date();
  const wd = d.toLocaleDateString('en-US', { weekday: 'long' });
  const md = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { wd, md };
}

/* ============ ALLOWANCE LOGIC ============ */
function isWorkoutValid(w) {
  if (!w || !w.sets) return false;
  const def = WORKOUTS[w.dayKey];
  if (!def) return false;
  const completedCount = Object.values(w.sets).filter(ex =>
    Array.isArray(ex) && ex.some(s => s && (s.weight || s.reps))
  ).length;
  const required = Math.ceil(def.exercises.length / 2);
  return completedCount >= required;
}

function workoutsInLast8Days() {
  return state.workouts.filter(w => isWorkoutValid(w) && daysAgo(w.date) < 8);
}

function getCurrentWindowProgress() {
  const valid = workoutsInLast8Days();
  return { count: valid.length, target: 4, earned: valid.length >= 4, workouts: valid };
}

/* ============ RECOMMENDED NEXT DAY ============ */
// Rotate A→B→C→D, but if a day hasn't been done in 6+ days, prioritize it.
function recommendedDay() {
  // Find last valid workout
  const last = state.workouts
    .filter(isWorkoutValid)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)[0];

  // Neglected day (6+ days)?
  let neglected = null, maxGap = 0;
  for (const key of DAY_ORDER) {
    const lastOfKey = state.workouts
      .filter(w => w.dayKey === key && isWorkoutValid(w))
      .sort((a,b) => b.date.localeCompare(a.date))[0];
    const gap = lastOfKey ? daysAgo(lastOfKey.date) : 999;
    if (gap >= 6 && gap > maxGap) { maxGap = gap; neglected = key; }
  }
  if (neglected) return neglected;

  if (!last) return 'A';
  // Next in rotation
  const idx = DAY_ORDER.indexOf(last.dayKey);
  return DAY_ORDER[(idx + 1) % DAY_ORDER.length];
}

/* ============ PROGRESSION ============ */
// Suggest the next weight for a set based on last session's best set.
// Simple rule: if last session, Noah hit top of range on all sets → +5 lb.
// Otherwise repeat last weight.
function suggestNextFor(dayKey, exId) {
  const ex = WORKOUTS[dayKey].exercises.find(e => e.id === exId);
  if (!ex) return null;
  const prev = getPreviousData(dayKey, exId);
  if (!prev) return null;
  if (ex.unit !== 'lb') return null;
  const weight = parseFloat(prev.best.weight) || 0;
  if (!weight) return null;
  // Parse top of rep range from target like "4×5", "3×8", "4×10", "3×5-8"
  const m = ex.target.match(/×\s*(\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!m) return weight;
  const top = parseInt(m[2] || m[1]);
  const lastReps = parseFloat(prev.best.reps) || 0;
  const hitTop = prev.allHitTop; // computed below
  if (hitTop && weight > 0) return Math.round((weight + 5) / 2.5) * 2.5;
  return weight;
}

function getPreviousData(dayKey, exId) {
  const prev = state.workouts
    .filter(w => w.dayKey === dayKey && w.id !== state.currentWorkout && w.sets && w.sets[exId])
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!prev || !prev.sets[exId]) return null;
  const setsWithData = prev.sets[exId].filter(s => s && (s.weight || s.reps));
  if (setsWithData.length === 0) return null;
  const best = setsWithData.reduce((a, b) => {
    const aScore = (parseFloat(a.weight) || 0) * (parseFloat(a.reps) || 1);
    const bScore = (parseFloat(b.weight) || 0) * (parseFloat(b.reps) || 1);
    return bScore > aScore ? b : a;
  });
  const ex = WORKOUTS[dayKey].exercises.find(e => e.id === exId);
  const m = ex?.target.match(/×\s*(\d+)(?:\s*[–-]\s*(\d+))?/);
  const top = m ? parseInt(m[2] || m[1]) : 0;
  const allHitTop = top > 0 && setsWithData.every(s => (parseFloat(s.reps) || 0) >= top);
  return { best, date: prev.date, allHitTop };
}

/* ============ ACTIVITY GRID ============ */
function recentDayCells(days = 14) {
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const workout = state.workouts.find(w => w.date === iso && isWorkoutValid(w));
    cells.push({
      date: iso,
      isToday: i === 0,
      inWindow: i < 8,
      dayKey: workout ? workout.dayKey : null,
      wday: d.toLocaleDateString('en-US', { weekday: 'narrow' })
    });
  }
  return cells;
}

/* ============ TOAST ============ */
function toast(msg, variant = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + (variant === 'success' ? 'success' : '');
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => el.classList.remove('show'), 2400);
}
