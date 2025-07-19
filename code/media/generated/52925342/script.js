// Initialize game state
let board = ['', '', '', '', '', '', '', '', ''];
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 'X';
let timerActive = false;
let timeRemaining = 10;
let gameOver = false;
let winner = null;
let gamesPlayed = 0; // New variable to track the number of games played

// DOM elements
const cells = document.querySelectorAll('.cell');
const player1ScoreSpan = document.getElementById('player1-score');
const player2ScoreSpan = document.getElementById('player2-score');
const timerSpan = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');

// Function to handle cell click
function handleCellClick(event) {
    const cellIndex = event.target.dataset.cellIndex;

    if (board[cellIndex] === '' && !gameOver) {
        board[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        // Check for win
        if (checkWin()) {
            winner = currentPlayer;
            gameOver = true;
            updateScore();
            alert(`Player ${currentPlayer} wins!`);
        } else if (checkDraw()) {
            gameOver = true;
            alert('It's a draw!');
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            resetTimer();
        }
    }
}

// Function to check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    return false;
}

// Function to check for a draw
function checkDraw() {
    return !board.includes('');
}

// Function to update the score
function updateScore() {
    if (winner === 'X') {
        player1Score++;
        player1ScoreSpan.textContent = player1Score;
    } else if (winner === 'O') {
        player2Score++;
        player2ScoreSpan.textContent = player2Score;
    }
}

// Function to reset the timer
function resetTimer() {
    timeRemaining = 10;
    timerSpan.textContent = timeRemaining;
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    timerActive = false;
    timeRemaining = 10;
    gameOver = false;
    winner = null;
    gamesPlayed++; // Increment the number of games played

    cells.forEach(cell => {
        cell.textContent = '';
    });

    timerSpan.textContent = timeRemaining;
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);
