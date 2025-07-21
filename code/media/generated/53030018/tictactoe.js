// tictactoe.js

// Game variables
let board = ['', '', '', '', '', '', '', '', '']; // Represents the game board
let currentPlayer = 'X'; // Current player (X or O)
let gameActive = true; // Flag to check if the game is active
let playerXScore = 0; // Player X's score
let playerOScore = 0; // Player O's score

// HTML elements
const cells = document.querySelectorAll('.cell'); // All the cells in the game board
const playerXScoreSpan = document.getElementById('player-x-score'); // Player X's score display
const playerOScoreSpan = document.getElementById('player-o-score'); // Player O's score display
const resetButton = document.getElementById('reset-game'); // Reset button
const winnerModal = document.getElementById('winner-modal'); // Modal for displaying the winner
const winnerMessage = document.getElementById('winner-message'); // Message inside the winner modal
const closeModalButton = document.getElementById('close-modal'); // Close button in the winner modal

// Winning conditions
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

// Function to handle a cell click
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target; // The cell that was clicked
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex); // The index of the clicked cell

    // If the cell is already filled or the game is not active, ignore the click
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update the board and the cell with the current player's symbol
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Check if there is a winner
    handleResultValidation();
}

// Function to check if there is a winner or a draw
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    // If a player has won, update the score and display the winner
    if (roundWon) {
        gameActive = false;
        if (currentPlayer === 'X') {
            playerXScore++;
            playerXScoreSpan.textContent = playerXScore;
            winnerMessage.textContent = 'Player X wins!';
        } else {
            playerOScore++;
            playerOScoreSpan.textContent = playerOScore;
            winnerMessage.textContent = 'Player O wins!';
        }
        showWinnerModal();
        return;
    }

    // If all cells are filled and no one has won, it's a draw
    let roundDraw = !board.includes('');
    if (roundDraw) {
        gameActive = false;
        winnerMessage.textContent = 'It\'s a draw!';
        showWinnerModal();
        return;
    }

    // Switch to the other player
    switchPlayer();
}

// Function to switch the current player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    hideWinnerModal();
}

// Function to show the winner modal
function showWinnerModal() {
    winnerModal.classList.add('show');
}

// Function to hide the winner modal
function hideWinnerModal() {
    winnerModal.classList.remove('show');
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
closeModalButton.addEventListener('click', hideWinnerModal);

// Initial score display
playerXScoreSpan.textContent = playerXScore;
playerOScoreSpan.textContent = playerOScore;