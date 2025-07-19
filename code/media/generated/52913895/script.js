// script.js

// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let player1Score = 0;
let player2Score = 0;
let timer;
let timeLeft = 10;
let gameActive = true;

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const timeLeftDisplay = document.getElementById('timeLeft');
const messageDisplay = document.getElementById('message');

// Function to generate the board
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

// Function to handle a cell click
function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500'); // Example styling
        checkWin();
        swapPlayer();
        resetTimer();
    }
}

// Function to swap players
function swapPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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
            handleWin(board[a]);
            return;
        }
    }

    if (!board.includes('')) {
        handleDraw();
    }
}

// Function to handle a win
function handleWin(winner) {
    gameActive = false;
    messageDisplay.textContent = `${winner} wins!`;
    if (winner === 'X') {
        player1Score++;
        player1ScoreDisplay.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreDisplay.textContent = player2Score;
    }
    checkGameEnd();
}

// Function to handle a draw
function handleDraw() {
    gameActive = false;
    messageDisplay.textContent = 'It\'s a draw!';
}

// Function to check if the game has ended
function checkGameEnd() {
    if (player1Score === 3) {
        messageDisplay.textContent = 'Player 1 wins the game!';
    } else if (player2Score === 3) {
        messageDisplay.textContent = 'Player 2 wins the game!';
    }
}

// Function to start the timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            swapPlayer();
            resetTimer();
        }
    }, 1000);
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timer);
    timeLeft = 10;
    timeLeftDisplay.textContent = timeLeft;
    startTimer();
}

// Initial setup
createBoard();
startTimer();