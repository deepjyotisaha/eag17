
// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

// Get the elements
const cells = document.querySelectorAll('.cell');
const playerXScoreSpan = document.getElementById('player-x-score');
const playerOScoreSpan = document.getElementById('player-o-score');
const resetButton = document.querySelector('.reset-button');
const winnerModal = document.createElement('div');
winnerModal.classList.add('modal');
winnerModal.innerHTML = `
    <div class="modal-content bg-white p-8 rounded shadow-md">
        <h2 id="winner-message" class="text-2xl font-bold mb-4"></h2>
        <button id="close-modal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Close</button>
    </div>
`;
document.body.appendChild(winnerModal);
const winnerMessage = document.getElementById('winner-message');
const closeModalButton = document.getElementById('close-modal');

// Function to handle player turn
function playerTurn(cellIndex) {
    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        cells[cellIndex].textContent = currentPlayer;
        cells[cellIndex].classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Function to check win conditions
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

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        displayWinner('draw');
    }
}

// Function to display the winner
function displayWinner(winner) {
    if (winner === 'draw') {
        winnerMessage.textContent = 'Its a draw!';
    } else {
        winnerMessage.textContent = `Player ${winner} wins!`;
    }
    winnerModal.style.display = 'block';
}

// Function to update the score
function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
        playerXScoreSpan.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreSpan.textContent = playerOScore;
    }
}

// Function to handle game reset
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
    winnerModal.style.display = 'none';
}

// Add event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => playerTurn(index));
});

// Add event listener to reset button
resetButton.addEventListener('click', resetGame);

// Add event listener to close modal button
closeModalButton.addEventListener('click', () => {
    winnerModal.style.display = 'none';
});

// Initial setup (if needed)

