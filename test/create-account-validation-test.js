let userData = {}; // Store data temporarily

function showAccountDetails() {
  const fullName = document.getElementById('full-name').value;
  const dob = document.getElementById('dob').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  if (!fullName || !dob || !phone || !email) {
    alert("Please fill in all mandatory fields.");
    return;
  }

  userData.name = fullName;
  userData.dob = dob;
  userData.phone = phone;
  userData.email = email;

  // Trigger OTP sending before moving to account details
  sendOTP();
}

function showPersonalDetails() {
  document.getElementById('account-details').style.display = 'none';
  document.getElementById('personal-details').style.display = 'block';
}

function validateForm(event) {
  event.preventDefault();

  const password = document.getElementById('password').value;
  const repassword = document.getElementById('repassword').value;

  if (password !== repassword) {
    alert("Passwords do not match!");
    return false;
  }

  userData.password = password;
  userData.address = document.getElementById('address')?.value || '';

  registerUser(userData);
}

async function registerUser(formData) {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('User registered successfully!');
      window.location.href = '/shespace';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    alert('Something went wrong. Please try again.');
  }
}

// Attach event listener for form submission
document.getElementById('create-account-form').addEventListener('submit', validateForm);

// OTP functionality
async function sendOTP() {
  const email = document.getElementById('email').value;

  if (!email) {
    alert('Please enter a valid email');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/sendOTP', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      const otpModal = new bootstrap.Modal(document.getElementById('otp-modal'));
      otpModal.show();
    } else {
      alert(data.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

async function verifyOTP() {
  const email = document.getElementById('email').value;
  const otp = document.getElementById('otp-input').value;

  if (!otp) {
    alert('Please enter the OTP');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/verifyOTP', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Email verified successfully!');
      const otpModal = bootstrap.Modal.getInstance(document.getElementById('otp-modal'));
      otpModal.hide();
      document.getElementById('personal-details').style.display = 'none';
      document.getElementById('account-details').style.display = 'block';
    } else {
      alert(data.message || 'Failed to verify OTP');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
}
