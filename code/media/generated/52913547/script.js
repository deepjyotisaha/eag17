// script.js
const gameboard = document.getElementById('gameboard');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

function handleCellClick(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        document.querySelector(`[data-index='${index}']`).innerText = currentPlayer;
        checkWin();
        switchPlayer();
        // PLACEHOLDER_FOR_VISUAL_ENHANCEMENTS
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

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            message.innerText = `Player ${board[a]} wins!`;
            gameActive = false;
            // PLACEHOLDER_FOR_VISUAL_ENHANCEMENTS
            return;
        }
    }

    if (!board.includes('')) {
        message.innerText = 'It\'s a draw!';
        gameActive = false;
        // PLACEHOLDER_FOR_VISUAL_ENHANCEMENTS
    }
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    message.innerText = '';
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
    // PLACEHOLDER_FOR_VISUAL_ENHANCEMENTS
}

restartButton.addEventListener('click', restartGame);

document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});