// ===== Data Entry Page Logic =====

// Load records from localStorage
let records = JSON.parse(localStorage.getItem('records')) || [];

const dataForm = document.getElementById('dataForm');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
const emptyState = document.getElementById('emptyState');
const tableWrapper = document.getElementById('tableWrapper');
const recordCount = document.getElementById('recordCount');
const formTitle = document.getElementById('formTitle');
const submitText = document.getElementById('submitText');
const cancelBtn = document.getElementById('cancelBtn');
let editIndex = -1;

// Render table
function renderTable() {
  dataTable.innerHTML = '';
  
  if (records.length === 0) {
    emptyState.style.display = 'block';
    tableWrapper.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    tableWrapper.style.display = 'block';
  }

  records.forEach((record, index) => {
    const row = document.createElement('tr');
    row.className = 'animate-fade-in-up';
    row.style.animationDelay = `${index * 0.05}s`;
    row.innerHTML = `
      <td>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">${record.name.charAt(0).toUpperCase()}</div>
          <span class="font-medium text-slate-200">${record.name}</span>
        </div>
      </td>
      <td><span class="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-semibold">${record.age}</span></td>
      <td class="text-slate-400">${record.email}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn-edit" onclick="editRecord(${index})">
            <span class="material-icons-round text-sm mr-1" style="vertical-align: middle; font-size: 14px;">edit</span>Edit
          </button>
          <button class="btn-delete" onclick="deleteRecord(${index})">
            <span class="material-icons-round text-sm mr-1" style="vertical-align: middle; font-size: 14px;">delete</span>Delete
          </button>
        </div>
      </td>
    `;
    dataTable.appendChild(row);
  });

  recordCount.textContent = `${records.length} record${records.length !== 1 ? 's' : ''}`;
  localStorage.setItem('records', JSON.stringify(records));
}

// Add or update record
dataForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !age || !email) {
    showToast('Please fill in all fields.', 'error');
    return;
  }

  if (editIndex === -1) {
    records.push({ name, age, email });
    showToast(`Record for "${name}" added successfully!`, 'success');
  } else {
    records[editIndex] = { name, age, email };
    showToast(`Record for "${name}" updated successfully!`, 'info');
    exitEditMode();
  }

  dataForm.reset();
  renderTable();
});

// Edit record
function editRecord(index) {
  editIndex = index;
  document.getElementById('name').value = records[index].name;
  document.getElementById('age').value = records[index].age;
  document.getElementById('email').value = records[index].email;

  // Switch to edit mode UI
  formTitle.textContent = 'Edit Record';
  submitText.textContent = 'Update';
  cancelBtn.classList.remove('hidden');
  document.getElementById('formCard').classList.add('animate-pulse-glow');
  
  // Scroll to form
  document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cancel edit
function cancelEdit() {
  exitEditMode();
  dataForm.reset();
  showToast('Edit cancelled.', 'info');
}

function exitEditMode() {
  editIndex = -1;
  formTitle.textContent = 'New Record';
  submitText.textContent = 'Add Record';
  cancelBtn.classList.add('hidden');
  document.getElementById('formCard').classList.remove('animate-pulse-glow');
}

// Delete record with animation
function deleteRecord(index) {
  const row = dataTable.querySelectorAll('tr')[index];
  if (row) {
    row.classList.remove('animate-fade-in-up');
    row.classList.add('animate-fade-out-down');
    row.addEventListener('animationend', () => {
      const name = records[index].name;
      records.splice(index, 1);
      renderTable();
      showToast(`Record for "${name}" deleted.`, 'error');
    });
  } else {
    records.splice(index, 1);
    renderTable();
  }
}

// Initial render
renderTable();