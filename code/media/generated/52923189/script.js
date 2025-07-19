
// Initialize the game board
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

// Function to handle a player's move
function handleMove(cellIndex) {
    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        document.getElementsByClassName('cell')[cellIndex].innerText = currentPlayer;
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
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            alert('Player ' + board[a] + ' wins!');
            // Update Score will be here
            return;
        }
    }

    // Check for a draw
    if (!board.includes('')) {
        gameActive = false;
        alert('It's a draw!');
    }
}

// Add event listeners to each cell
let cells = document.getElementsByClassName('cell');
for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', () => handleMove(i));
}

// Reset Functionality will be here



// Timer functionality
// PLACEHOLDER FOR TIMER FUNCTION

// Scorekeeping
// PLACEHOLDER FOR SCOREKEEPING

// Reset Functionality
// PLACEHOLDER FOR RESET FUNCTION