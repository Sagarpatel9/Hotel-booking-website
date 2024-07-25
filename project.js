let slideIndexes = {};

document.addEventListener('DOMContentLoaded', function () {
    // Top Navigation and Active Link
    const nav = document.querySelector('.top-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const homeLink = document.getElementById('home-link');

    function setActiveLink() {
        const path = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function redirectToHome(event) {
        event.preventDefault();
        window.location.href = 'index.html';
    }

    if (homeLink) {
        homeLink.addEventListener('click', redirectToHome);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    setActiveLink();

    // Contact Us Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            alert('Thank you, ' + name + '! Your form has been submitted.');
            this.reset();
        });
    }

    // Room Listing Dropdown Content
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function() {
            const dropdownContent = this.nextElementSibling;
            const isVisible = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isVisible ? 'none' : 'block';
            this.innerHTML = isVisible ? 'Amenities and Details &#9660;' : 'Amenities and Details &#9650;';
        });
    });

    // Room Image Sliders
    function initializeSliders() {
        const sliders = document.querySelectorAll('.room-image-slider');
        sliders.forEach(slider => {
            const sliderId = slider.id;
            slideIndexes[sliderId] = 0;
            showSlides(sliderId);
        });
    }

    initializeSliders();

    // Reservation form submission and popup message (Reservation Page)
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const lastName = document.getElementById('last-name').value;
            const bookingId = document.getElementById('booking-id').value;

            // Store last name and booking ID in session storage
            sessionStorage.setItem('lastName', lastName);
            sessionStorage.setItem('bookingId', bookingId);

            // Redirect to manage-reservation.html with query parameters
            window.location.href = `manage-reservation.html?lastName=${encodeURIComponent(lastName)}&bookingId=${encodeURIComponent(bookingId)}`;
        });
    }

    // Reservation management buttons (Manage Reservation Page)
    const viewReservationBtn = document.getElementById('view-reservation-btn');
    const cancelReservationBtn = document.getElementById('cancel-reservation-btn');

    if (viewReservationBtn) {
        viewReservationBtn.addEventListener('click', function() {
            const lastName = sessionStorage.getItem('lastName');
            const bookingId = sessionStorage.getItem('bookingId');
            alert(`Viewing reservation for ${lastName} with Booking ID: ${bookingId}`);
        });
    }

    if (cancelReservationBtn) {
        cancelReservationBtn.addEventListener('click', function() {
            const lastName = sessionStorage.getItem('lastName');
            const bookingId = sessionStorage.getItem('bookingId');
            alert(`Cancelling reservation for ${lastName} with Booking ID: ${bookingId}`);
        });
    }

    // Save last name and booking ID in session storage when the user accesses this page
    const urlParams = new URLSearchParams(window.location.search);
    const lastName = urlParams.get('lastName');
    const bookingId = urlParams.get('bookingId');
    if (lastName && bookingId) {
        sessionStorage.setItem('lastName', lastName);
        sessionStorage.setItem('bookingId', bookingId);
    }
});

// Function to show slides
function showSlides(sliderId) {
    const slides = document.querySelectorAll(`#${sliderId} .slide`);
    if (slideIndexes[sliderId] >= slides.length) {
        slideIndexes[sliderId] = 0;
    }
    if (slideIndexes[sliderId] < 0) {
        slideIndexes[sliderId] = slides.length - 1;
    }
    const offset = -slideIndexes[sliderId] * 100;
    document.querySelector(`#${sliderId} .slider`).style.transform = `translateX(${offset}%)`;
}

// Function to move slides
function moveSlide(n, sliderId) {
    slideIndexes[sliderId] += n;
    showSlides(sliderId);
}

// Function to toggle dropdown content
function toggleDropdown(button) {
    const dropdownContent = button.nextElementSibling;
    const isVisible = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isVisible ? 'none' : 'block';
    button.innerHTML = isVisible ? 'Amenities and Details &#9660;' : 'Amenities and Details &#9650;';
}

// Function to close the popup message
function closePopup() {
    document.getElementById('popup-message').style.display = 'none';
    window.location.href = 'index.html';
}

// Function to confirm the booking
function confirmBooking() {
    document.getElementById('popup-message').style.display = 'none';
    window.location.href = 'index.html';
}

// Function to copy booking ID to clipboard
function copyCodeClipboard(booking_id) {
    navigator.clipboard.writeText(booking_id);
}

