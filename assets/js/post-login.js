document.addEventListener('DOMContentLoaded', () => {
  // Initialize Flatpickr
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

  // Show available rooms popup
  const showRoomsBtn = document.getElementById("showRooms");
  const availableRoomsPopup = new bootstrap.Modal(document.getElementById("availableRoomsPopup"));

  showRoomsBtn.addEventListener("click", () => {
    availableRoomsPopup.show();
  });

  // Update room options dynamically
  const roomType = document.getElementById("roomType");
  const roomOrBed = document.getElementById("roomOrBed");
  const rentType = document.getElementById("rentType");
  const duration = document.getElementById("duration");

  roomType.addEventListener("change", () => {
    let options = [];
    const selectedRoom = roomType.value;

    if (selectedRoom === "Dormitory") {
      options = [1, 2, 3, 4, 5, 6, 7, 8];
    } else {
      options = [1, 2];
    }

    roomOrBed.innerHTML = "";
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = `${option} ${selectedRoom === "Dormitory" ? "Bed(s)" : "Room(s)"}`;
      roomOrBed.appendChild(optionElement);
    });
    rentType.dispatchEvent(new Event("change"));
  });

  rentType.addEventListener("change", () => {
    let options = [];
    const selectedRentType = rentType.value;

    if (selectedRentType === "Days") {
      options = [1, 2, 3, 4, 5, 6, 7];
    } else {
      options = [2, 4, 6, 8];
    }

    duration.innerHTML = "";
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = `${option} ${selectedRentType}`;
      duration.appendChild(optionElement);
    });
  });

  // Trigger initial updates
  roomType.dispatchEvent(new Event("change"));
  rentType.dispatchEvent(new Event("change"));
});
