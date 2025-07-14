// script.js

document.addEventListener('DOMContentLoaded', function() {
  // Lazy loading for images
  let lazyImages = document.querySelectorAll('img[data-src]');

  function lazyLoad() {
    lazyImages.forEach(img => {
      if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0 && getComputedStyle(img).display !== 'none') {
        img.src = img.dataset.src;
        img.onload = function() {
          img.removeAttribute('data-src');
        }
      }
    });
  }

  // Initial lazy load and attach to scroll event
  lazyLoad();
  document.addEventListener('scroll', lazyLoad);
  document.addEventListener('resize', lazyLoad);

  // Background image preloading for hero section
  let heroSection = document.querySelector('.hero');
  if (heroSection) {
    let imageUrl = getComputedStyle(heroSection).backgroundImage.replace('url("', '').replace('")', '').replace('url(', '').replace(')', '').replace(/"/g,"");
    if (imageUrl !== 'none') {
        let preloader = new Image();
        preloader.src = imageUrl;
        preloader.onload = function() {
          heroSection.style.backgroundImage = `url('${imageUrl}')`;
        };
    }
  }

  // Form submission handling for contact.html
  let contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Basic form validation (example)
      let name = document.getElementById('name').value;
      let email = document.getElementById('email').value;
      let message = document.getElementById('message').value;

      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      // Simulate form submission (replace with actual submission logic)
      setTimeout(function() {
        alert('Form submitted successfully!');
        contactForm.reset();
      }, 500);
    });
  }
});
