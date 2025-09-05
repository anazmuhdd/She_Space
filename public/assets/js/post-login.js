document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Utility: Show/Hide Loader
  const loader = document.getElementById("loading-spinner");

  function showLoader(message = "Loading, please wait...") {
    loader.querySelector("p").innerText = message;
    loader.style.display = "flex";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  // Initialize Flatpickr for check-in and check-out date & time
  flatpickr("#checkIn", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
  });

  flatpickr("#checkOut", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
  });

  const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn");
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");

  checkInInput.addEventListener("change", toggleCheckAvailability);
  checkOutInput.addEventListener("change", toggleCheckAvailability);

  function toggleCheckAvailability() {
    checkAvailabilityBtn.disabled = !(
      checkInInput.value && checkOutInput.value
    );
  }

  let availability = {};

  // 🔹 Fetch Availability
  checkAvailabilityBtn.addEventListener("click", async () => {
    const checkInDate = checkInInput.value;
    const checkOutDate = checkOutInput.value;
    localStorage.setItem("checkInDate", checkInDate);
    localStorage.setItem("checkOutDate", checkOutDate);

    if (!checkInDate || !checkOutDate) return;

    try {
      showLoader("Checking room availability...");

      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn: checkInDate, checkOut: checkOutDate }),
      });

      const data = await response.json();
      hideLoader();

      if (response.ok) {
        availability = data.availability;
        populateAvailableRooms(availability);
        const availableRoomsModal = new bootstrap.Modal(
          document.getElementById("availableRoomsModal")
        );
        availableRoomsModal.show();
      } else {
        alert(data.message || "Error fetching room availability.");
      }
    } catch (error) {
      hideLoader();
      console.error(error);
      alert("An error occurred while checking availability.");
    }
  });

  // Room selection
  const roomType = document.getElementById("roomType");
  const roomOrBed = document.getElementById("roomOrBed");

  roomType.addEventListener("change", () => {
    const selectedRoom = roomType.value;
    if (selectedRoom !== "selectRoom") {
      updateRoomOrBedDropdown(selectedRoom);
    } else {
      roomOrBed.innerHTML = "";
    }
  });

  function updateRoomOrBedDropdown(selectedRoom) {
    let availableQuantity = availability[selectedRoom] || 0;
    roomOrBed.innerHTML = "";

    for (let i = 1; i <= availableQuantity; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = i;
      optionElement.textContent = `${i} ${
        selectedRoom === "Dormitory" ? "Bed(s)" : "Room(s)"
      }`;
      roomOrBed.appendChild(optionElement);
    }
  }

  function populateAvailableRooms(availability) {
    const availableRoomsList = document.querySelector(".list-group");
    availableRoomsList.innerHTML = "";

    const roomTypes = ["Dormitory", "NonAC", "AC"];

    roomTypes.forEach((type) => {
      const available = availability[type] || 0;
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = `${type} - ${available} ${
        type === "Dormitory" ? "Beds" : "Beds"
      } Available`;
      availableRoomsList.appendChild(listItem);
    });
  }

  // 🔹 Book Now
  document
    .getElementById("bookNowBtn")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const user_Id = localStorage.getItem("userId");
      const checkInDate = localStorage.getItem("checkInDate");
      const checkOutDate = localStorage.getItem("checkOutDate");
      const num_Rooms = document.getElementById("roomOrBed").value;
      let typeroom = "";

      if (document.getElementById("roomType").value == "AC") {
        typeroom = "A/C";
      } else if (document.getElementById("roomType").value == "NonAC") {
        typeroom = "Non A/C";
      } else {
        typeroom = "Dormitory";
      }

      const bookingData = {
        userId: user_Id,
        r_type: typeroom,
        checkInD: checkInDate,
        checkOut: checkOutDate,
        numRooms: num_Rooms,
      };

      try {
        showLoader("Processing your booking...");

        const response = await fetch("/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        hideLoader();

        if (response.ok) {
          const availableRoomsModal = bootstrap.Modal.getInstance(
            document.getElementById("availableRoomsModal")
          );
          availableRoomsModal.hide();

          const bookingId = data.bookingId;
          const bookedRoomsDetails = data.rooms
            .map(
              (room) =>
                `Room Number: ${room.dormitory_id}, Bed Number: ${room.room_id}`
            )
            .join("<br>");

          document.getElementById("bookingId").innerText = bookingId;
          document.getElementById("checkInDetails").innerText = checkInDate;
          document.getElementById("checkOutDetails").innerText = checkOutDate;
          document.getElementById("bookedRoomsList").innerHTML =
            bookedRoomsDetails;

          const successModal = new bootstrap.Modal(
            document.getElementById("bookingSuccessModal")
          );
          successModal.show();
        } else {
          alert(`Booking failed: ${data.message}`);
        }
      } catch (error) {
        hideLoader();
        console.error("Error occurred while booking rooms:", error);
        alert(
          "An error occurred while processing your booking. Please try again later."
        );
      }
    });
});
