
// JavaScript Logic
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

const cells = document.querySelectorAll('.cell');
const playerXScoreSpan = document.getElementById('player-x-score');
const playerOScoreSpan = document.getElementById('player-o-score');
const resetButton = document.getElementById('reset-button');

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

// Function to check the game result
function checkResult() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

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
        if (currentPlayer === 'X') {
            playerXScore++;
            playerXScoreSpan.textContent = playerXScore;
        } else {
            playerOScore++;
            playerOScoreSpan.textContent = playerOScore;
        }
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        return;
    }

    switchPlayer();
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
}

// Add event listeners to the cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Add event listener to the reset button
resetButton.addEventListener('click', resetGame);

// Initial score display
playerXScoreSpan.textContent = playerXScore;
playerOScoreSpan.textContent = playerOScore;

// Modal Logic
const winnerModal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const closeModalButton = document.getElementById('close-modal');

function showWinnerModal(winner) {
    winnerMessage.textContent = winner ? winner + ' wins!' : 'It's a draw!';
    winnerModal.classList.remove('hidden');
}

closeModalButton.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    resetGame();
});

// Modify checkResult function to call showWinnerModal
function checkResult() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

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
        if (currentPlayer === 'X') {
            playerXScore++;
            playerXScoreSpan.textContent = playerXScore;
        } else {
            playerOScore++;
            playerOScoreSpan.textContent = playerOScore;
        }
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        showWinnerModal(null);
        return;
    }

    switchPlayer();
}
