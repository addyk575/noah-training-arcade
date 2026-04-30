/* ===================================================================
   FAMILY SYNC
   - Uses Firebase Realtime Database
   - No auth, no accounts. A shared "sync code" = shared room.
   - Both phones enter the same code → same data, real-time.
   - Falls back gracefully to local-only if config is missing.
   =================================================================== */

let _syncRef = null;
let _syncEnabled = false;
let _pushTimer = null;
let _applyingRemote = false;
let _lastRemoteUpdatedAt = 0;

function getSyncCode() {
  return localStorage.getItem('noah_sync_code') || '';
}
function setSyncCodeValue(code) {
  if (code) localStorage.setItem('noah_sync_code', code);
  else localStorage.removeItem('noah_sync_code');
}

function hasFirebaseConfig() {
  return typeof SYNC_CONFIG !== 'undefined' && SYNC_CONFIG.apiKey && SYNC_CONFIG.databaseURL;
}

function initSync() {
  updateSyncIndicator('off');
  if (!hasFirebaseConfig()) {
    console.log('[sync] Firebase config missing — running local-only');
    return;
  }
  if (typeof firebase === 'undefined') {
    console.warn('[sync] Firebase SDK not loaded');
    return;
  }
  try {
    if (!firebase.apps.length) firebase.initializeApp(SYNC_CONFIG);
  } catch (e) { console.warn('[sync] init error', e); }

  const code = getSyncCode();
  if (code && code.length >= 8) {
    connectRoom(code);
  } else {
    updateSyncIndicator('idle');
  }
}

function connectRoom(code) {
  disconnectRoom();
  try {
    _syncRef = firebase.database().ref('rooms/' + code);
  } catch (e) { console.warn('[sync] ref error', e); return; }

  _syncEnabled = true;
  updateSyncIndicator('connecting');

  _syncRef.on('value', (snap) => {
    const remote = snap.val();
    if (!remote) {
      // First time — push our local state so the room has content
      pushLocal(true);
      updateSyncIndicator('connected');
      return;
    }
    // Skip if this change is older than what we already applied
    if (remote.updatedAt && remote.updatedAt <= _lastRemoteUpdatedAt) {
      updateSyncIndicator('connected');
      return;
    }
    applyRemote(remote);
    _lastRemoteUpdatedAt = remote.updatedAt || Date.now();
    updateSyncIndicator('connected');
  }, (err) => {
    console.warn('[sync] read error', err);
    updateSyncIndicator('error');
  });
}

function disconnectRoom() {
  if (_syncRef) {
    try { _syncRef.off(); } catch (e) {}
    _syncRef = null;
  }
  _syncEnabled = false;
  _lastRemoteUpdatedAt = 0;
}

function applyRemote(remote) {
  _applyingRemote = true;
  try {
    if (Array.isArray(remote.workouts)) {
      state.workouts = remote.workouts;
    }
    if (remote.settings) {
      // Merge only known TWEAKS keys so we don't nuke local UI prefs
      if (typeof TWEAKS !== 'undefined') {
        if (remote.settings.coachContact !== undefined) TWEAKS.coachContact = remote.settings.coachContact;
        if (remote.settings.accent !== undefined) TWEAKS.accent = remote.settings.accent;
        if (remote.settings.density !== undefined) TWEAKS.density = remote.settings.density;
      }
    }
    saveStateLocalOnly();
    rerenderActiveView();
  } finally {
    _applyingRemote = false;
  }
}

function pushLocal(immediate) {
  if (!_syncEnabled || !_syncRef) return;
  if (_applyingRemote) return;
  clearTimeout(_pushTimer);
  const doPush = () => {
    const payload = {
      workouts: state.workouts || [],
      settings: (typeof TWEAKS !== 'undefined') ? TWEAKS : {},
      updatedAt: Date.now(),
    };
    _lastRemoteUpdatedAt = payload.updatedAt;
    updateSyncIndicator('connecting');
    _syncRef.set(payload)
      .then(() => updateSyncIndicator('connected'))
      .catch((err) => {
        console.warn('[sync] push error', err);
        updateSyncIndicator('error');
      });
  };
  if (immediate) doPush();
  else _pushTimer = setTimeout(doPush, 100);
}

// Force a fresh pull from the cloud (used on tab focus / "Sync now")
function forcePull() {
  if (!_syncEnabled || !_syncRef) return;
  _syncRef.once('value').then((snap) => {
    const remote = snap.val();
    if (remote) {
      _lastRemoteUpdatedAt = 0; // bypass the dedup check
      applyRemote(remote);
      _lastRemoteUpdatedAt = remote.updatedAt || Date.now();
    }
    updateSyncIndicator('connected');
  }).catch((err) => {
    console.warn('[sync] forcePull error', err);
    updateSyncIndicator('error');
  });
}

// Auto-pull on focus / visibility — handles "phone was backgrounded for hours"
window.addEventListener('focus', () => { if (_syncEnabled) forcePull(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && _syncEnabled) forcePull();
});

// Save to localStorage WITHOUT pushing to cloud (used when applying remote)
function saveStateLocalOnly() {
  try { localStorage.setItem('noah_tracker_state', JSON.stringify(state)); } catch (e) {}
  try { localStorage.setItem('noah_tweaks', JSON.stringify(TWEAKS)); } catch (e) {}
}

function rerenderActiveView() {
  const active = document.querySelector('.view.active, .w-detail.active');
  if (!active) return;
  if (active.id === 'view-home' && typeof renderHome === 'function') renderHome();
  else if (active.id === 'view-plan' && typeof renderPlan === 'function') renderPlan();
  else if (active.id === 'view-progress' && typeof renderProgress === 'function') renderProgress();
  else if (active.id === 'view-history' && typeof renderHistory === 'function') renderHistory();
  else if (active.id === 'view-guide' && typeof renderGuide === 'function') renderGuide();
  else if (active.id === 'view-workout' && typeof renderWorkout === 'function') renderWorkout();
}

/* ===== UI: status dot + modal ===== */

function updateSyncIndicator(status) {
  const dot = document.getElementById('sync-dot');
  if (!dot) return;
  dot.className = 'sync-dot ' + status;
  const labels = {
    off:        'Sync off (no Firebase config)',
    idle:       'Sync idle — tap to set up',
    connecting: 'Syncing…',
    connected:  'Synced ✓',
    error:      'Sync error',
  };
  dot.title = labels[status] || status;
}

function openSyncModal() {
  if (!hasFirebaseConfig()) {
    alert("Firebase isn't configured yet. Ask the app's owner to set it up (or see js/sync-config.js).");
    return;
  }
  const current = getSyncCode();
  const suggested = current || ('noah-' + Math.random().toString(36).substring(2, 8));
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-title">Family Sync</div>
      <div class="modal-sub">Everyone with the same code sees the same workouts live. Share this code with anyone you want to sync with — they enter it on their phone and boom, same data on both.</div>
      <input type="text" class="modal-input" id="sync-code-input" value="${current}" placeholder="${suggested}" autocapitalize="off" autocorrect="off" autocomplete="off">
      <div class="modal-actions">
        <button class="modal-btn ghost" id="sync-cancel">Cancel</button>
        ${current ? '<button class="modal-btn ghost" id="sync-pull">Sync now</button>' : ''}
        ${current ? '<button class="modal-btn ghost" id="sync-disconnect">Disconnect</button>' : ''}
        <button class="modal-btn primary" id="sync-save">${current ? 'Update' : 'Connect'}</button>
      </div>
      <div class="modal-note"><b>Suggested:</b> <span id="sync-suggest" style="cursor:pointer;text-decoration:underline">${suggested}</span> — tap to use. Minimum 8 characters.</div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('sync-cancel').onclick = () => modal.remove();
  const pullBtn = document.getElementById('sync-pull');
  if (pullBtn) pullBtn.onclick = () => {
    forcePull();
    modal.remove();
    if (typeof showToast === 'function') showToast('Syncing…');
    if (typeof toast === 'function') toast('Syncing…');
  };
  const disc = document.getElementById('sync-disconnect');
  if (disc) disc.onclick = () => {
    if (!confirm('Disconnect sync? Your data will stay on this phone but stop syncing.')) return;
    disconnectRoom();
    setSyncCodeValue('');
    updateSyncIndicator('idle');
    modal.remove();
    if (typeof showToast === 'function') showToast('Sync disconnected');
  };
  document.getElementById('sync-suggest').onclick = () => {
    document.getElementById('sync-code-input').value = suggested;
  };
  document.getElementById('sync-save').onclick = () => {
    const code = document.getElementById('sync-code-input').value.trim();
    if (code.length < 8) {
      alert('Code must be at least 8 characters.');
      return;
    }
    setSyncCodeValue(code);
    connectRoom(code);
    modal.remove();
    if (typeof showToast === 'function') showToast('Syncing with code: ' + code);
  };
}

// Wrap saveState so every persisted change also pushes to cloud.
// Wait until the DOM + original saveState exist before wrapping.
function wireSyncHook() {
  if (typeof saveState !== 'function') return;
  const original = saveState;
  window.saveState = function() {
    original.apply(this, arguments);
    if (_syncEnabled) pushLocal();
  };
}
