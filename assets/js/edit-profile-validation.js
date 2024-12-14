// Auto-populate user details on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const email = localStorage.getItem('email'); // Retrieve user email from localStorage
    const response = await fetch(`http://localhost:5000/api/user/${email}`);
    const userData = await response.json();

    if (response.ok) {
      // Populate user details into form fields
      document.getElementById('full-name').value = userData.name;

      // Convert the dob from backend format to yyyy-MM-dd
      const dob = new Date(userData.dob); // Assuming the backend returns dob in ISO 8601 format
      const formattedDob = dob.toISOString().split('T')[0]; // Extract the yyyy-MM-dd part
      document.getElementById('dob').value = formattedDob;

      document.getElementById('phone').value = userData.phone;
      document.getElementById('email').value = userData.email;
      document.getElementById('address').value = userData.address || '';
    } else {
      alert(userData.message || 'Failed to fetch user details');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    alert('Error fetching user details. Please try again later.');
  }
});

// Handle profile update submission
document.getElementById('edit-profile-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const updatedData = {
    name: document.getElementById('full-name').value,
    dob: document.getElementById('dob').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
  };

  try {
    const response = await fetch('http://localhost:5000/api/updateProfile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.message || 'Error updating profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error updating profile. Please try again later.');
  }
});
