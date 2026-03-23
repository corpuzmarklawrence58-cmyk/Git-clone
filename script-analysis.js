// ===== Data Analysis Page Logic =====

// Load records
let allRecords = JSON.parse(localStorage.getItem('records')) || [];
let filteredRecords = [...allRecords];

const totalRecordsEl = document.getElementById('totalRecords');
const averageAgeEl = document.getElementById('averageAge');

const searchName = document.getElementById('searchName');
const minAgeEl = document.getElementById('minAge');
const maxAgeEl = document.getElementById('maxAge');
const applyFilterBtn = document.getElementById('applyFilter');
const resetFilterBtn = document.getElementById('resetFilter');

let chart;

// Update summary with animated counters
function updateSummary(records) {
  animateCounter(totalRecordsEl, records.length);
  if (records.length > 0) {
    const avg = (records.reduce((sum, r) => sum + Number(r.age), 0) / records.length).toFixed(2);
    animateCounter(averageAgeEl, avg);
  } else {
    animateCounter(averageAgeEl, 0);
  }
}

// Group records by first letter
function getGroupedData(records) {
  const groups = {};
  records.forEach(r => {
    if (!r.name || r.name.length === 0) return;
    const firstLetter = r.name[0].toUpperCase();
    if (!groups[firstLetter]) groups[firstLetter] = [];
    groups[firstLetter].push(Number(r.age));
  });

  const labels = Object.keys(groups).sort();
  const avgAges = labels.map(letter => {
    const ages = groups[letter];
    return (ages.reduce((sum, a) => sum + a, 0) / ages.length).toFixed(2);
  });

  return { labels, avgAges };
}

// Render chart with gradient fills
function renderChart(records) {
  const { labels, avgAges } = getGroupedData(records);
  const ctx = document.getElementById('ageChart').getContext('2d');

  if (chart) chart.destroy();

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
  gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
  gradient.addColorStop(1, 'rgba(167, 139, 250, 0.2)');

  const borderGradient = ctx.createLinearGradient(0, 0, 0, 400);
  borderGradient.addColorStop(0, '#818cf8');
  borderGradient.addColorStop(1, '#a78bfa');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Age by Name Initial',
        data: avgAges,
        backgroundColor: gradient,
        borderColor: borderGradient,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(129, 140, 248, 0.9)',
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 15, 35, 0.9)',
          titleColor: '#e2e8f0',
          bodyColor: '#a5b4fc',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          borderWidth: 1,
          cornerRadius: 10,
          padding: 12,
          titleFont: { family: 'Inter', weight: '600' },
          bodyFont: { family: 'Inter' }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 12, weight: '600' }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.04)'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 11 }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.04)'
          }
        }
      }
    }
  });
}

// Apply filters
function applyFilters() {
  const nameFilter = searchName.value.trim().toLowerCase();
  const min = minAgeEl.value ? parseInt(minAgeEl.value) : null;
  const max = maxAgeEl.value ? parseInt(maxAgeEl.value) : null;

  filteredRecords = allRecords.filter(r => {
    const matchesName = r.name.toLowerCase().includes(nameFilter);
    const matchesMin = min !== null ? Number(r.age) >= min : true;
    const matchesMax = max !== null ? Number(r.age) <= max : true;
    return matchesName && matchesMin && matchesMax;
  });

  updateSummary(filteredRecords);
  renderChart(filteredRecords);
  showToast(`Found ${filteredRecords.length} matching record${filteredRecords.length !== 1 ? 's' : ''}.`, 'info');
}

// Reset filters
function resetFilters() {
  searchName.value = '';
  minAgeEl.value = '';
  maxAgeEl.value = '';
  filteredRecords = [...allRecords];
  updateSummary(filteredRecords);
  renderChart(filteredRecords);
  showToast('Filters cleared.', 'info');
}

// Event listeners
applyFilterBtn.addEventListener('click', applyFilters);
resetFilterBtn.addEventListener('click', resetFilters);

// Initial render
updateSummary(filteredRecords);
renderChart(filteredRecords);