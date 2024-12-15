function showMessage(message) {
  const modal = document.getElementById("message-modal");
  const modalMessage = document.getElementById("modal-message");
  const closeButton = document.querySelector(".close-button");

  modalMessage.textContent = message;
  modal.style.display = "flex";

  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

document.querySelector("#login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please fill in both fields!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('email', email);
      localStorage.setItem('userId', data.userId);
      console.log("User ID (ObjectId):", localStorage.userId);
      showMessage(data.message);
      setTimeout(() => {
        window.location.href = "/dashboard";  // Redirect to /dashboard after login
      }, 5000); // Redirect after 2 seconds
    } else {
      showMessage(data.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    showMessage("An error occurred. Please try again later.");
  }
});
