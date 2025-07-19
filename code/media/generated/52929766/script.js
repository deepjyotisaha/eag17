// script.js

// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let player1Score = 0;
let player2Score = 0;

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Get references to the cells and scores
const cells = document.querySelectorAll('.cell');
const player1ScoreSpan = document.getElementById('player1-score');
const player2ScoreSpan = document.getElementById('player2-score');
const resetButton = document.getElementById('reset-button');

// Function to handle a cell click
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const cellIndex = parseInt(clickedCell.dataset.index);

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('selected'); // Add visual feedback

    checkWin();
    checkDraw();
    switchPlayer();
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updatePlayerHighlight(); // Update player highlight
}

// Function to check for a win
function checkWin() {
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            gameActive = false;
            updateScore();
            highlightWinningCells(winCondition);
            setTimeout(resetGame, 1500); // delay the reset by 1.5 seconds
            return;
        }
    }
}

// Function to highlight winning cells
function highlightWinningCells(winCondition) {
    winCondition.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

// Function to check for a draw
function checkDraw() {
    if (!board.includes('') && gameActive) {
        gameActive = false;
        alert("It's a draw!");
    }
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        player1Score++;
        player1ScoreSpan.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreSpan.textContent = player2Score;
    }
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell', 'selected'); // Remove selected class
    });

    updatePlayerHighlight(); // Reset player highlight
}

// Function to update player highlight
function updatePlayerHighlight() {
    if (currentPlayer === 'X') {
        player1ScoreSpan.parentElement.classList.add('current-player');
        player2ScoreSpan.parentElement.classList.remove('current-player');
    } else {
        player2ScoreSpan.parentElement.classList.add('current-player');
        player1ScoreSpan.parentElement.classList.remove('current-player');
    }
}

// Add event listeners to the cells
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Add event listener to the reset button
resetButton.addEventListener('click', resetGame);

// Initialize player highlight
updatePlayerHighlight();

// FUTURE ENHANCEMENTS: Add AI opponent, improve styling