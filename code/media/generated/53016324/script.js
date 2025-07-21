// Game Logic
const board = document.querySelector('.board');
const resetBtn = document.getElementById('reset-btn');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Points = 0;
let player2Points = 0;

// Function to handle a cell click
function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.textContent = currentPlayer;
        checkWin();
        checkDraw();
        switchPlayer();
    }
    // CELL_CLICK_PLACEHOLDER
}

// Function to switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to check for a win
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
            highlightWinningCells(pattern);
            updateScore(gameBoard[a]);
            showWinnerModal(gameBoard[a]);
            return;
        }
    }
    // WIN_CHECK_PLACEHOLDER
}

// Function to highlight winning cells
function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.classList.add('winning-cell');
    });
}

// Function to show winner modal
function showWinnerModal(winner) {
    const modal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.textContent = winner ? `Player ${winner} wins!` : 'It's a draw!';
    modal.classList.remove('hidden');
    // You can add a close button to the modal to reset the game
}

// Function to hide winner modal
function hideWinnerModal() {
    const modal = document.getElementById('winner-modal');
    modal.classList.add('hidden');
}

// Function to check for a draw
function checkDraw() {
    if (!gameBoard.includes('') && gameActive) {
        gameActive = false;
        showWinnerModal(null);
    }
    // DRAW_CHECK_PLACEHOLDER
}

// Function to update score
function updateScore(winner) {
    if (winner === 'X') {
        player1Points++;
        player1Score.textContent = player1Points;
    } else {
        player2Points++;
        player2Score.textContent = player2Points;
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    hideWinnerModal();
    // RESET_GAME_PLACEHOLDER
}

// Add event listeners
resetBtn.addEventListener('click', resetGame);

// Initial board setup
function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }
}

createBoard();

// JAVASCRIPT_PLACEHOLDER