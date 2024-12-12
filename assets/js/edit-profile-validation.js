let userData = {};  // Store data temporarily

function showAccountDetails() {
  const fullName = document.getElementById('full-name').value;
  const dob = document.getElementById('dob').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  // Check if personal details are filled in
  if (!fullName || !dob || !phone || !email) {
    alert("Please fill in all mandatory fields in the Personal Details section.");
    return;
  }

  // Store personal details in the userData object
  userData.name = fullName;
  userData.dob = dob;
  userData.phone = phone;
  userData.email = email;

  // Hide personal details section and show account details (password) section
  document.getElementById('personal-details').style.display = 'none';
  document.getElementById('account-details').style.display = 'block';
}

function showPersonalDetails() {
  document.getElementById('account-details').style.display = 'none';
  document.getElementById('personal-details').style.display = 'block';
}

function validateForm(event) {
  event.preventDefault();  // Prevent default form submission

  const password = document.getElementById('password').value;
  const repassword = document.getElementById('repassword').value;

  // Check if passwords match (only validate if the password field is filled)
  if (password && password !== repassword) {
    alert("Passwords do not match!");
    return false;
  }

  // If passwords are changed, add them to the userData object
  if (password) {
    userData.password = password;
  }

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
