/* ============ WORKOUT DETAIL ============ */
let workoutTimerStart = null;
let workoutTimerInterval = null;

function startWorkout(dayKey) {
  const today = todayISO();
  let existing = state.workouts.find(w => w.dayKey === dayKey && w.date === today);
  if (!existing) {
    existing = { id: Date.now(), dayKey, date: today, sets: {} };
    WORKOUTS[dayKey].exercises.forEach(ex => {
      existing.sets[ex.id] = Array(ex.sets).fill(null).map(() => ({ weight: '', reps: '', done: false }));
    });
    state.workouts.push(existing);
    saveState();
  }
  state.currentWorkout = existing.id;
  workoutTimerStart = Date.now();
  startTimerLoop();
  renderWorkout();
  document.querySelectorAll('.view, .w-detail').forEach(v => v.classList.remove('active'));
  document.getElementById('view-workout').classList.add('active');
  window.scrollTo(0, 0);
}

function startTimerLoop() {
  clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(() => {
    const el = document.getElementById('w-timer-val');
    if (!el || !workoutTimerStart) return;
    const s = Math.floor((Date.now() - workoutTimerStart) / 1000);
    const m = Math.floor(s / 60);
    el.textContent = `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  }, 1000);
}

function renderWorkout() {
  const workout = state.workouts.find(w => w.id === state.currentWorkout);
  if (!workout) return showView('home');
  const w = WORKOUTS[workout.dayKey];
  const el = document.getElementById('view-workout');

  const completedSets = Object.values(workout.sets).flat().filter(s => s && s.done).length;
  const totalSets = Object.values(workout.sets).flat().length;
  const loggedSets = Object.values(workout.sets).flat().filter(s => s && (s.weight || s.reps)).length;

  const exercisesHtml = w.exercises.map((ex, idx) => {
    const sets = workout.sets[ex.id] || [];
    const prev = getPreviousData(workout.dayKey, ex.id);
    const suggest = suggestNextFor(workout.dayKey, ex.id);
    const allDone = sets.every(s => s && s.done);

    let prevText;
    if (prev) {
      const wStr = prev.best.weight ? `${prev.best.weight}${ex.unit === 'lb' ? ' lb' : ''} × ` : '';
      const rStr = `${prev.best.reps || '–'}${ex.unit !== 'lb' ? ' ' + ex.unit : ''}`;
      prevText = `<div class="ex-prev">LAST: <b>${wStr}${rStr}</b> · ${formatDate(prev.date)}${prev.allHitTop ? ' · +5' : ''}</div>`;
    } else {
      prevText = `<div class="ex-prev first">FIRST TIME · LOG A BASELINE</div>`;
    }

    const setsHtml = sets.map((set, i) => {
      const weightPh = suggest && !set.weight ? String(suggest) : (ex.unit === 'lb' ? '—' : '0');
      const weightSuggest = suggest && !set.weight;
      return `
        <div class="set-row">
          <div class="set-num">${i + 1}</div>
          <input type="text" inputmode="decimal" class="set-input ${set.done ? 'done' : ''} ${weightSuggest ? 'suggest' : ''}"
                 placeholder="${weightPh}" value="${set.weight || ''}"
                 data-ex="${ex.id}" data-set="${i}" data-field="weight">
          <input type="text" inputmode="decimal" class="set-input ${set.done ? 'done' : ''}"
                 placeholder="0" value="${set.reps || ''}"
                 data-ex="${ex.id}" data-set="${i}" data-field="reps">
          <button class="set-check ${set.done ? 'done' : ''}" data-ex="${ex.id}" data-set="${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>`;
    }).join('');

    const weightColLabel = ex.unit === 'lb' ? 'WEIGHT' : ex.unit.toUpperCase();
    const repsColLabel = ex.unit === 'lb' ? 'REPS' : 'SETS';

    return `<div class="ex-card ${allDone ? 'done' : ''}" data-exid="${ex.id}">
      <div class="ex-head">
        <div class="ex-index">${String(idx+1).padStart(2,'0')}</div>
        ${exImg(ex.id, 'ex-img')}
        <div class="ex-name">${ex.name}</div>
        <div class="ex-target">${ex.target}</div>
      </div>
      <div class="ex-sub">
        ${prevText}
        <a class="ex-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.search + ' tutorial')}" target="_blank">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
          FORM
        </a>
        <span class="ex-cues-toggle" onclick="this.closest('.ex-card').classList.toggle('show-cues')">CUES ▾</span>
      </div>
      <div class="ex-cues">${ex.cues.map(c => `• ${c}`).join('<br>')}</div>
      <div class="set-table">
        <div class="set-row header">
          <div>SET</div>
          <div>${weightColLabel}</div>
          <div>${repsColLabel}</div>
          <div></div>
        </div>
        ${setsHtml}
      </div>
    </div>`;
  }).join('');

  const valid = isWorkoutValid(workout);

  el.innerHTML = `
    <div class="w-topbar">
      <button class="w-back" onclick="exitWorkout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        BACK
      </button>
      <div class="w-timer"><span id="w-timer-val">00:00</span></div>
    </div>

    <div class="w-hero">
      <div class="w-hero-stripe" style="background: ${w.color}"></div>
      <div class="w-hero-top">
        <div>
          <div class="w-hero-key">DAY ${workout.dayKey} / ${w.name.toUpperCase()}</div>
          <div class="w-hero-name">${w.name}</div>
          <div class="w-hero-focus">${w.focus}</div>
        </div>
      </div>
      <div class="w-hero-meta">
        <div>
          <div class="n t-tnum">${w.exercises.length}</div>
          <div class="l">LIFTS</div>
        </div>
        <div>
          <div class="n t-tnum">${completedSets}<span style="color:var(--ink-mute);font-size:13px;font-weight:500">/${totalSets}</span></div>
          <div class="l">SETS DONE</div>
        </div>
        <div>
          <div class="n t-tnum">~${w.duration}</div>
          <div class="l">MINUTES</div>
        </div>
      </div>
    </div>

    ${exercisesHtml}

    <div class="w-finish">
      <button class="w-finish-btn" id="finish-btn" ${loggedSets === 0 ? 'disabled' : ''}>
        ${valid ? 'FINISH SESSION' : 'FINISH EARLY'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
      <button class="share-btn accent" style="margin-top:10px;width:100%;justify-content:center;" onclick="shareCurrentSession()" ${loggedSets === 0 ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        SEND SESSION TO DAD
      </button>
      <div class="w-finish-note">
        AUTO-SAVES AS YOU LOG · ${valid ? 'COUNTS TOWARD ALLOWANCE' : 'NEEDS MORE SETS TO COUNT'}
      </div>
    </div>
    <div style="height:20px"></div>
  `;

  // Wire inputs
  el.querySelectorAll('.set-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const { ex, set, field } = e.target.dataset;
      const workout = state.workouts.find(w => w.id === state.currentWorkout);
      workout.sets[ex][set][field] = e.target.value;
      e.target.classList.remove('suggest');
      saveState();
    });
    input.addEventListener('focus', (e) => {
      // If showing suggestion, clear the styling so it looks editable
      if (e.target.classList.contains('suggest')) {
        e.target.classList.remove('suggest');
      }
    });
  });

  el.querySelectorAll('.set-check').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      const { ex, set } = b.dataset;
      const workout = state.workouts.find(w => w.id === state.currentWorkout);
      const setData = workout.sets[ex][set];
      // If suggestion is showing and user checks, auto-fill weight
      const row = b.parentElement;
      const wInput = row.querySelector('[data-field="weight"]');
      const rInput = row.querySelector('[data-field="reps"]');
      if (!setData.done) {
        if (wInput.classList.contains('suggest') && !setData.weight) {
          setData.weight = wInput.placeholder;
          wInput.value = setData.weight;
          wInput.classList.remove('suggest');
        }
      }
      setData.done = !setData.done;
      saveState();
      b.classList.toggle('done', setData.done);
      wInput.classList.toggle('done', setData.done);
      rInput.classList.toggle('done', setData.done);
      // Update done card state
      const card = b.closest('.ex-card');
      const allSets = card.querySelectorAll('.set-check');
      const allDone = [...allSets].every(s => s.classList.contains('done'));
      card.classList.toggle('done', allDone);
      // Update session counter in hero
      updateSessionMeta();
    });
  });

  document.getElementById('finish-btn').addEventListener('click', finishWorkout);
}

function updateSessionMeta() {
  const workout = state.workouts.find(w => w.id === state.currentWorkout);
  if (!workout) return;
  const completedSets = Object.values(workout.sets).flat().filter(s => s && s.done).length;
  const totalSets = Object.values(workout.sets).flat().length;
  const loggedSets = Object.values(workout.sets).flat().filter(s => s && (s.weight || s.reps)).length;
  const metaN = document.querySelectorAll('.w-hero-meta .n')[1];
  if (metaN) metaN.innerHTML = `${completedSets}<span style="color:var(--ink-mute);font-size:13px;font-weight:500">/${totalSets}</span>`;
  const finishBtn = document.getElementById('finish-btn');
  if (finishBtn) finishBtn.disabled = loggedSets === 0;
}

function exitWorkout() {
  clearInterval(workoutTimerInterval);
  state.currentWorkout = null;
  saveState();
  showView('home');
}

function finishWorkout() {
  const workout = state.workouts.find(w => w.id === state.currentWorkout);
  if (!workout) return showView('home');
  clearInterval(workoutTimerInterval);

  if (isWorkoutValid(workout)) {
    const prog = getCurrentWindowProgress();
    if (prog.earned) toast(`Session banked. ${prog.count} / 4 — allowance earned 🔒`, 'success');
    else toast(`Session banked. ${prog.count} / 4 this window.`, 'success');
  } else {
    toast("Logged, but not enough sets to count yet.");
  }
  state.currentWorkout = null;
  saveState();
  showView('home');
}
