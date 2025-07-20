
// script.js
const cells = document.querySelectorAll('.cell');
const playerIndicator = document.querySelector('.player-indicator');
const resetButton = document.querySelector('.reset-button');
const scoreDisplay = document.querySelector('.score-display');
const winnerModal = document.getElementById('winnerModal');
const winnerName = document.getElementById('winnerName');
const playAgainButton = document.getElementById('resetButton');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xScore = 0;
let oScore = 0;

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

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleMove(clickedCell, clickedCellIndex);
    checkResult();
}

function handleMove(clickedCell, clickedCellIndex) {
    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerIndicator.textContent = `Player ${currentPlayer}'s Turn`;
}

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
        updateScore();
        showWinnerModal();
        gameActive = false;
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        playerIndicator.textContent = 'Draw!';
        gameActive = false;
        showWinnerModal(true);
        return;
    }

    changePlayer();
}

function updateScore() {
    if (currentPlayer === 'X') {
        xScore++;
    } else {
        oScore++;
    }
    scoreDisplay.textContent = `X: ${xScore} | O: ${oScore}`;
}

function handleResetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playerIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => cell.textContent = '');
    hideWinnerModal();
}

function showWinnerModal(draw = false) {
    if (draw) {
        winnerName.textContent = 'It's a draw!';
    } else {
        winnerName.textContent = `Player ${currentPlayer} wins!`;
    }
    winnerModal.classList.remove('hidden');
}

function hideWinnerModal() {
    winnerModal.classList.add('hidden');
}

cells.forEach((cell, index) => {
    cell.dataset.cellIndex = index;
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', handleResetGame);
playAgainButton.addEventListener('click', handleResetGame);


