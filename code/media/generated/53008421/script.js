
const gameBoard = document.querySelector('.game-board');
const playerXScore = document.getElementById('player-x-score');
const playerOScore = document.getElementById('player-o-score');
const resetButton = document.getElementById('reset-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let xScore = 0;
let oScore = 0;

function createBoard() {
    gameBoard.innerHTML = ''; // Clear the board before creating it
    board.forEach((_, index) => {
        const cell = document.createElement('button');
        cell.classList.add('cell');
        cell.dataset.index = index;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer.toLowerCase());
        checkWin();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    // Update active player style
    if (currentPlayer === 'X') {
        playerXScore.parentElement.classList.add('active-player');
        playerOScore.parentElement.classList.remove('active-player');
    } else {
        playerOScore.parentElement.classList.add('active-player');
        playerXScore.parentElement.classList.remove('active-player');
    }
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
            gameActive = false;
            // Add winning animation to winning cells
            pattern.forEach(index => {
                gameBoard.children[index].classList.add('winning-cell');
            });
            updateScore(board[a]);
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        return;
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        xScore++;
        playerXScore.textContent = xScore;
    } else {
        oScore++;
        playerOScore.textContent = oScore;
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    // Remove winning animation from cells
    Array.from(gameBoard.children).forEach(cell => {
        cell.classList.remove('winning-cell');
    });
    createBoard();
    // Reset active player style
    playerXScore.parentElement.classList.add('active-player');
    playerOScore.parentElement.classList.remove('active-player');
}

resetButton.addEventListener('click', resetBoard);

// Initialize the game
createBoard();

// Set initial active player style
playerXScore.parentElement.classList.add('active-player');
