// JavaScript Logic

// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

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

// Function to handle a cell click
function cellClick(cellIndex) {
    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        document.getElementById(`cell-${cellIndex}`).textContent = currentPlayer;
        checkWin();
        switchPlayer();
    }
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to check for a win
function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            highlightWinningCells(a, b, c);
            updateScore();
            showWinnerModal(currentPlayer);
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        showWinnerModal('Draw!');
    }
}

// Function to highlight the winning cells
function highlightWinningCells(a, b, c) {
    document.getElementById(`cell-${a}`).classList.add('winning-cell');
    document.getElementById(`cell-${b}`).classList.add('winning-cell');
    document.getElementById(`cell-${c}`).classList.add('winning-cell');
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        document.getElementById('player-x-score').textContent = playerXScore;
    } else {
        playerOScore++;
        document.getElementById('player-o-score').textContent = playerOScore;
    }
}

// Function to show the winner modal
function showWinnerModal(winner) {
    document.getElementById('winner-message').textContent = winner === 'Draw!' ? winner : `Player ${winner} wins!`;
    document.getElementById('winner-modal').classList.add('show');
}

// Function to close the winner modal
function closeModal() {
    document.getElementById('winner-modal').classList.remove('show');
    resetGame();
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    // Reset the text content of each cell
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell-${i}`).textContent = '';
        document.getElementById(`cell-${i}`).classList.remove('winning-cell');
    }
}

// Add event listeners to each cell
for (let i = 0; i < 9; i++) {
    document.getElementById(`cell-${i}`).addEventListener('click', () => cellClick(i));
}

// Add event listener to the reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

// Add event listener to the close modal button
document.getElementById('close-modal').addEventListener('click', closeModal);
