/* ============ GUIDE / FORM VIEW ============ */
function renderGuide() {
  const el = document.getElementById('view-guide');
  el.innerHTML = `
    <div class="eyebrow" style="margin-top:14px"><h2>Form Library</h2><div class="eyebrow-meta">BY DAY</div></div>
    ${DAY_ORDER.map(key => {
      const w = WORKOUTS[key];
      return `
        <div class="guide-day-head">
          <div class="guide-stripe" style="background:${w.color}"></div>
          <div>
            <div class="guide-day-key">DAY ${key}</div>
            <div class="guide-day-name">${w.name}</div>
          </div>
        </div>
        ${w.exercises.map((ex, idx) => `
          <div class="ex-card">
            <div class="ex-head">
              <div class="ex-index">${String(idx+1).padStart(2,'0')}</div>
              ${exImg(ex.id, 'guide-img')}
              <div class="ex-name">${ex.name}</div>
              <div class="ex-target">${ex.target}</div>
            </div>
            <div class="ex-sub" style="padding-left:136px">
              <a class="ex-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.search + ' tutorial')}" target="_blank">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
                WATCH FORM
              </a>
            </div>
            <div class="ex-cues" style="display:block; margin-left:136px;">
              ${ex.cues.map(c => `• ${c}`).join('<br>')}
            </div>
          </div>
        `).join('')}
      `;
    }).join('')}
    <div style="height:30px"></div>
  `;
}
