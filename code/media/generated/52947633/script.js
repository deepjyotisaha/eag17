
const cells = document.querySelectorAll('.cell');
const playerXScore = document.getElementById('player-x-score');
const playerOScore = document.getElementById('player-o-score');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xScore = 0;
let oScore = 0;

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
    clickedCell.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');
}

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
        handleGameWon();
        gameActive = false;
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        handleGameDraw();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleGameWon() {
    if (currentPlayer === 'X') {
        xScore++;
        playerXScore.textContent = xScore;
    } else {
        oScore++;
        playerOScore.textContent = oScore;
    }
    displayWinner();
}

function handleGameDraw() {
    displayDraw();
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
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
    hideModal();
}


cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', handleResetGame);

// Modal functions
function displayWinner() {
    const modal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.textContent = `Player ${currentPlayer} wins!`;
    modal.classList.remove('hidden');
}

function displayDraw() {
    const modal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.textContent = `It's a draw!`;
    modal.classList.remove('hidden');
}

function hideModal() {
    const modal = document.getElementById('winner-modal');
    modal.classList.add('hidden');
}
