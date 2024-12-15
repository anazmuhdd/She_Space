document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".hidden, .active-section");
    const navbarLinks = document.querySelectorAll(".nav-link");
  
    // Dummy today's booking count
    const todaysBookingCount = 2; // Adjust as needed
    const bookingBadge = document.getElementById("bookingBadge");
    bookingBadge.textContent = todaysBookingCount;
    
    // Handle section switching
    navbarLinks.forEach(link => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
  
        const targetSection = this.getAttribute("data-section");
  
        // Update active link
        navbarLinks.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
  
        // Hide all sections and show the target
        sections.forEach(section => section.classList.add("hidden"));
        document.getElementById(targetSection).classList.remove("hidden");
      });
    });
  
    // Flatpickr initialization
    const calendarInput = document.getElementById("calendarInput");
    const selectedDate = document.getElementById("selectedDate");
    const calendarBookings = document.getElementById("calendarBookings");
  
    flatpickr(calendarInput, {
      onChange: function (selectedDates, dateStr) {
        selectedDate.textContent = dateStr;
        calendarBookings.innerHTML = `
          <li class="list-group-item">Room: Non A/C | User: Alex Johnson | Check-in: 9:00 AM | Check-out: 12:00 PM</li>
        `;
      },
    });
  
    // Logout redirection
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function (event) {
        // Redirect to staff-login page
        window.location.href = "staff-login.html";
      });
    }
  });
  