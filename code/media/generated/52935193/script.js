// script.js

// Variables to track the game state
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

// Function to handle a player's move
function handleMove(cellIndex) {
    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        document.querySelector('.cell[data-index="' + cellIndex + '"]').innerText = currentPlayer;
        checkWin();
        switchPlayer();
    }
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('playerTurn').innerText = `Player ${currentPlayer}'s Turn`;
}

// Function to check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            document.getElementById('playerTurn').innerText = `Player ${currentPlayer} wins!`;
            updateScore();
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        document.getElementById('playerTurn').innerText = 'It's a draw!';
    }
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        document.getElementById('playerXScore').innerText = playerXScore;
    } else {
        playerOScore++;
        document.getElementById('playerOScore').innerText = playerOScore;
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('playerTurn').innerText = `Player ${currentPlayer}'s Turn`;
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
}

// Event listeners
document.getElementById('resetButton').addEventListener('click', resetGame);

// Initialize the game board
function initializeBoard() {
    const gameBoardDiv = document.getElementById('gameBoard');
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleMove(index));
    });
}

initializeBoard();
