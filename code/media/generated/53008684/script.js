// Initialize game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let player1Score = 0;
let player2Score = 0;

// Define winning conditions
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

// Get DOM elements
const boardElement = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');

// Function to handle a cell click
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);

    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500');
        checkResult();
    }
}

// Function to check for a win or a draw
function checkResult() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        if (currentPlayer === 'X') {
            player1Score++;
            
animateScoreUpdate(player1ScoreElement, player1Score);

        } else {
            player2Score++;
            
animateScoreUpdate(player2ScoreElement, player2Score);

        }
        alert(`Player ${currentPlayer} wins!`);
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        gameActive = false;
        alert('It\'s a draw!');
        return;
    }

    switchPlayer();
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-red-500');
    });
}

// Add event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);


function animateScoreUpdate(element, score) {
    let start = 0;
    const duration = 1000; // Animation duration in milliseconds
    const range = score - parseInt(element.textContent);
    const increment = range / (duration / 16); // Divide by 16ms intervals (approx. 60fps)
    let current = parseInt(element.textContent);

    function updateScore() {
        current += increment;
        element.textContent = Math.round(current);
        if (start < duration) {
            start += 16;
            requestAnimationFrame(updateScore);
        } else {
            element.textContent = score;
        }
    }

    updateScore();
}

/* FUTURE_JS_IMPROVEMENTS */