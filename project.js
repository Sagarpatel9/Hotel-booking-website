
/*top-nav*/
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.top-nav');
  const videoSection = document.querySelector('.background-video');
  
  window.addEventListener('scroll', function () {
    if (window.scrollY > videoSection.offsetHeight) {
      document.body.classList.add('sticky-nav');
    } else {
      document.body.classList.remove('sticky-nav');
    }
  });
});





/*contact-us*/
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('contactForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting normally

      // Get the name value from the form
      var name = document.getElementById('name').value;

      // Display the popup message
      alert('Thank you, ' + name + '! Your form has been submitted.');

      // Optionally, clear the form fields if needed
      this.reset();
  });
});




/*room lisitng drop down content*/

function toggleDropdown(button) {
  const dropdownContent = button.nextElementSibling;
  const isVisible = dropdownContent.style.display === 'block';
  dropdownContent.style.display = isVisible ? 'none' : 'block';
  button.innerHTML = isVisible ? 'Amenities and Details &#9660;' : 'Amenities and Details &#9650;';
}



/*room image slides*/

let slideIndexes = {};

// Function to initialize sliders
function initializeSliders() {
    const sliders = document.querySelectorAll('.room-image-slider');
    sliders.forEach(slider => {
        const sliderId = slider.id;
        slideIndexes[sliderId] = 0;
        showSlides(sliderId);
    });
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
}

// Initialize all sliders once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeSliders);
