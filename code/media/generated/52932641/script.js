// Initialize the game
const board = document.querySelector('.board');
const resetButton = document.getElementById('reset-button');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Points = 0;
let player2Points = 0;

// Function to handle player turn
function handleTurn(cell, index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWin();
        switchPlayer();
    }
}

// Function to switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to check win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            updateScore();
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
    }
}

// Function to update score
function updateScore() {
    if (currentPlayer === 'X') {
        player1Points++;
        player1Score.textContent = player1Points;
    } else {
        player2Points++;
        player2Score.textContent = player2Points;
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    // Clear the board
    const cells = document.querySelectorAll('.board div');
    cells.forEach(cell => cell.textContent = '');
}

// Event listeners
resetButton.addEventListener('click', resetGame);

// Add cells to the board
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('click', () => handleTurn(cell, i));
    board.appendChild(cell);
}

// Placeholder for future JavaScript enhancements