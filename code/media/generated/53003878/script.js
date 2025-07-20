const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const playerXScore = document.getElementById('player-x-score');
const playerOScore = document.getElementById('player-o-score');

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

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        checkGameResult();
        switchPlayer();
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    updateScoreBoard();
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkGameResult() {
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
            xScore++;
        } else {
            oScore++;
        }
        updateScoreBoard();
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        return;
    }
}

function updateScoreBoard() {
    playerXScore.textContent = xScore;
    playerOScore.textContent = oScore;
}