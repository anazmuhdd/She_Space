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

  // Check if passwords match
  if (password !== repassword) {
    alert("Passwords do not match!");
    return false;
  }

  // Add password to the userData object
  userData.password = password;

  // Collect other account details (address can be optional)
  const address = document.getElementById('address').value || '';
  userData.address = address;

  // Call the API to register the user
  registerUser(userData);
}

async function registerUser(formData) {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('User registered successfully!');
      // Optionally, redirect to login page or clear the form
      window.location.href = '../html/index.html'; // Redirect to login page after registration
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    alert('Something went wrong. Please try again.');
  }
}

// Attach the form submission handler
document.getElementById('create-account-form').addEventListener('submit', validateForm);
