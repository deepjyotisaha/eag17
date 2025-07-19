// Game variables
let currentPlayer = 'X'; // Current player
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Game board state
let gameActive = true; // Game status
let player1Score = 0; // Player 1 score
let player2Score = 0; // Player 2 score

// DOM elements
const gameBoardElement = document.getElementById('game-board'); // Game board element
const player1ScoreElement = document.getElementById('player1-score'); // Player 1 score element
const player2ScoreElement = document.getElementById('player2-score'); // Player 2 score element
const resetButton = document.getElementById('reset-button'); // Reset button
const gameCells = document.querySelectorAll('.game-cell');

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

// Function to check win condition
function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            return gameBoard[a]; // Return the winner (X or O)
        }
    }
    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        return 'Draw';
    }
    return null; // No winner, game continues
}

// Function to update the score
function updateScore(winner) {
    if (winner === 'X') {
        player1Score++;
        player1ScoreElement.textContent = player1Score;
    } else if (winner === 'O') {
        player2Score++;
        player2ScoreElement.textContent = player2Score;
    }
}

// Function to handle a cell click
function handleCellClick(event) {
    const cellIndex = event.target.dataset.cellIndex;

    if (gameBoard[cellIndex] === '' && gameActive) {
        // Update the game board array
        gameBoard[cellIndex] = currentPlayer;
        // Update the cell display
        event.target.textContent = currentPlayer;
        // Check for a win
        const winner = checkWin();
        if (winner) {
            // Update score if there is a winner
            if (winner !== 'Draw') {
                updateScore(winner);
            }
            // Display winner or draw message (you can implement this)
            alert(winner === 'Draw' ? 'It\'s a draw!' : `Player ${winner} wins!`);
            return;
        }
        // Switch player turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    gameCells.forEach(cell => {
        cell.textContent = '';
    });
}

// Add event listeners to each game cell
gameCells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Add event listener to the reset button
resetButton.addEventListener('click', resetGame);