
// script.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const modelSelect = document.getElementById('model-select');
    const chatSearch = document.getElementById('chat-search');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('send-button');
    const shareChatButton = document.getElementById('share-chat-button');
    const messagesContainer = document.getElementById('messages');

    // LLM Models
    const llmModels = ['GPT-3.5', 'GPT-4', 'Claude', 'Llama2'];

    // Populate LLM model dropdown
    llmModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });

    // Toggle Sidebar
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // LLM Model Change
    modelSelect.addEventListener('change', function() {
        console.log('Selected model:', this.value);
        // Simulate setting the LLM model
    });

    // Chat Search Filter
    chatSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        // Implement chat search filtering logic here
        console.log('Search term:', searchTerm);
    });

    // Send Message
    sendButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            appendMessage(messageText, 'user');
            messageInput.value = '';
            // Simulate LLM response
            setTimeout(() => {
                appendMessage('This is a simulated LLM response.', 'llm');
            }, 500);
        }
    });

    // Append Message Function
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messageDiv.style.opacity = 0; // Initial opacity
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.5s ease-in-out'; // Add transition
            messageDiv.style.opacity = 1; // Fade in
        }, 10);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
    }

    // Share Chat (Copy link to clipboard)
    shareChatButton.addEventListener('click', function() {
        const chatLink = window.location.href; // Or generate a unique link
        navigator.clipboard.writeText(chatLink)
            .then(() => {
                alert('Chat link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy chat link: ', err);
                alert('Failed to copy chat link. Please try again.');
            });
    });
});
