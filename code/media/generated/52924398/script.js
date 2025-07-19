
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let player1Score = 0;
let player2Score = 0;
let timer;
let timeLeft = 10;
let gameActive = true;
let winner = null;

const boardElement = document.querySelector('.grid');
const timeElement = document.getElementById('time');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');
const resetButton = document.getElementById('reset-button');

function handleMove(cellIndex) {
    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        document.querySelector(`.board-cell[data-cell-index="${cellIndex}"]`).innerText = currentPlayer;
        checkWin();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    timeLeft = 10;
    startTimer();
}

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
            winner = currentPlayer;
            updateScore();
            endGame();
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        winner = 'draw';
        endGame();
    }
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    updateTime();
    timer = setInterval(() => {
        timeLeft--;
        updateTime();
        if (timeLeft < 0) {
            switchPlayer();
        }
    }, 1000);
}

function updateTime() {
    timeElement.innerText = timeLeft;
}

function updateScore() {
    if (winner === 'X') {
        player1Score++;
        player1ScoreElement.innerText = player1Score;
    } else if (winner === 'O') {
        player2Score++;
        player2ScoreElement.innerText = player2Score;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    timeLeft = 10;
    gameActive = true;
    winner = null;
    clearInterval(timer);
    startTimer();
    document.querySelectorAll('.board-cell').forEach(cell => cell.innerText = '');
}

function endGame() {
    clearInterval(timer);
    if (winner === 'draw') {
        alert('It's a draw!');
    } else if (winner) {
        alert(`${winner} wins!`);
    }
}

boardElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('board-cell')) {
        handleMove(event.target.dataset.cellIndex);
    }
});

resetButton.addEventListener('click', resetGame);

startTimer();
