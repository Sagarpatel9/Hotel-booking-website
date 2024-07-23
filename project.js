let slideIndexes = {};

document.addEventListener('DOMContentLoaded', function () {
    // Top Navigation and Active Link
    const nav = document.querySelector('.top-nav');
    const videoSection = document.querySelector('.background-video');
    const navLinks = document.querySelectorAll('.nav-link');
    const homeLink = document.getElementById('home-link');

    if (videoSection) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > videoSection.offsetHeight) {
                document.body.classList.add('sticky-nav');
            } else {
                document.body.classList.remove('sticky-nav');
            }
        });
    }

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
            event.preventDefault(); // Prevent the form from submitting normally

            // Get the name value from the form
            const name = document.getElementById('name').value;

            // Display the popup message
            alert('Thank you, ' + name + '! Your form has been submitted.');

            // Optionally, clear the form fields if needed
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
});

// Define showSlides globally
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

// Define moveSlide globally
function moveSlide(n, sliderId) {
    slideIndexes[sliderId] += n;
    showSlides(sliderId);
}

// Define toggleDropdown globally
function toggleDropdown(button) {
    const dropdownContent = button.nextElementSibling;
    const isVisible = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isVisible ? 'none' : 'block';
    button.innerHTML = isVisible ? 'Amenities and Details &#9660;' : 'Amenities and Details &#9650;';
}




