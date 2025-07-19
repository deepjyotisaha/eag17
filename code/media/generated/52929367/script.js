
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

const gameBoardDiv = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const playerTurnLabel = document.getElementById('playerTurn');
const playerXScoreSpan = document.getElementById('playerXScore');
const playerOScoreSpan = document.getElementById('playerOScore');

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        checkWin();
        togglePlayer();
        updatePlayerTurnLabel();
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            displayWinner(gameBoard[a]);
            updateScore(gameBoard[a]);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        displayWinner('draw');
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
    } else if (winner === 'O') {
        playerOScore++;
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    playerXScoreSpan.textContent = playerXScore;
    playerOScoreSpan.textContent = playerXScore;
    playerOScoreSpan.textContent = playerOScore;
}

function displayWinner(winner) {
    if (winner === 'draw') {
        alert('It's a draw!');
    } else {
        alert(`Player ${winner} wins!`);
    }
}

function resetBoard() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playerXScore = 0;
    playerOScore = 0;
    updateScoreDisplay();
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    updatePlayerTurnLabel();
}

function updatePlayerTurnLabel() {
    playerTurnLabel.textContent = `Player ${currentPlayer}'s turn`;
}

gameBoardDiv.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetBoard);

// Initialize player turn label and score display
updatePlayerTurnLabel();
updateScoreDisplay();
