let userData = {}; // Store data temporarily

function showAccountDetails() {
  const fullName = document.getElementById("full-name").value;
  const dob = document.getElementById("dob").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  if (!fullName || !dob || !phone || !email) {
    alert("Please fill in all mandatory fields.");
    return;
  }

  userData.name = fullName;
  userData.dob = dob;
  userData.phone = phone;
  userData.email = email;

  document.getElementById("personal-details").style.display = "none";
  document.getElementById("account-details").style.display = "block";
}

function showPersonalDetails() {
  document.getElementById("account-details").style.display = "none";
  document.getElementById("personal-details").style.display = "block";
}

function validateForm(event) {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const repassword = document.getElementById("repassword").value;

  if (password !== repassword) {
    alert("Passwords do not match!");
    return false;
  }

  userData.password = password;
  userData.address = document.getElementById("address")?.value || "";

  registerUser(userData);
}

async function registerUser(formData) {
  const loader = document.getElementById("loading-spinner"); // loader div in HTML

  try {
    // Show loader
    loader.style.display = "flex";

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // Hide loader once response arrives
    loader.style.display = "none";

    if (response.ok) {
      alert("User registered successfully!");
      window.location.href = "/shespace";
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    loader.style.display = "none"; // Hide loader if error
    console.error("Error registering user:", error);
    alert("Something went wrong. Please try again.");
  }
}

// Attach event listener for form submission
document
  .getElementById("create-account-form")
  .addEventListener("submit", validateForm);
