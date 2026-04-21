/* ============ HISTORY / LOG VIEW ============ */
function renderHistory() {
  const el = document.getElementById('view-history');
  const valid = state.workouts.filter(isWorkoutValid);

  // 8-day windows rolling back — but render as 7-day "weeks" for simpler UX
  const weeks = [];
  for (let i = 0; i < 8; i++) {
    const end = new Date();
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const endISO = end.toISOString().split('T')[0];
    const startISO = start.toISOString().split('T')[0];
    const weekWorkouts = valid.filter(w => w.date >= startISO && w.date <= endISO);
    weeks.push({ start: startISO, end: endISO, workouts: weekWorkouts, isCurrent: i === 0 });
  }

  const weeksHtml = weeks.map((wk, idx) => {
    const count = wk.workouts.length;
    const earned = count >= 4;
    const statusClass = earned ? 'earned' : (wk.isCurrent ? 'current' : '');
    const label = wk.isCurrent ? 'This week' :
      `${new Date(wk.start+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${new Date(wk.end+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
    const sub = earned ? `${count} SESSIONS · ALLOWANCE EARNED` :
      wk.isCurrent ? `${count} OF 4 · ${4 - count} TO GO` :
      `${count} OF 4 · MISSED`;

    const pipsHtml = Array.from({length:4}, (_, i) => `<div class="week-pip ${i < count ? 'filled' : ''}"></div>`).join('');

    return `<div class="week-row">
      <div class="week-num ${statusClass}">${earned ? '✓' : count}</div>
      <div>
        <div class="week-label">${label}</div>
        <div class="week-sub">${sub}</div>
      </div>
      <div class="week-pips">${pipsHtml}</div>
    </div>`;
  }).join('');

  const sorted = [...valid].sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id);
  const histHtml = sorted.length === 0
    ? `<div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>No sessions logged yet.</p>
      </div>`
    : sorted.map(w => {
        const ws = WORKOUTS[w.dayKey];
        const totalSets = Object.values(w.sets).flat().filter(s => s && (s.weight || s.reps)).length;
        return `<div class="hist-row">
          <div class="list-badge" style="color:${ws.color}">${w.dayKey}</div>
          <div>
            <div class="list-name">Day ${w.dayKey} — ${ws.name}</div>
            <div class="list-meta">${formatDate(w.date)} · ${totalSets} SETS</div>
          </div>
          <div class="list-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <button class="hist-del" data-id="${w.id}" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>`;
      }).join('');

  el.innerHTML = `
    <div class="eyebrow" style="margin-top:14px"><h2>Allowance Weeks</h2><div class="eyebrow-meta">ROLLING 7D</div></div>
    ${weeksHtml}
    <div class="eyebrow"><h2>All Sessions</h2><div class="eyebrow-meta t-tnum">${sorted.length} LOGGED</div></div>
    ${histHtml}
    <div style="height:20px"></div>
  `;

  el.querySelectorAll('.hist-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(e.currentTarget.dataset.id);
      if (confirm('Delete this session? This can\'t be undone.')) {
        state.workouts = state.workouts.filter(w => w.id !== id);
        saveState();
        renderHistory();
      }
    });
  });
}
