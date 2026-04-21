/* ============ SHARE / EXPORT TO COACH ============
   Builds a clean text summary of a session (or last 7 days) and
   opens the user's default messaging app prefilled to the coach.

   Contact is stored in TWEAKS (persisted via edit mode) so it survives
   file handoff. On iOS an "sms:" URL opens Messages; "mailto:" opens Mail.
*/

function coachContact() {
  const raw = (TWEAKS.coach || '').trim();
  if (!raw) return null;
  // crude shape detection
  if (raw.includes('@')) return { kind: 'email', value: raw };
  // phone: strip formatting
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.length >= 7) return { kind: 'sms', value: cleaned };
  return { kind: 'email', value: raw }; // fallback
}

function setCoachContact(v) {
  TWEAKS.coach = v || '';
  persistTweaks();
}

/* ---------- session formatter ---------- */
function formatSessionSummary(workout) {
  const w = WORKOUTS[workout.dayKey];
  const d = new Date(workout.date + 'T00:00:00');
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const header = `Noah — Day ${workout.dayKey} / ${w.name} — ${dateStr}`;

  const lines = [header, ''];

  w.exercises.forEach(ex => {
    const sets = (workout.sets[ex.id] || []).filter(s => s && (s.weight || s.reps));
    if (sets.length === 0) return;
    const prev = getPreviousData ? getPreviousData(workout.dayKey, ex.id) : null;
    const setStr = sets.map(s => {
      if (ex.unit === 'lb') {
        return `${s.weight || '—'}×${s.reps || '—'}`;
      }
      return `${s.reps || '—'}${ex.unit === 'lb' ? '' : ' ' + ex.unit}`;
    }).join(', ');

    // PR flag: is this session's best > all prior bests for this exercise?
    const prFlag = computePR(workout, ex.id) ? '  ✨ PR' : '';
    lines.push(`${ex.name}: ${setStr}${prFlag}`);
  });

  // Allowance status
  const prog = getCurrentWindowProgress();
  lines.push('');
  lines.push(`Allowance: ${prog.count}/4 in last 8 days${prog.earned ? ' — EARNED 🔒' : ''}`);

  return lines.join('\n');
}

function computePR(workout, exId) {
  const sets = (workout.sets[exId] || []).filter(s => s && (s.weight || s.reps));
  if (sets.length === 0) return false;
  const ex = Object.values(WORKOUTS).flatMap(w => w.exercises).find(e => e.id === exId);
  if (!ex) return false;
  const score = s => {
    const w = parseFloat(s.weight) || 0;
    const r = parseFloat(s.reps) || 0;
    return w > 0 ? w * (1 + r/30) : r;
  };
  const thisBest = Math.max(...sets.map(score));
  const priorScores = state.workouts
    .filter(w => w.id !== workout.id && w.sets[exId])
    .flatMap(w => w.sets[exId])
    .filter(s => s && (s.weight || s.reps))
    .map(score);
  if (priorScores.length === 0) return true; // first time logging = baseline, not a PR
  const priorBest = Math.max(...priorScores);
  return thisBest > priorBest;
}

/* ---------- weekly summary ---------- */
function formatWeeklySummary() {
  const valid = state.workouts
    .filter(isWorkoutValid)
    .filter(w => daysAgo(w.date) < 7)
    .sort((a, b) => a.date.localeCompare(b.date));

  const today = new Date();
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - 6);
  const label = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  const lines = [`Noah — Weekly Report — ${label}`, ''];

  if (valid.length === 0) {
    lines.push('No sessions logged this week.');
  } else {
    valid.forEach(w => {
      const def = WORKOUTS[w.dayKey];
      const d = new Date(w.date + 'T00:00:00');
      const day = d.toLocaleDateString('en-US', { weekday: 'short' });
      const setCount = Object.values(w.sets).flat().filter(s => s && (s.weight || s.reps)).length;
      const prs = def.exercises.filter(ex => computePR(w, ex.id)).map(e => e.name);
      const prStr = prs.length ? `  ✨ ${prs.join(', ')}` : '';
      lines.push(`${day} — Day ${w.dayKey} / ${def.name} · ${setCount} sets${prStr}`);
    });
  }

  const prog = getCurrentWindowProgress();
  lines.push('');
  lines.push(`Allowance: ${prog.count}/4 in last 8 days${prog.earned ? ' — EARNED 🔒' : ''}`);

  return lines.join('\n');
}

/* ---------- sender ---------- */
async function sendToCoach(body, subjectHint = 'Noah Training') {
  const contact = coachContact();
  // Always copy to clipboard as fallback
  try { await navigator.clipboard.writeText(body); } catch(e) {}

  if (!contact) {
    // Show modal asking for contact + show copied-to-clipboard notice
    openCoachSetup(body);
    return;
  }

  let url;
  if (contact.kind === 'sms') {
    // iOS uses &body=, Android uses ?body=. Use ?body= with semicolon for iOS compat.
    const encoded = encodeURIComponent(body);
    url = `sms:${contact.value}${/iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?'}body=${encoded}`;
  } else {
    url = `mailto:${contact.value}?subject=${encodeURIComponent(subjectHint)}&body=${encodeURIComponent(body)}`;
  }
  // Open in same tab — works best for iOS to hand off to Messages
  window.location.href = url;
  toast('Opening Messages… (copy also on clipboard)', 'success');
}

function openCoachSetup(pendingBody) {
  const existing = document.getElementById('coach-modal');
  if (existing) existing.remove();
  const m = document.createElement('div');
  m.id = 'coach-modal';
  m.className = 'modal-overlay';
  m.innerHTML = `
    <div class="modal">
      <div class="modal-title">Set coach contact</div>
      <div class="modal-sub">Enter Dad's phone number or email. Saved on this device.</div>
      <input id="coach-input" class="modal-input" type="text" placeholder="+1 555 123 4567 or dad@email.com" autofocus>
      <div class="modal-actions">
        <button class="modal-btn ghost" onclick="document.getElementById('coach-modal').remove()">CANCEL</button>
        <button class="modal-btn primary" id="coach-save">SAVE &amp; SEND</button>
      </div>
      <div class="modal-note">Your session has been copied to the clipboard, so you can paste it anywhere.</div>
    </div>`;
  document.body.appendChild(m);
  const input = m.querySelector('#coach-input');
  input.value = TWEAKS.coach || '';
  m.querySelector('#coach-save').addEventListener('click', () => {
    const v = input.value.trim();
    if (!v) { input.focus(); return; }
    setCoachContact(v);
    m.remove();
    sendToCoach(pendingBody);
  });
  m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
}

/* ---------- backup export ---------- */
function downloadBackup() {
  try {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      key: 'noah_workouts_v1',
      data: state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const ymd = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    a.href = url;
    a.download = `noah-backup-${ymd}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    return true;
  } catch(e) {
    return false;
  }
}

/* ---------- public entry points ---------- */
function shareCurrentSession() {
  const workout = state.workouts.find(w => w.id === state.currentWorkout);
  if (!workout) return;
  downloadBackup();
  sendToCoach(formatSessionSummary(workout), `Noah Session — Day ${workout.dayKey}`);
}

function shareLastSession() {
  const last = [...state.workouts].filter(isWorkoutValid)
    .sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id)[0];
  if (!last) { toast('No sessions to share yet'); return; }
  downloadBackup();
  sendToCoach(formatSessionSummary(last), `Noah Session — Day ${last.dayKey}`);
}

function shareWeeklyReport() {
  downloadBackup();
  sendToCoach(formatWeeklySummary(), 'Noah Weekly Report');
}
