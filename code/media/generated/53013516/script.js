// script.js

// Game logic
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let winner = null;

// Score tracking
let scoreX = 0;
let scoreO = 0;

// Function to handle a cell click
function cellClick(index) {
    // Placeholder for cell click logic
}

// Function to check for a winner
function checkWinner() {
    // Placeholder for win checking logic
}

// Function to update the score
function updateScore() {
    // Placeholder for score updating logic
}

// Function to reset the game
function resetGame() {
    // Placeholder for game reset logic
}

// Add event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(index));
});

// Add event listener to reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

//Winner modal
const modal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const closeButton = document.getElementsByClassName('close-button')[0];

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});