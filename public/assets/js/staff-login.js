document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('staff-username').value;
    const password = document.getElementById('staff-password').value;

    try {
        const response = await fetch('/api/stafflogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            localStorage.setItem('staffId', result.staff._id);
            // Redirect based on role (example: admin vs staff dashboard)
            if (result.staff.role === 'admin') {
                window.location.href = '/admin-dashboard';
            } else {
                window.location.href = '/staff-dashboard';
            }
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        alert('An error occurred during login');
        console.error(error);
    }
});
