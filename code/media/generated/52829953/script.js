// Tic-Tac-Toe Game Logic

// Initialize game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let moveCount = 0; // Track the number of moves made

// Winning combinations based on cell IDs
const winningCombinations = [
    ['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], // Rows
    ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], // Columns
    ['0', '4', '8'], ['2', '4', '6']             // Diagonals
];

// Function to handle player turn
function handlePlayerTurn(cell, cellIndex) {
    if (gameBoard[cellIndex] === '' && gameActive) {
        // Update game board array
        gameBoard[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;

        // Increment move count
        moveCount++;

        // Check for win or draw
        if (checkWin()) {
            displayWinMessage();
            gameActive = false;
        } else if (checkDraw()) {
            displayDrawMessage();
            gameActive = false;
        } else {
            // Switch player turn
            switchPlayer();
        }
    }
}

// Function to switch player turn
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnMessage();
}

// Function to check for a win
function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    // Check if all cells are filled and no winner
    return moveCount === 9 && !checkWin();
}

// Function to display win message
function displayWinMessage() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = `Player ${currentPlayer} wins!`;
    // Enhancement: Highlight the winning combination
}

// Function to display draw message
function displayDrawMessage() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'It\'s a draw!';
}

// Function to update turn message
function updateTurnMessage() {
    const messageElement = document.getElementById('message');
    messageElement.textContent = `Player ${currentPlayer}'s turn`;
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    moveCount = 0;

    // Clear the board
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });

    updateTurnMessage();
}

// Add event listeners to cells
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handlePlayerTurn(cell, index));
});

// Add event listener to reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

// Initial turn message
updateTurnMessage();

// Enhancement ideas:
// - Add AI opponent
// - Implement score tracking
// - Improve UI/UX