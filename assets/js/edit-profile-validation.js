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
      document.getElementById('email').value = userData.email; // Disabled field
      document.getElementById('address').value = userData.address || '';
    } else {
      alert(userData.message || 'Failed to load user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    alert('Failed to load user details.');
  }
});

// Handle the form submission to update user profile
async function updateProfile(event) {
  event.preventDefault();

  const updatedData = {
    name: document.getElementById('full-name').value,
    dob: document.getElementById('dob').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    email: localStorage.getItem('email'),
  };

  try {
    const authToken = localStorage.getItem('authToken');
    
    const response = await fetch('http://localhost:5000/api/updateProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Include token for authentication
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Profile updated successfully');
      window.location.href = 'post-login.html'; // Redirect to post-login page
    } else {
      alert(data.message || 'Update failed');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile.');
  }
}

// Attach event listener to the form
document.getElementById('edit-profile-form').addEventListener('submit', updateProfile);
