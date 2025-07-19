// Initialize game variables
let player1Score = 0;
let player2Score = 0;
let timer;
let timeLeft = 10;
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameWon = false;
let moveCount = 0;

// Get references to HTML elements
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const timerDisplay = document.getElementById('timer');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

// Add click event listener to each cell
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Add click event listener to the reset button
resetButton.addEventListener('click', resetBoard);

// Handle cell click event
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] === '' && !gameWon) {
        // Update the board and cell with the current player's move
        board[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer === 'X' ? 'x' : 'o');
        moveCount++;

        // Check if the game is won or tied
        if (checkWin()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            gameWon = true;
            // SCORE_PLACEHOLDER
        } else if (moveCount === 9) {
            message.textContent = 'Tie game!';
            gameWon = true;
        } else {
            // Switch to the other player's turn
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
            resetTimer();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
            // TIMER_PLACEHOLDER
        }
    }
}

// Check if the current player has won
// Function to check the Win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight winning cells
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');

            // Update Score
            if (currentPlayer === 'X') {
                player1Score++;
                player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
            } else {
                player2Score++;
                player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
            }
            if (player1Score >= 3) {
                endGame('Player 1 wins!');
                return true;
            } else if (player2Score >= 3) {
                endGame('Player 2 wins!');
                return true;
            }
            return true;
        }
    }
    return false;
}

// Function to check the Win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight winning cells
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');

            // Update Score
            if (currentPlayer === 'X') {
                player1Score++;
                player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
            } else {
                player2Score++;
                player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
            }
            if (player1Score >= 3) {
                endGame('Player 1 wins!');
                return true;
            } else if (player2Score >= 3) {
                endGame('Player 2 wins!');
                return true;
            }
            if (currentPlayer === 'X') {
                player1Score++;
                player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
            } else {
                player2Score++;
                player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
            }
            if (player1Score >= 3) {
                endGame('Player 1 wins!');
                return true;
            } else if (player2Score >= 3) {
                endGame('Player 2 wins!');
                return true;
            }
            return true;
        }
    }
    return false;
}

// Function to check the Win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Update Score
            if (currentPlayer === 'X') {
                player1Score++;
                player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
            } else {
                player2Score++;
                player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
            }
            if (player1Score >= 3) {
                endGame('Player 1 wins!');
                return true;
            } else if (player2Score >= 3) {
                endGame('Player 2 wins!');
                return true;
            }
            if (currentPlayer === 'X') {
                player1Score++;
                player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
            } else {
                player2Score++;
                player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
            }
            if (player1Score >= 3) {
                endGame('Player 1 wins!');
                return true;
            } else if (player2Score >= 3) {
                endGame('Player 2 wins!');
                return true;
            }
            if (currentPlayer === 'X') {
                player1Score++;
                player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
            } else {
                player2Score++;
                player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
            }
            return true;
        }
    }
    return false;
}

// Function to check the Win
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

// Reset the board
// Function to reset the board
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameWon = false;
    moveCount = 0;
    message.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    resetTimer();
    document.getElementById('gameboard').style.display = 'grid';
    document.getElementById('message').style.display = 'block';
    // Remove winning cell styles
    cells.forEach(cell => cell.classList.remove('winning-cell'));
}

// Function to reset the board
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameWon = false;
    moveCount = 0;
    message.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    resetTimer();
    document.getElementById('gameboard').style.display = 'grid';
    document.getElementById('message').style.display = 'block';
}

// Function to reset the board
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameWon = false;
    moveCount = 0;
    message.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    resetTimer();
}

// Function to reset the board
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameWon = false;
    moveCount = 0;
    message.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    // TIMER_PLACEHOLDER
}

// Initialize the game
message.textContent = `Player ${currentPlayer}'s turn`;

function startTimer() {
    timeLeft = 10;
    timerDisplay.textContent = `Time Remaining: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Remaining: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Switch players when time runs out
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Time is up! Player ${currentPlayer}'s turn`;
            resetTimer();
            // Disable current player's move
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            setTimeout(() => {
                cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            }, 2000);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

// Start timer when page loads

function endGame(winner) {
    clearInterval(timer);
    document.getElementById('gameboard').style.display = 'none';
    message.textContent = winner;
    message.style.display = 'block';
}

// Start timer when page loads

function endGame(winner) {
    clearInterval(timer);
    document.getElementById('gameboard').style.display = 'none';
    message.textContent = winner;
    message.style.display = 'block';
}

// Start timer when page loads

function endGame(winner) {
    clearInterval(timer);
    document.getElementById('gameboard').style.display = 'none';
    message.textContent = winner;
    message.style.display = 'block';
}

// Start timer when page loads

startTimer();
message.textContent = `Player ${currentPlayer}'s turn`;