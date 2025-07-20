
// Game logic
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let winner = null;

// Score tracking
let scoreX = 0;
let scoreO = 0;

// Function to handle a cell click
function cellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');
        checkWinner();
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            winner = gameBoard[a];
            gameActive = false;
            updateScore();
            openModal();
            return;
        }
    }

    if (!gameBoard.includes('')) {
        winner = 'draw';
        gameActive = false;
        openModal();
    }
}

// Function to update the score
function updateScore() {
    if (winner === 'X') {
        scoreX++;
        document.getElementById('score-x').textContent = scoreX;
    } else if (winner === 'O') {
        scoreO++;
        document.getElementById('score-o').textContent = scoreO;
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    winner = null;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
}

// Add event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(index));
});

// Add event listener to reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

//Winner modal
const modal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const closeButton = document.getElementsByClassName('close-button')[0];

function openModal() {
    if (winner === 'draw') {
        winnerMessage.textContent = 'It\'s a draw!';
    } else {
        winnerMessage.textContent = `Player ${winner} wins!`;
    }
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});
