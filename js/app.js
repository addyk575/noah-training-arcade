/* ============ APP / ROUTING ============ */
function showView(name) {
  document.querySelectorAll('.view, .w-detail').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const view = document.getElementById(`view-${name}`);
  if (view) view.classList.add('active');
  const tab = document.querySelector(`.tab[data-view="${name}"]`);
  if (tab) tab.classList.add('active');
  window.scrollTo(0, 0);

  if (name === 'home')     renderHome();
  if (name === 'plan')     renderPlan();
  if (name === 'progress') renderProgress();
  if (name === 'history')  renderHistory();
  if (name === 'guide')    renderGuide();
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => showView(tab.dataset.view));
});

// Prevent accidental zoom on double-tap
let lastTap = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault());

// Init
renderHome();
