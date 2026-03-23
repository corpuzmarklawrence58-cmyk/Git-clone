let users = JSON.parse(localStorage.getItem('users')) || [];

const userForm = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const userTable = document.getElementById('userTable');
const errorDiv = document.getElementById('error');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const userIdInput = document.getElementById('userId');

// Function to render users in table
function renderUsers() {
    userTable.innerHTML = '';
    users.forEach((user, index) => {
        userTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser(${index})">Edit</button>
                    <button onclick="deleteUser(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Function to add user
userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        showError('Please fill in all fields.');
        return;
    }

    if (!validateEmail(email)) {
        showError('Invalid email address.');
        return;
    }

    const newUser = { name, email };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    userForm.reset();
    errorDiv.innerText = '';
});

// Function to edit user
function editUser(index) {
    const user = users[index];
    nameInput.value = user.name;
    emailInput.value = user.email;
    userIdInput.value = index;

    addBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
}

// Function to update user
updateBtn.addEventListener('click', function() {
    const index = userIdInput.value;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        showError('Please fill in all fields.');
        return;
    }

    if (!validateEmail(email)) {
        showError('Invalid email address.');
        return;
    }

    users[index] = { name, email };
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    resetForm();
});

// Function to cancel editing
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    addBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    errorDiv.innerText = '';
}

// Function to delete user
function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers();
    }
}

// Function to show error
function showError(message) {
    errorDiv.innerText = message;
}

// Validate email
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Initial render
renderUsers();
