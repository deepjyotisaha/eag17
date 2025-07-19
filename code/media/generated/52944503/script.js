
// script.js

// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameWon = false;

// DOM elements (Update these selectors if HTML changes)
const boardElement = document.querySelector('.board'); // Selector for the game board
const resetButton = document.getElementById('reset-button'); // Selector for the reset button
const playerXScoreElement = document.getElementById('player-x-score'); // Selector for Player X's score
const playerOScoreElement = document.getElementById('player-o-score'); // Selector for Player O's score

// Initialize scores
let playerXScore = 0;
let playerOScore = 0;

// Function to check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameWon = true;
            return board[a]; // Return the winning player (X or O)
        }
    }
    return null; // No winner yet
}

// Function to check for a tie
function checkTie() {
    return !board.includes(''); // If there are no empty cells, it's a tie
}

// Function to handle a player's turn
function handleTurn(cellIndex) {
    if (board[cellIndex] === '' && !gameWon) {
        board[cellIndex] = currentPlayer;
        renderBoard();

        const winner = checkWin();
        if (winner) {
            // Update scores based on the winner
            if (winner === 'X') {
                playerXScore++;
                playerXScoreElement.textContent = playerXScore;
            } else {
                playerOScore++;
                playerOScoreElement.textContent = playerOScore;
            }
            alert(`Player ${winner} wins!`);
            resetBoard();
        } else if (checkTie()) {
            alert('It's a tie!');
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Function to render the game board
function renderBoard() {
    boardElement.innerHTML = ''; // Clear the board
    for (let i = 0; i < board.length; i++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = i;
        cellElement.textContent = board[i];
        cellElement.addEventListener('click', () => handleTurn(i));
        boardElement.appendChild(cellElement);
    }
}

// Function to reset the game board
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameWon = false;
    currentPlayer = 'X';
    renderBoard();
}

// Event listener for the reset button
resetButton.addEventListener('click', resetBoard);

// Initial board render
renderBoard();

// Placeholder for scoring logic

// Placeholder for reset functionality

