const API_URL = 'http://127.0.0.1:5000';

function displayMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    const errorDiv = document.getElementById('error');
    if (isError) {
        errorDiv.textContent = message;
        messageDiv.textContent = '';
    } else {
        messageDiv.textContent = message;
        errorDiv.textContent = '';
    }
    setTimeout(() => {
        messageDiv.textContent = '';
        errorDiv.textContent = '';
    }, 3000);
}

function registerEmployee() {
    const employeeData = {
        employee_name: document.getElementById('reg_employee_name').value,
        mobile_number: document.getElementById('reg_mobile_number').value,
        email: document.getElementById('reg_email').value,
        team: document.getElementById('reg_team').value
    };

    fetch(`${API_URL}/register-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            displayMessage(data.message);
            document.getElementById('reg_employee_name').value = '';
            document.getElementById('reg_mobile_number').value = '';
            document.getElementById('reg_email').value = '';
            document.getElementById('reg_team').value = '';
        } else {
            displayMessage(data.error || 'Failed to register employee', true);
        }
    })
    .catch(error => displayMessage('Error registering employee', true));
}

function retrieveEmployee() {
    const employeeId = document.getElementById('retrieve_employee_id').value;
    fetch(`${API_URL}/retrieve-single-employee?employee_id=${employeeId}`)
    .then(response => response.json())
    .then(data => {
        const detailsDiv = document.getElementById('employee_details');
        if (data.error) {
            displayMessage(data.error, true);
            detailsDiv.innerHTML = '';
        } else {
            detailsDiv.innerHTML = `
                <p><strong>ID:</strong> ${data.employee_id}</p>
                <p><strong>Name:</strong> ${data.employee_name}</p>
                <p><strong>Mobile:</strong> ${data.mobile_number}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Team:</strong> ${data.team}</p>
            `;
            displayMessage('Employee retrieved successfully');
        }
    })
    .catch(error => displayMessage('Error retrieving employee', true));
}

function updateEmployee() {
    const employeeId = document.getElementById('update_employee_id').value;
    const employeeData = {
        employee_name: document.getElementById('update_employee_name').value,
        mobile_number: document.getElementById('update_mobile_number').value,
        email: document.getElementById('update_email').value,
        team: document.getElementById('update_team').value
    };

    fetch(`${API_URL}/update-employee?employee_id=${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            displayMessage(data.message);
            document.getElementById('update_employee_id').value = '';
            document.getElementById('update_employee_name').value = '';
            document.getElementById('update_mobile_number').value = '';
            document.getElementById('update_email').value = '';
            document.getElementById('update_team').value = '';
        } else {
            displayMessage(data.error || 'Failed to update employee', true);
        }
    })
    .catch(error => displayMessage('Error updating employee', true));
}

function deleteEmployee() {
    const employeeId = document.getElementById('delete_employee_id').value;
    fetch(`${API_URL}/delete-employee?employee_id=${employeeId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            displayMessage(data.message);
            document.getElementById('delete_employee_id').value = '';
        } else {
            displayMessage(data.error || 'Failed to delete employee', true);
        }
    })
    .catch(error => displayMessage('Error deleting employee', true));
}
