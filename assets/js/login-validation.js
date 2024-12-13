document.querySelector("#login-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent form submission for now

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Basic validation
  if (!email || !password) {
    alert("Please fill in both fields!");
    return;
  }

  try {
    // Send login request to the server
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // Show success message
      window.location.href = "post-login.html"; // Redirect to post-login page
    } else {
      alert(data.message); // Show error message from server
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
});
