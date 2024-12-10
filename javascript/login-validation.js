document.querySelector("#login-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission for now
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Validate login fields
  if (username === "" || password === "") {
    alert("Please fill in both fields!");
  } else {
    alert("Login successful!");
    // Redirect or handle login logic here
  }
});
