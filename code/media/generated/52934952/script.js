
// Game logic
const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.getElementById('resetButton');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const resultDisplay = document.createElement('p');
resultDisplay.classList.add('result-message');
const scoreBoard = document.getElementById('scoreBoard');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xScore = 0;
let oScore = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cell);

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'text-red-500' : 'text-green-500');

    handleResultValidation();
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
        gameActive = false;
        resultDisplay.textContent = `Player ${currentPlayer} wins!`;
        scoreBoard.appendChild(resultDisplay);
        if (currentPlayer === 'X') {
            xScore++;
            playerXScore.textContent = xScore;
        } else {
            oScore++;
            playerOScore.textContent = oScore;
        }
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        resultDisplay.textContent = 'It's a draw!';
        scoreBoard.appendChild(resultDisplay);
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function handleResetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-red-500', 'text-green-500');
    });

    if (resultDisplay.parentNode) {
        resultDisplay.parentNode.removeChild(resultDisplay);
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetGame);

