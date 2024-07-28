import {API} from './gate.js'

let slideIndexes = {};
const BOOKING_FORM = document.getElementById("booking-form")
const BOOKING_ERR = document.getElementById("err-msg")

// WILLIAM
if (BOOKING_FORM !== null)
BOOKING_FORM.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const urlParams = new URLSearchParams(window.location.search);
    let randkey = Math.random();
    let response = await API.booking_create({
        f_name: data.get("f_name"),
        l_name: data.get("l_name"),
        address_1: data.get("address_1"), 
        address_2: data.get("address_2"), 
        city: data.get("city"), 
        state: data.get("state"), 
        zip_code: data.get("zip_code"), 
        phone: data.get("phone"), 
        email: data.get("email"), 
        check_in: urlParams.get("check_in"), 
        check_out: urlParams.get("check_out"), 
        checkin_key: `${urlParams.get("room_id")}-${randkey}`,
        room_id: Number(urlParams.get("room_id"))
    });

    if (response["success"])
        display_popup(`${urlParams.get("room_id")}-${randkey}`)
    else {
        console.log(response)
        BOOKING_ERR.innerText = response["msg"];
    }
})

function display_popup(key) {
    document.getElementById("popup-message").style.display = "block";
    navigator.clipboard.writeText(key)
}

// Function to close the popup message
function closePopup() {
    document.getElementById('popup-message').style.display = 'none';
    window.location.href = 'index.html';
}

document.getElementById("close-x")?.addEventListener("click", closePopup)
document.getElementById("ok-button")?.addEventListener("click", closePopup)

// SAGAR

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

    // Room Listing Dropdown Content
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function() {
            const dropdownContent = this.nextElementSibling;
            const isVisible = dropdownContent && dropdownContent.style.display === 'block';
            if (dropdownContent) {
                dropdownContent.style.display = isVisible ? 'none' : 'block';
                this.innerHTML = isVisible ? 'Amenities and Details &#9660;' : 'Amenities and Details &#9650;';
            }
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

    // Slideshow for main page
    let slideIndex = 0;
    function showMainSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        if (slides.length === 0 || dots.length === 0) {
            return; // Exit if there are no slides or dots
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
        setTimeout(showMainSlides, 2000); // Change image every 2 seconds
    }
    showMainSlides();

    // Reservation form submission and popup message (Reservation Page)
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            sessionStorage.setItem("first_name", document.getElementById('first-name').value);
            sessionStorage.setItem("booking_id", document.getElementById('booking-id').value);

            // Redirect to manage-reservation.html with query parameters
            window.location.href = `manage-reservation.html`;
        });
    }

    // Reservation management buttons (Manage Reservation Page)
    const cancelReservationBtn = document.getElementById('cancel-reservation-btn');

    if (cancelReservationBtn) {
        cancelReservationBtn.addEventListener('click', async () => {
            await API.user_booking_delete(sessionStorage.getItem("first_name"), sessionStorage.getItem("booking_id"));
            window.location.href = `index.html`;
        });
    }
});





// Function to toggle dropdown content
function toggleDropdown(button) {
    const dropdownContent = button.nextElementSibling;
    const isVisible = dropdownContent && dropdownContent.style.display === 'block';
    if (dropdownContent) {
        dropdownContent.style.display = isVisible ? 'none' : 'block';
        button.innerHTML = isVisible ? 'Amenities and Details &#9660;' : 'Amenities and Details &#9650;';
    }
}

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
    console.log("moveslide");
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

