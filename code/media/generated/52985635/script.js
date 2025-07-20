// START: Game Logic - [DATE]
const cells = document.querySelectorAll('[data-cell]');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const resetButton = document.getElementById('reset-button');
const winnerModal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const closeButton = document.querySelector('.close-button');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Points = 0;
let player2Points = 0;

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameBoard[cellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
}

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
        showWinner();
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        gameActive = false;
        showDraw();
        return;
    }

    switchPlayer();
}

function showWinner() {
    if (currentPlayer === 'X') {
        player1Points++;
        player1Score.textContent = player1Points;
        winnerMessage.textContent = 'Player 1 (X) wins!';
    } else {
        player2Points++;
        player2Score.textContent = player2Points;
        winnerMessage.textContent = 'Player 2 (O) wins!';
    }
    winnerModal.classList.add('show');
}

function showDraw() {
    winnerMessage.textContent = 'It\'s a draw!';
    winnerModal.classList.add('show');
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    winnerModal.classList.remove('show');
}

cells.forEach((cell, index) => {
    cell.setAttribute('data-cell-index', index);
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
closeButton.addEventListener('click', () => winnerModal.classList.remove('show'));
// END: Game Logic - [DATE]