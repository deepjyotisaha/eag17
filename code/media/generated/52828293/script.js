
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Function to handle player moves
function handleMove(cell, index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);
        checkWinner();
        switchPlayer();
    }
}

// Function to switch player turns
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            document.querySelectorAll('.cell')[a].classList.add('winning-cell');
            document.querySelectorAll('.cell')[b].classList.add('winning-cell');
            document.querySelectorAll('.cell')[c].classList.add('winning-cell');
            announceWinner(currentPlayer);
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes('')) {
        announceDraw();
        gameActive = false;
    }
}

// Function to announce the winner
function announceWinner(winner) {
    alert(winner + ' wins!');
}

// Function to announce a draw
function announceDraw() {
    alert('Draw!');
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'winning-cell');
    });
}

// Event listeners for cell clicks and reset button
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleMove(cell, index));
});

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame);
