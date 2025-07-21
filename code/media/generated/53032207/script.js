// script.js

// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

// DOM elements
const gameBoardDiv = document.querySelector('.game-board');
const resetButton = document.getElementById('reset-button');
const winnerModal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const closeModalButton = document.getElementById('close-modal');
const playerXScoreSpan = document.getElementById('player-x-score');
const playerOScoreSpan = document.getElementById('player-o-score');

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

// Function to initialize the game board
function initializeGameBoard() {
    gameBoardDiv.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cellIndex = i;
        cell.addEventListener('click', handleCellClick);
        gameBoardDiv.appendChild(cell);
    }
}

// Function to handle a cell click
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
}

// Function to check the result of the game
function checkResult() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];
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
        showWinnerModal(currentPlayer);
        updateScore();
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        showWinnerModal('Draw!');
        return;
    }

    switchPlayer();
}

// Function to switch the player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        playerXScoreSpan.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreSpan.textContent = playerOScore;
    }
}

// Function to show the winner modal
function showWinnerModal(winner) {
    winnerMessage.textContent = winner === 'Draw!' ? 'It\'s a draw!' : `Player ${winner} wins!`;
    winnerModal.classList.remove('hidden');
}

// Function to close the winner modal
function closeModal() {
    winnerModal.classList.add('hidden');
    resetGame();
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    const cells = document.querySelectorAll('.game-board > div');
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

// Event listeners
resetButton.addEventListener('click', resetGame);
closeModalButton.addEventListener('click', closeModal);

// Initialize the game board
initializeGameBoard();