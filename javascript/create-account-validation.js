function showAccountDetails() {
    const fullName = document.getElementById('full-name').value;
    const dob = document.getElementById('dob').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
  
    if (!fullName || !dob || !phone || !email) {
      alert("Please fill in all mandatory fields in the Personal Details section.");
      return;
    }
  
    document.getElementById('personal-details').style.display = 'none';
    document.getElementById('account-details').style.display = 'block';
  }
  
  function showPersonalDetails() {
    document.getElementById('account-details').style.display = 'none';
    document.getElementById('personal-details').style.display = 'block';
  }
  
  function validateForm() {
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;
  
    if (password !== repassword) {
      alert("Passwords do not match!");
      return false;
    }
  
    return true; // Allow form submission if passwords match
  }
  