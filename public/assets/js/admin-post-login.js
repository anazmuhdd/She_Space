document.addEventListener('DOMContentLoaded', () => {
    // Room Management
    const roomForm = document.getElementById('add-room-form');
    const roomsList = document.getElementById('rooms-list');

    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomName = document.getElementById('room-name').value;
        const roomType = document.getElementById('room-type').value;
        const roomTariff = document.getElementById('room-tariff').value;
        const roomAmenities = document.getElementById('room-amenities').value;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `<strong>${roomName}</strong> (${roomType}) - $${roomTariff}/night <br> Amenities: ${roomAmenities}`;
        roomsList.appendChild(listItem);

        roomForm.reset();
    });

    // Staff Management
    const staffForm = document.getElementById('add-staff-form');
    const staffList = document.getElementById('staff-list');

    staffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const staffName = document.getElementById('staff-name').value;
        const staffRole = document.getElementById('staff-role').value;
        const staffContact = document.getElementById('staff-contact').value;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `<strong>${staffName}</strong> - ${staffRole} <br> Contact: ${staffContact}`;
        staffList.appendChild(listItem);

        staffForm.reset();
    });
});
