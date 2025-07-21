/*
Tic Tac Toe Game Logic
*/

// Game board
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

// HTML elements
const boardElement = document.getElementById('gameboard');
const cells = document.querySelectorAll('.cell');
const winnerMessage = document.getElementById('winnerMessage');
const winnerName = document.getElementById('winnerName');
const winnerModal = document.getElementById('winner-modal');
const playerXScoreElement = document.getElementById('player-x-score');
const playerOScoreElement = document.getElementById('player-o-score');
const resetButton = document.getElementById('reset-button');
const closeModalButton = document.getElementById('close-modal');

// Winning conditions
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

// Function to handle a player's move
function handleMove(cellIndex) {
    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        cells[cellIndex].textContent = currentPlayer;
        cells[cellIndex].classList.add(currentPlayer === 'X' ? 'player-x' : 'player-o');
        checkWin();
        checkDraw();
        switchPlayer();
    }
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to check for a win
function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinnerCells(a, b, c);
            showWinnerModal(currentPlayer);
            updateScore(currentPlayer);
            return;
        }
    }
}

// Function to highlight the winning cells
function highlightWinnerCells(a, b, c) {
    cells[a].classList.add('winner-cell');
    cells[b].classList.add('winner-cell');
    cells[c].classList.add('winner-cell');
}

// Function to check for a draw
function checkDraw() {
    if (!board.includes('') && gameActive) {
        gameActive = false;
        showWinnerModal('Draw!');
    }
}

// Function to update the score
function updateScore(player) {
    if (player === 'X') {
        playerXScore++;
        playerXScoreElement.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreElement.textContent = playerOScore;
    }
}

// Function to show the winner modal
function showWinnerModal(winner) {
    winnerName.textContent = winner === 'Draw!' ? 'It\'s a draw!' : winner + ' wins!';
    winnerModal.classList.remove('hidden');
}

// Function to close the winner modal
function closeModal() {
    winnerModal.classList.add('hidden');
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('player-x', 'player-o', 'winner-cell');
    });

    closeModal();
}

// Event listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleMove(index));
});

resetButton.addEventListener('click', resetGame);
closeModalButton.addEventListener('click', closeModal);