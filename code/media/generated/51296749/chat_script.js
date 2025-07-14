
function sendMessage() {
    var input = document.getElementById('messageInput');
    var messageText = input.value;

    if (messageText.trim() !== '') {
        // Create a new message element
        var messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent'); // Add 'sent' class
        messageDiv.textContent = messageText;

        // Append the message to the messages container
        var messagesContainer = document.getElementById('messages');
        messagesContainer.appendChild(messageDiv);

        // Clear the input field
        input.value = '';

        // Simulate receiving a response after a short delay
        setTimeout(function() {
            var responseDiv = document.createElement('div');
            responseDiv.classList.add('message', 'received'); // Add 'received' class
            responseDiv.textContent = 'Response: ' + messageText; // Echo the message
            messagesContainer.appendChild(responseDiv);

            // Scroll to the bottom of the messages container
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500); // 0.5 second delay

        // Scroll to the bottom of the messages container
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Add event listener for the send button
var sendButton = document.querySelector('button');
sendButton.addEventListener('click', sendMessage);

// Add event listener for the input field (on enter key)
var messageInput = document.getElementById('messageInput');
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

