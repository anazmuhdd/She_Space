let userData = {}; // Store data temporarily

function validateForm(event) {
  event.preventDefault(); // Prevent default form submission

  // Get personal details from the form
  const fullName = document.getElementById('full-name').value;
  const dob = document.getElementById('dob').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;

  // Validate required fields
  if (!fullName || !dob || !phone || !email) {
    alert("Please fill in all mandatory fields.");
    return;
  }

  // Store user data
  userData = {
    name: fullName,
    dob: dob,
    phone: phone,
    email: email,
    address: address,
  };

  // Call the API to update the user profile
  updateUserProfile(userData);
}

async function updateUserProfile(formData) {
  try {
    const response = await fetch('http://localhost:5000/api/updateProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Profile updated successfully!');
      // Optionally, redirect or update the UI with new data
      window.location.href = '../html/profile.html'; // Redirect to profile page
    } else {
      alert(data.message || 'Profile update failed');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Something went wrong. Please try again.');
  }
}

// Attach the form submission handler
document.getElementById('edit-profile-form').addEventListener('submit', validateForm);
