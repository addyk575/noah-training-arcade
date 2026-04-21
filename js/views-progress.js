/* ============ PROGRESS / STATS VIEW ============ */
function renderProgress() {
  const el = document.getElementById('view-progress');

  const valid = state.workouts.filter(isWorkoutValid);
  const totalSessions = valid.length;
  const totalSets = valid.reduce((sum, w) =>
    sum + Object.values(w.sets).flat().filter(s => s && (s.weight || s.reps)).length, 0);

  // Gather PR data
  const exercisePRs = {};
  valid.forEach(w => {
    Object.entries(w.sets).forEach(([exId, sets]) => {
      sets.forEach(s => {
        if (s && (s.weight || s.reps)) {
          if (!exercisePRs[exId]) exercisePRs[exId] = [];
          const weight = parseFloat(s.weight) || 0;
          const reps = parseFloat(s.reps) || 0;
          const score = weight > 0 ? weight * (1 + reps/30) : reps;  // epley-like
          exercisePRs[exId].push({ date: w.date, weight, reps, score });
        }
      });
    });
  });

  const findExercise = (id) => {
    for (const dayKey in WORKOUTS) {
      const ex = WORKOUTS[dayKey].exercises.find(e => e.id === id);
      if (ex) return { ex, dayKey };
    }
    return null;
  };

  // Longest streak calculation (consecutive days with a workout, counting A/B/C/D rotation)
  const workoutDates = [...new Set(valid.map(w => w.date))].sort();

  // Build hero stats
  const heroHtml = `
    <div class="p-hero">
      <div class="p-stat">
        <div class="l">SESSIONS</div>
        <div class="v t-tnum">${totalSessions}</div>
        <div class="s">ALL TIME</div>
      </div>
      <div class="p-stat">
        <div class="l">SETS LOGGED</div>
        <div class="v t-tnum">${totalSets}</div>
        <div class="s">BARS MOVED</div>
      </div>
    </div>`;

  const cards = Object.entries(exercisePRs)
    .filter(([id, data]) => data.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([id, data]) => {
      const info = findExercise(id);
      if (!info) return '';
      const maxScore = Math.max(...data.map(d => d.score));
      const bestSet = data.find(d => d.score === maxScore);

      const displayVal = bestSet.weight > 0
        ? `${bestSet.weight}${info.ex.unit === 'lb' ? '×' : ''}${bestSet.reps ? bestSet.reps : ''}`
        : `${bestSet.reps || 0}`;

      const bySession = {};
      data.forEach(d => {
        if (!bySession[d.date] || bySession[d.date].score < d.score) bySession[d.date] = d;
      });
      const sessions = Object.values(bySession).sort((a,b) => a.date.localeCompare(b.date)).slice(-10);
      const latestDate = sessions.length ? sessions[sessions.length-1].date : null;
      const barsHtml = sessions.map(s => {
        const h = (s.score / maxScore) * 100;
        const isLatest = s.date === latestDate;
        return `<div class="pr-bar ${isLatest ? 'latest' : ''}" style="height: ${h}%"></div>`;
      }).join('');

      return `<div class="pr-card">
        <div class="pr-head">
          <div>
            <div class="pr-name">${info.ex.name}</div>
            <div class="pr-tag">DAY ${info.dayKey} · ${sessions.length} SESSION${sessions.length !== 1 ? 'S' : ''}</div>
          </div>
          <div class="pr-best">
            <div class="v t-tnum">${displayVal}${info.ex.unit === 'lb' ? ' lb' : ''}</div>
            <div class="l">BEST</div>
          </div>
        </div>
        <div class="pr-chart">${barsHtml}</div>
      </div>`;
    }).join('');

  el.innerHTML = `
    <div class="eyebrow" style="margin-top:14px"><h2>All Time</h2></div>
    ${heroHtml}
    <div style="display:flex;gap:8px;margin:0 16px 12px;">
      <button class="share-btn accent" style="flex:1;justify-content:center;" onclick="shareWeeklyReport()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M16 2v4M8 2v4"/></svg>
        SEND WEEKLY REPORT
      </button>
      <button class="share-btn" style="flex:1;justify-content:center;" onclick="shareLastSession()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        LAST SESSION
      </button>
    </div>
    <div class="eyebrow"><h2>Personal Records</h2><div class="eyebrow-meta">BY LIFT</div></div>
    ${cards || `<div class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 20V8M9 20V4M15 20v-9M21 20v-6"/></svg>
      <p>No PRs yet.<br>Log sessions and they'll appear here.</p>
    </div>`}
    <div style="height:20px"></div>
  `;
}
