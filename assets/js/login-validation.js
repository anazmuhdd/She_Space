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

document
  .querySelector("#login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loader = document.getElementById("loading-spinner");

    if (!email || !password) {
      showMessage("Please fill in both fields!");
      return;
    }

    try {
      // Show loading spinner
      loader.style.display = "flex";

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Hide loader once response comes
      loader.style.display = "none";

      if (response.ok) {
        localStorage.setItem("email", email);
        localStorage.setItem("userId", data.userId);
        console.log("User ID (ObjectId):", localStorage.userId);
        showMessage(data.message);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        showMessage(data.message);
      }
    } catch (error) {
      loader.style.display = "none"; // Hide loader if error
      console.error("Error during login:", error);
      showMessage("An error occurred. Please try again later.");
    }
  });
