
let board = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'X';
let player1Score = 0;
let player2Score = 0;
let gameActive = true;

const cells = document.querySelectorAll('.cell');
const player1ScoreDisplay = document.getElementById('player-1-score');
const player2ScoreDisplay = document.getElementById('player-2-score');
const resetButton = document.getElementById('reset-button');
const turnDisplay = document.getElementById('turn-display');
const winningMessage = document.getElementById('winning-message');

function handleCellClick(event) {
    const index = parseInt(event.target.dataset.index);

    if (board[index] === null && gameActive) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        checkWin();
        togglePlayer();
        updateTurnDisplay();
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateTurnDisplay() {
    turnDisplay.textContent = `Player ${currentPlayer === 'X' ? 1 : 2}'s Turn`;
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
            handleWin(board[a]);
            return;
        }
    }

    if (!board.includes(null)) {
        handleDraw();
    }
}

function handleWin(winner) {
    gameActive = false;
    winningMessage.textContent = `Player ${winner === 'X' ? 1 : 2} Wins!`;
    winningMessage.classList.remove('hidden');
    if (winner === 'X') {
        player1Score++;
        player1ScoreDisplay.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreDisplay.textContent = player2Score;
    }
}

function handleDraw() {
    gameActive = false;
    turnDisplay.textContent = 'Draw!';
    winningMessage.textContent = 'It's a Draw!';
    winningMessage.classList.remove('hidden');
}

function resetGame() {
    board = [null, null, null, null, null, null, null, null, null];
    currentPlayer = 'X';
    gameActive = true;
    winningMessage.classList.add('hidden');
    updateTurnDisplay();
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

updateTurnDisplay();
