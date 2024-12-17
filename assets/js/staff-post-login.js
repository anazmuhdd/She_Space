document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".hidden, .active-section");
  const navbarLinks = document.querySelectorAll(".nav-link");

  // Utility function to fetch data from an API with improved error handling
  async function fetchData(url, method = "GET", body = null) {
      try {
          const options = {
              method,
              headers: { 
                  "Content-Type": "application/json",
                  // Add any authentication headers if required
                  // "Authorization": `Bearer ${token}` 
              },
          };
          
          if (body) options.body = JSON.stringify(body);

          console.log(`Fetching ${method} ${url}`, body ? `with body: ${JSON.stringify(body)}` : '');

          const response = await fetch(url, options);
          
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Something went wrong');
          }
          
          const data = await response.json();
          console.log(`Response from ${url}:`, data);
          return data;
      } catch (error) {
          console.error('Fetch error:', error);
          // Handle error in UI
          alert(`Error: ${error.message}`);
          throw error;
      }
  }

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
          // Load bookings for the selected date
          loadBookingsForDate(dateStr);
      },
  });

  // Load and display today's bookings
  async function loadTodaysBookings() {
      try {
          const data = await fetchData("/api/todays-bookings");
  
          const bookingsList = document.getElementById("todaysBookings");
          bookingsList.innerHTML = ""; // Clear existing data
  
          if (data.success && data.bookings && data.bookings.length > 0) {
              data.bookings.forEach((booking) => {
                  const listItem = document.createElement("li");
                  listItem.classList.add("list-group-item");
                  listItem.innerHTML = `
                      <p><strong>User:</strong> ${booking.name} (${booking.user_id})</p>
                      <p><strong>Phone:</strong> ${booking.phone}</p>
                      <p><strong>Email:</strong> ${booking.email}</p>
                      <p><strong>Dormitories:</strong> ${booking.dormitory_ids ? booking.dormitory_ids.join(", ") : "None"}</p>
                      <p><strong>Rooms:</strong> ${booking.room_ids ? booking.room_ids.join(", ") : "None"}</p>
                      <p><strong>Total Rooms:</strong> ${booking.number_of_beds || 0}</p>
                      <p><strong>Type:</strong> ${booking.type}</p>
                  `;
                  bookingsList.appendChild(listItem);
              });
  
              // Update the Today's Bookings count in the navbar badge
              const bookingBadge = document.getElementById("bookingBadge");
              bookingBadge.textContent = data.bookings.length || 0;
          } else {
              bookingsList.innerHTML = '<li class="list-group-item">No bookings found for today.</li>';
              const bookingBadge = document.getElementById("bookingBadge");
              bookingBadge.textContent = '0';
          }
      } catch (error) {
          console.error("Error loading today's bookings:", error);
          const bookingsList = document.getElementById("todaysBookings");
          bookingsList.innerHTML = '<li class="list-group-item">Error loading bookings.</li>';
      }
  }

  // Load and display bookings for a selected date
  async function loadBookingsForDate(date) {
      try {
          const data = await fetchData("/api/booking-calendar", "POST", {
              selectedDate: date,
          });
  
          const calendarBookings = document.getElementById("calendarBookings");
          calendarBookings.innerHTML = ""; // Clear existing data
  
          if (data.success && data.bookings && data.bookings.length > 0) {
              data.bookings.forEach((booking) => {
                  const listItem = document.createElement("li");
                  listItem.classList.add("list-group-item");
                  listItem.innerHTML = `
                      <p><strong>User:</strong> ${booking.name} (${booking.user_id})</p>
                      <p><strong>Phone:</strong> ${booking.phone}</p>
                      <p><strong>Email:</strong> ${booking.email}</p>
                      <p><strong>Dormitories:</strong> ${booking.dormitory_ids ? booking.dormitory_ids.join(", ") : "None"}</p>
                      <p><strong>Rooms:</strong> ${booking.room_ids ? booking.room_ids.join(", ") : "None"}</p>
                      <p><strong>Total Rooms:</strong> ${booking.number_of_rooms || 0}</p>
                      <p><strong>Type:</strong> ${booking.type}</p>
                  `;
                  calendarBookings.appendChild(listItem);
              });
          } else {
              calendarBookings.innerHTML = '<li class="list-group-item">No bookings found for this date.</li>';
          }
      } catch (error) {
          console.error("Error loading bookings for date:", error);
          const calendarBookings = document.getElementById("calendarBookings");
          calendarBookings.innerHTML = '<li class="list-group-item">Error loading bookings.</li>';
      }
  }

  // Load and display user details
  async function loadUserDetails() {
      try {
          const data = await fetchData("/api/user-details");
  
          const userDetailsList = document.getElementById("userDetails");
          userDetailsList.innerHTML = ""; // Clear existing data
  
          if (data.success && data.users && data.users.length > 0) {
              data.users.forEach((user) => {
                  const listItem = document.createElement("li");
                  listItem.classList.add("list-group-item");
                  listItem.innerHTML = `
                      <p><strong>Name:</strong> ${user.name}</p>
                      <p><strong>Phone:</strong> ${user.phone}</p>
                      <p><strong>Email:</strong> ${user.email}</p>
                      <p><strong>Address:</strong> ${user.address || 'N/A'}</p>
                      <p><strong>Total Bookings:</strong> ${user.totalBookings || 0}</p>
                  `;
                  userDetailsList.appendChild(listItem);
              });
          } else {
              userDetailsList.innerHTML = '<li class="list-group-item">No user details found.</li>';
          }
      } catch (error) {
          console.error("Error loading user details:", error);
          const userDetailsList = document.getElementById("userDetails");
          userDetailsList.innerHTML = '<li class="list-group-item">Error loading user details.</li>';
      }
  }

  // Check and display available rooms
  async function checkRoomAvailability() {
      try {
          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const data = await fetchData('/api/availability', 'POST', {
              checkIn: today.toISOString(),
              checkOut: tomorrow.toISOString()
          });

          const availableRoomsList = document.getElementById("availableRooms");
          availableRoomsList.innerHTML = ""; // Clear existing data

          if (data.success) {
              const availabilityData = data.availability;
              
              // Create list items for each room type
              const roomTypes = [
                  { key: 'Dormitory', label: 'Dormitory' },
                  { key: 'NonAC', label: 'Non A/C' },
                  { key: 'AC', label: 'A/C' }
              ];

              roomTypes.forEach(roomType => {
                  const listItem = document.createElement("li");
                  listItem.classList.add("list-group-item");
                  listItem.innerHTML = `
                      <strong>${roomType.label} Rooms:</strong> 
                      ${availabilityData[roomType.key] || 0} available
                  `;
                  availableRoomsList.appendChild(listItem);
              });
          } else {
              availableRoomsList.innerHTML = '<li class="list-group-item">Unable to fetch room availability.</li>';
          }
      } catch (error) {
          console.error("Error checking room availability:", error);
          const availableRoomsList = document.getElementById("availableRooms");
          availableRoomsList.innerHTML = '<li class="list-group-item">Error loading room availability.</li>';
      }
  }

  // Logout redirection
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
          // Redirect to staff-login page
          window.location.href = "/staff-login";
      });
  }

  // Initial Loads
  // Load today's bookings when the page loads
  loadTodaysBookings();
  
  // Load user details on initial page load
  loadUserDetails();

  // Check room availability on initial page load
  checkRoomAvailability();
});