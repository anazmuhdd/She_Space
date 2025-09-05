// Function to fetch and display bookings
async function fetchBookings() {
    const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage
    if (!userId) {
        console.error('User ID not found in localStorage');
        alert('You need to log in first.');
        return;
    }

    try {
        const response = await fetch(`/api/${userId}`, { method: 'GET' });
        const data = await response.json();

        if (response.ok && data.success) {
            console.log('Bookings fetched:', data);
            populateBookings('pastBookings', data.pastBookings || []);
            populateBookings('existingBookings', data.upcomingBookings || [], true);
            populateBookings('cancelledBookings', data.cancelledBookings || []);
        } else {
            console.error('Failed to fetch bookings:', data.message);
            alert(`Error fetching bookings: ${data.message}`);
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Unable to fetch bookings. Please try again later.');
    }
}

// Populate bookings into the respective accordion sections
function populateBookings(sectionId, bookings, includeCancel = false) {
    const section = document.querySelector(`#${sectionId} .list-group`);
    section.innerHTML = '';

    if (bookings.length === 0) {
        section.innerHTML = '<li class="list-group-item">No bookings found</li>';
        return;
    }

    bookings.forEach((booking) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = `Booking ID: ${booking.booking_id} | Room: ${booking.type} | Dates: ${new Date(booking.check_in).toLocaleDateString()} to ${new Date(booking.check_out).toLocaleDateString()}`;

        if (includeCancel) {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'btn btn-cancel btn-sm';
            cancelButton.textContent = 'Cancel';
            cancelButton.onclick = () => cancelBooking(booking.booking_id);
            listItem.appendChild(cancelButton);
        }

        section.appendChild(listItem);
    });
}

// Function to cancel a booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const response = await fetch(`/api/cancel`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Booking cancelled successfully.');
            fetchBookings(); // Refresh bookings
        } else {
            console.error('Failed to cancel booking:', data.message);
            alert(`Failed to cancel booking: ${data.message}`);
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
    }
}

// Initialize the page by fetching bookings
document.addEventListener('DOMContentLoaded', fetchBookings);
