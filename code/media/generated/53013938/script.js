// script.js

const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const resetButton = document.getElementById('resetButton');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeButton = document.querySelector('.close-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameWon = false;
let xScore = 0;
let oScore = 0;

// Function to handle cell click
function cellClick(index) {
    // Placeholder for future updates
}

// Function to reset the game
function resetGame() {
    // Placeholder for future updates
}

// Event listeners
resetButton.addEventListener('click', resetGame);

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(index));
});

closeButton.addEventListener('click', () => {
    winnerModal.style.display = 'none';
});

// Placeholder for future updates
// Add more game logic here
