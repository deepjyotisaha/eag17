// Function to detect and apply dark mode based on system preference
function applyDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// Apply dark mode on page load
applyDarkMode();

// Listen for changes in system preference and update the theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  const newColorScheme = event.matches ? "dark" : "light";
  document.documentElement.setAttribute('data-theme', newColorScheme);
});

// Example of a simple form validation (replace with your actual form)
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', function(event) {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !emailInput.checkValidity()) {
      alert('Please enter a valid email address.');
      event.preventDefault(); // Prevent form submission
    }
  });
}

// Responsive navigation (example - adapt to your specific navigation)
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
}


//CDN compatibility (assuming jquery for simplicity)
//Check to see if Jquery is loaded, if not load it through CDN
if (typeof jQuery == 'undefined'){
	var headTag = document.getElementsByTagName("head")[0];
	var jqTag = document.createElement('script');
	jqTag.type = 'text/javascript';
	jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
	jqTag.onload = afterJQueryLoaded;
	headTag.appendChild(jqTag);
} else {
    afterJQueryLoaded()
}

function afterJQueryLoaded(){
    console.log('Jquery is loaded, can execute code here.')
}