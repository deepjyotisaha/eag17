// JavaScript for Tic Tac Toe
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const playerXScoreSpan = document.getElementById('playerXScore');
const playerOScoreSpan = document.getElementById('playerOScore');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

// Function to handle a cell click
function cellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        checkWin();
        togglePlayer();
    }
}

// Function to toggle the current player
function togglePlayer() {
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
            highlightWinner(pattern);
            updateScore();
            showWinnerModal(currentPlayer);
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        showWinnerModal('Draw');
    }
}

// Function to highlight the winning cells
function highlightWinner(pattern) {
    pattern.forEach(index => cells[index].classList.add('winner'));
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        playerXScoreSpan.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreSpan.textContent = playerOScore;
    }
}

// Function to show the winner modal
function showWinnerModal(winner) {
    winnerMessage.textContent = winner === 'Draw' ? 'It\'s a Draw!' : `Player ${winner} wins!`;
    winnerModal.style.display = 'block';
}

// Function to close the winner modal
function closeModal() {
    winnerModal.style.display = 'none';
    resetGame();
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
}

// Event listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(index));
});

resetButton.addEventListener('click', resetGame);