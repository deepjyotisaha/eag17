
const cells = document.querySelectorAll('.cell');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const resetButton = document.getElementById('reset-button');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const player1NameDisplay = document.getElementById('player1-name-display');
const player2NameDisplay = document.getElementById('player2-name-display');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Points = 0;
let player2Points = 0;
let timeLeft = 10;
let timerInterval;

function startGame() {
    player1NameDisplay.textContent = player1NameInput.value || 'Player 1';
    player2NameDisplay.textContent = player2NameInput.value || 'Player 2';
    resetGame();
}

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        checkWinner();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    resetTimer();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            updateScore();
            clearInterval(timerInterval);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        clearInterval(timerInterval);
    }
}

function checkGameWinner() {
    if (player1Points >= 3) {
        gameActive = false;
        clearInterval(timerInterval);
        alert(player1NameDisplay.textContent + ' wins the game!');
        resetAll();
    } else if (player2Points >= 3) {
        gameActive = false;
        clearInterval(timerInterval);
        alert(player2NameDisplay.textContent + ' wins the game!');
        resetAll();
    }
}

function updateScore() {
    if (currentPlayer === 'X') {
        player1Points++;
        player1Score.textContent = player1Points;
    } else {
        player2Points++;
        player2Score.textContent = player2Points;
    }
    checkGameWinner();
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    resetTimer();
    startGame();
}

function resetAll() {
    player1Points = 0;
    player2Points = 0;
    player1Score.textContent = player1Points;
    player2Score.textContent = player2Points;
    resetGame();
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    progressBar.value = timeLeft;

    if (timeLeft <= 0) {
        checkWinner();
        switchPlayer();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    timerDisplay.textContent = timeLeft;
    progressBar.value = timeLeft;
    timerInterval = setInterval(updateTimer, 1000);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetAll);

startGame();
