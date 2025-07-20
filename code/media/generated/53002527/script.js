const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const player1ScoreSpan = document.getElementById('player1-score');
const player2ScoreSpan = document.getElementById('player2-score');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Score = 0;
let player2Score = 0;

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

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}

function handleResultValidation() {
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
        handleWin();
        gameActive = false;
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        handleDraw();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleWin() {
    if (currentPlayer === 'X') {
        player1Score++;
        player1ScoreSpan.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreSpan.textContent = player2Score;
    }
    alert(`Player ${currentPlayer} wins!`);
}

function handleDraw() {
    alert(`It's a draw!`);
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function handleResetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach((cell, index) => {
    cell.dataset.cellIndex = index;
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', handleResetGame);