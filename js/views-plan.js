/* ============ PLAN VIEW ============ */
function renderPlan() {
  const el = document.getElementById('view-plan');
  const phaseRows = PLAN_COPY.phases.map(p => `
    <tr>
      <td>WK ${p.wk}</td>
      <td><b>${p.name}</b><br><span style="color:var(--ink-mute)">${p.sets}</span></td>
      <td>${p.reps}<br><span style="color:var(--ink-mute)">${p.load}</span></td>
    </tr>
  `).join('');

  const whyList = PLAN_COPY.why.map(w => `
    <li><b>${w.h}.</b> ${w.p}</li>
  `).join('');

  const rulesList = PLAN_COPY.rules.map(r => `
    <li><b>${r.h}.</b> ${r.p}</li>
  `).join('');

  const splitRows = DAY_ORDER.map(key => {
    const w = WORKOUTS[key];
    return `
      <div style="display:grid; grid-template-columns: 36px 1fr auto; gap:12px; align-items:center; padding:12px 0; border-top:1px solid var(--line-soft);">
        <div style="font-family:var(--font-display); font-weight:900; font-size:22px; color:${w.color}; letter-spacing:-0.04em; line-height:1">${key}</div>
        <div>
          <div style="font-family:var(--font-display); font-weight:700; font-size:14px">${w.name}</div>
          <div style="font-family:var(--font-mono); font-size:10px; color:var(--ink-mute); margin-top:3px; letter-spacing:0.04em">${w.exercises.length} LIFTS · ${w.duration} MIN</div>
        </div>
        <button onclick="startWorkout('${key}')" style="font-family:var(--font-display);font-size:10px;font-weight:700;letter-spacing:0.12em;color:var(--accent);padding:6px 10px;border:1px solid var(--accent-line);border-radius:6px">START</button>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="plan-hero">
      <h1>Train like<br>you mean it.</h1>
      <p class="lead">
        Basketball year-round, football in fall. This plan is built for <b>power, speed, and durability</b> — not just size. <b>4 sessions a week</b>, <b>45 minutes each</b>. Heavy enough to move the needle, short enough to still hoop.
      </p>
      <div class="plan-stats">
        <div class="plan-stat"><div class="l">DAYS / WK</div><div class="v t-tnum">4</div></div>
        <div class="plan-stat"><div class="l">MIN / SESSION</div><div class="v t-tnum">45</div></div>
        <div class="plan-stat"><div class="l">CYCLE</div><div class="v t-tnum">12W</div></div>
      </div>
    </div>

    <div class="plan-section">
      <div class="eyebrow"><h2>Mission</h2></div>
      <div class="plan-block">
        <h3>${PLAN_COPY.mission.title}</h3>
        <p>${PLAN_COPY.mission.body}</p>
      </div>
    </div>

    <div class="plan-section">
      <div class="eyebrow"><h2>The Split</h2><div class="eyebrow-meta">A · B · C · D</div></div>
      <div class="plan-block" style="padding-top:6px; padding-bottom:8px;">
        ${splitRows}
      </div>
    </div>

    <div class="plan-section">
      <div class="eyebrow"><h2>Progression</h2><div class="eyebrow-meta">12 WEEKS</div></div>
      <div class="plan-block">
        <h3>Four phases <span class="pill">AUTO-ROTATE</span></h3>
        <p>The reps and weights shift every 4 weeks. You don't have to memorize this — the app suggests your next weight based on last session. Just keep logging.</p>
        <table class="phase-table">
          <thead><tr><th>PHASE</th><th>FOCUS</th><th>REPS / LOAD</th></tr></thead>
          <tbody>${phaseRows}</tbody>
        </table>
      </div>
    </div>

    <div class="plan-section">
      <div class="eyebrow"><h2>Why It's Built This Way</h2></div>
      <div class="plan-block">
        <ul>${whyList}</ul>
      </div>
    </div>

    <div class="plan-section">
      <div class="eyebrow"><h2>The Allowance</h2><div class="eyebrow-meta">8-DAY WINDOW</div></div>
      <div class="plan-block">
        <h3>${PLAN_COPY.allowance.h}</h3>
        <p>${PLAN_COPY.allowance.p}</p>
      </div>
    </div>

    <div class="plan-section">
      <div class="eyebrow"><h2>Non-negotiables</h2></div>
      <div class="plan-block">
        <ul>${rulesList}</ul>
      </div>
    </div>

    <div style="height:30px"></div>
  `;
}
