
const gameBoard = document.getElementById('game-board');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let player1Points = 0;
let player2Points = 0;
let gameActive = true;
let timer;
let timeLeft = 10;

function createBoard() {
    gameBoard.innerHTML = '';
    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'text-5xl', 'font-bold', 'text-center', 'cursor-pointer');
        cell.dataset.index = index;
        cell.textContent = value;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500');
        checkWin();
        switchPlayer();
        resetTimer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinner(pattern);
            updateScore();
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        showMessage('It's a draw!');
    }
}

function highlightWinner(pattern) {
    pattern.forEach(index => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.classList.add('winner');
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        player1Points++;
        player1Score.textContent = `Player 1: ${player1Points}`;
    } else {
        player2Points++;
        player2Score.textContent = `Player 2: ${player2Points}`;
    }
    if (player1Points === 3){
        showMessage("Player 1 is the Ultimate Winner!");
    }
    else if (player2Points === 3){
        showMessage("Player 2 is the Ultimate Winner!");
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 10;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            switchPlayer();
            resetTimer();
        }
    }, 1000);
}

function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'text-center', 'text-xl', 'mt-4');
    messageDiv.textContent = message;
    const gameContainer = document.querySelector('.bg-white');
    gameContainer.appendChild(messageDiv);
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    timeLeft = 10;
    clearInterval(timer);
    timerDisplay.textContent = `Time: ${timeLeft}`;
    const messageDiv = document.querySelector('.message');
    if (messageDiv) {
        messageDiv.remove();
    }
    createBoard();
    resetTimer();
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.classList.remove('winner', 'text-blue-500', 'text-red-500');
        cell.textContent = '';
    });
}

resetButton.addEventListener('click', resetGame);

createBoard();
resetTimer();
