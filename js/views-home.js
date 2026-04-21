/* ============ HOME VIEW ============ */
function renderHome() {
  const el = document.getElementById('view-home');
  const prog = getCurrentWindowProgress();
  const recDay = recommendedDay();
  const rec = WORKOUTS[recDay];
  const cells = recentDayCells(14);

  // Header date
  const { wd, md } = formatWeekday();
  document.getElementById('header-date').innerHTML = `<b>${wd.toUpperCase()}</b><br>${md.toUpperCase()}`;

  // Hero segments
  const segs = [];
  for (let i = 0; i < 4; i++) {
    const filled = i < prog.count;
    const today = prog.workouts.some(w => daysAgo(w.date) === 0) && i === prog.count - 1;
    segs.push(`<div class="hero-seg ${filled ? 'filled' : ''} ${today ? 'today' : ''}"></div>`);
  }

  let msg;
  if (prog.earned) {
    msg = `<b>Allowance earned.</b> ${prog.count} workouts banked in the last 8 days. Keep stacking — every extra session compounds.`;
  } else if (prog.count === 0) {
    msg = `Target: <b>4 workouts in 8 days</b>. Start today. Your next session is <b>Day ${recDay} — ${rec.name}</b>.`;
  } else {
    const oldestAge = Math.max(...prog.workouts.map(w => daysAgo(w.date)));
    const daysLeft = 8 - oldestAge;
    const need = 4 - prog.count;
    msg = `<b>${need} more to earn this window.</b> Oldest counted session drops off in <b>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</b>.`;
  }

  // Hero
  const heroHtml = `
    <div class="hero ${prog.earned ? 'earned' : ''}">
      <div class="hero-top">
        <div class="hero-status">${prog.earned ? 'ALLOWANCE EARNED' : 'IN PROGRESS'}</div>
        <div class="hero-window">8-DAY WINDOW · W${currentWeekNum()}</div>
      </div>
      <div class="hero-count">
        <div class="num t-tnum">${prog.count}</div>
        <div class="frac">/ 4</div>
        <div class="tag">WORKOUTS<br><b>LOGGED</b></div>
      </div>
      <div class="hero-bar">${segs.join('')}</div>
      <div class="hero-msg">${msg}</div>
    </div>`;

  // Today's pick
  const pickHtml = `
    <div class="pick-row" style="margin-top: 14px;">
      <div class="pick-primary">
        <div class="pick-stripe" style="background: ${rec.color}"></div>
        <div>
          <div class="pick-label">NEXT UP · RECOMMENDED</div>
          <div class="pick-name">Day ${recDay} — ${rec.name}</div>
          <div class="pick-sub">${rec.focus} · ~${rec.duration} min</div>
        </div>
        <button class="pick-start" onclick="startWorkout('${recDay}')">
          START
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>`;

  // Day matrix
  const daysHtml = DAY_ORDER.map(key => {
    const w = WORKOUTS[key];
    const lastWorkout = state.workouts
      .filter(wk => wk.dayKey === key && isWorkoutValid(wk))
      .sort((a,b) => b.date.localeCompare(a.date))[0];
    const lastStr = lastWorkout ? formatDate(lastWorkout.date) : 'NEVER';
    const isRecent = lastWorkout && daysAgo(lastWorkout.date) < 4;
    const isRec = key === recDay;
    return `
      <button class="day-tile ${isRec ? 'recommended' : ''}" data-day="${key}" onclick="startWorkout('${key}')">
        <div>
          <div class="day-key"><span class="d">DAY</span><span style="color:${w.color}">${key}</span></div>
        </div>
        <div>
          <div class="day-name">${w.name}</div>
          <div class="day-tag">${w.duration} min · ${w.exercises.length} lifts</div>
        </div>
        <div class="day-last ${isRecent ? 'recent' : ''}">
          <span class="day-dot" style="${isRecent ? 'background:'+w.color : ''}"></span>
          LAST · <b>${lastStr}</b>
        </div>
      </button>`;
  }).join('');

  // Activity strip
  const stripHtml = `
    <div class="strip-card">
      <div class="strip-head">
        <div class="strip-title">14-DAY ACTIVITY</div>
        <div class="strip-sub">${cells.filter(c => c.dayKey).length} SESSIONS</div>
      </div>
      <div class="strip-grid">
        ${cells.map(c => `
          <div class="strip-cell ${c.dayKey ? 'has-workout' : ''} ${c.isToday ? 'today' : ''} ${!c.inWindow ? 'out-of-window' : ''}"
               style="${c.dayKey ? 'background:' + WORKOUTS[c.dayKey].color : ''}"
               title="${c.date} ${c.dayKey || ''}"></div>
        `).join('')}
      </div>
      <div class="strip-legend">
        <span><span class="dot" style="background:var(--accent)"></span>LOGGED</span>
        <span><span class="dot" style="background:var(--surface-2)"></span>REST / MISS</span>
        <span><span class="dot" style="outline:1.5px solid var(--ink);background:var(--surface-2)"></span>TODAY</span>
      </div>
    </div>`;

  // Recent list
  const recent = state.workouts
    .filter(isWorkoutValid)
    .sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 5);
  const recentHtml = recent.length === 0
    ? `<div class="list-card"><div class="list-empty">No sessions logged yet.<br>Pick a day above and get to work.</div></div>`
    : `<div class="list-card">${recent.map(w => {
        const ws = WORKOUTS[w.dayKey];
        const totalSets = Object.values(w.sets).flat().filter(s => s && (s.weight || s.reps)).length;
        return `<div class="list-row">
          <div class="list-badge" style="color:${ws.color}">${w.dayKey}</div>
          <div>
            <div class="list-name">Day ${w.dayKey} — ${ws.name}</div>
            <div class="list-meta">${formatDate(w.date)} · ${totalSets} SETS LOGGED</div>
          </div>
          <div class="list-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>`;
      }).join('')}</div>`;

  el.innerHTML = `
    ${heroHtml}
    ${pickHtml}
    <div class="eyebrow"><h2>The Split</h2><div class="eyebrow-meta">A · B · C · D</div></div>
    <div class="day-grid">${daysHtml}</div>
    <div class="eyebrow"><h2>Activity</h2><div class="eyebrow-meta">14 DAYS</div></div>
    ${stripHtml}
    <div class="eyebrow"><h2>Recent</h2><a class="eyebrow-link" onclick="showView('history')">SEE ALL</a></div>
    ${recentHtml}
    <div style="height:20px"></div>
  `;
}

function currentWeekNum() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now - start) / 86400000;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}
