
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('hotel-search-form');
  const searchResults = document.getElementById('search-results');

  // Function to show a specific section by ID
  function showSection(sectionId) {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
          section.classList.remove('active');
      });
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
          targetSection.classList.add('active');
      }
  }

  // Initialize by showing the 'home' section
  showSection('home');

  // Handle navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent default anchor behavior
          const targetSectionId = link.getAttribute('href').slice(1);
          showSection(targetSectionId);
      });
  });

  // Handle BOOK NOW link
  const bookNowLink = document.querySelector('.book-now .nav-link');
  if (bookNowLink) {
      bookNowLink.addEventListener('click', function(e) {
          e.preventDefault();
          const targetSectionId = bookNowLink.getAttribute('href').slice(1);
          showSection(targetSectionId);
      });
  }

  // Handle form submission
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Simulate fetching data (replace with actual API call)
      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      const rooms = document.getElementById('rooms').value;
      const guests = document.getElementById('guests').value;

      // Simulate fetching data (replace with actual API call)
      setTimeout(function() {
          const results = [
              { roomType: 'Standard Room', description: 'Cozy room with queen-size bed', price: '$100/night' },
              { roomType: 'Deluxe Room', description: 'Spacious room with king-size bed', price: '$150/night' },
              { roomType: 'Suite', description: 'Luxurious room with king-size bed and living area', price: '$250/night' }
          ];

          displaySearchResults(results);
      }, 1000); // Simulate delay

      function displaySearchResults(results) {
          const roomList = document.getElementById('room-list');
          roomList.innerHTML = '';

          results.forEach(function(room) {
              const li = document.createElement('li');
              li.innerHTML = `
                  <h3>${room.roomType}</h3>
                  <p>${room.description}</p>
                  <p>${room.price}</p>
              `;
              roomList.appendChild(li);
          });

          searchResults.style.display = 'block'; // Show the search results section
      }
  });
});

















