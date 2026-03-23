// ===== Shared Utilities for CRUD System =====

// --- Toast Notification System ---
function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-toast-in`;

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  toast.innerHTML = `
    <span class="material-icons-round">${icons[type] || 'info'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('animate-toast-in');
    toast.classList.add('animate-toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// --- Animated Counter ---
function animateCounter(element, targetValue, duration = 800) {
  const start = parseFloat(element.textContent) || 0;
  const target = parseFloat(targetValue);
  if (isNaN(target)) {
    element.textContent = targetValue;
    return;
  }
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    element.textContent = isFloat ? current.toFixed(2) : Math.round(current);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// --- Dashboard Stats (index.html) ---
function loadDashboardStats() {
  const records = JSON.parse(localStorage.getItem('records')) || [];
  const statRecords = document.getElementById('statRecords');
  const statAvgAge = document.getElementById('statAvgAge');

  if (statRecords) {
    animateCounter(statRecords, records.length);
  }
  if (statAvgAge) {
    if (records.length > 0) {
      const avg = (records.reduce((sum, r) => sum + Number(r.age), 0) / records.length).toFixed(2);
      animateCounter(statAvgAge, avg);
    } else {
      statAvgAge.textContent = '0';
    }
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', loadDashboardStats);