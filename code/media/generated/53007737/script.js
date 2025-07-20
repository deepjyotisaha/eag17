// FUNCTIONALITY_PLACEHOLDER

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(cellIndex) {
    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        document.getElementById('cell-' + cellIndex).innerText = currentPlayer;
        checkWin();
        checkDraw();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            updateScore();
            alert('Player ' + board[a] + ' wins!');
            return;
        }
    }
}

function checkDraw() {
    if (!board.includes('') && gameActive) {
        gameActive = false;
        alert('It\'s a draw!');
    }
}

function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        document.getElementById('playerXScore').innerText = playerXScore;
    } else {
        playerOScore++;
        document.getElementById('playerOScore').innerText = playerOScore;
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.innerText = '');
}

function resetScores() {
    playerXScore = 0;
    playerOScore = 0;
    document.getElementById('playerXScore').innerText = 0;
    document.getElementById('playerOScore').innerText = 0;
    resetBoard();
}

// Event Listeners
document.getElementById('resetGame').addEventListener('click', resetBoard);
document.getElementById('resetScores').addEventListener('click', resetScores);

// Generate Game Board
const gameBoard = document.getElementById('gameBoard');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = 'cell-' + i;
    cell.addEventListener('click', () => handleCellClick(i));
    gameBoard.appendChild(cell);
}