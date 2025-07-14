
// Collapsable Sidebar
const sidebar = document.querySelector('.sidebar');
const chatWindow = document.querySelector('.chat-window');
const toggleButton = document.createElement('button');
toggleButton.textContent = '☰'; // Hamburger icon
toggleButton.classList.add('sidebar-toggle');

// Insert the toggle button before the sidebar
sidebar.parentNode.insertBefore(toggleButton, sidebar);

toggleButton.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    chatWindow.classList.toggle('expanded');
});

// Scrollable Chat Window
const messagesDiv = document.getElementById('messages');

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Call scrollToBottom whenever a new message is added
const observer = new MutationObserver(scrollToBottom);

observer.observe(messagesDiv, { childList: true });

// Ensure scroll to bottom on initial load
scrollToBottom();


/* Example of adding a message (for testing):
function addMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
}

// Simulate new messages every 2 seconds
setInterval(() => {
    addMessage(\`New message \${Math.random()}\`);
}, 2000);
*/

