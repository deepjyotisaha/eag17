
// Scoreboard logic implementation
let playerXScore = 0;
let playerOScore = 0;

// Function to update the scoreboard display
function updateScoreboard() {
    document.getElementById('playerXScore').innerText = playerXScore;
    document.getElementById('playerOScore').innerText = playerOScore;
}

// Function to increment the score of the winning player
function incrementScore(winner) {
    if (winner === 'X') {
        playerXScore++;
    } else if (winner === 'O') {
        playerOScore++;
    }
    updateScoreboard();
}

// Game status logic implementation
let gameActive = true;
let currentPlayer = 'X';
let statusDiv = document.getElementById('statusDiv');
let board = ['', '', '', '', '', '', '', '', ''];

// Function to handle a cell clicked
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handlePlayerTurn(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Function to handle a player turn
function handlePlayerTurn(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
}

// Function to change player turn
function changePlayerTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.innerText = `Player ${currentPlayer}'s turn`;
}

// Function to check for a win
function checkWin() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            gameActive = false;
            statusDiv.innerText = `Player ${a} has won!`;
            incrementScore(a);
            return true;
        }
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    if (!board.includes('')) {
        statusDiv.innerText = `It's a draw!`;
        gameActive = false;
        return true;
    }
    return false;
}

// Function to handle result validation
function handleResultValidation() {
    if (!checkWin() && !checkDraw()) {
        changePlayerTurn();
    }
}

// Function to reset the game
function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    statusDiv.innerText = `Player X's turn`;
    cells.forEach(cell => cell.innerText = '');

    // Reset the board display
    cells.forEach(cell => cell.classList.remove('playerX', 'playerO'));

}

// Add event listeners to the cells
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Add event listener to the reset button
document.getElementById('resetButton').addEventListener('click', resetGame);

// Initial call to updateScoreboard
updateScoreboard();

