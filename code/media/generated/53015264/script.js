
// Initialize game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;
let moveCount = 0; // Track the number of moves

// DOM elements
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const winnerModal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const closeModalButton = document.getElementById('close-modal');
const playerXScoreDisplay = document.getElementById('player-x-score');
const playerOScoreDisplay = document.getElementById('player-o-score');

// Winning conditions
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Function to handle a cell click
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');
    moveCount++; // Increment move count
    clickedCell.style.transform = 'scale(1.2)';
    setTimeout(() => {
        clickedCell.style.transform = 'scale(1)';
    }, 300);

    checkResult();
}

// Function to check the result of the game
function checkResult() {
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

    if (roundWon) {
        gameActive = false;
        displayWinner();
        updateScore();
        return;
    }

    // Check for draw only after at least 5 moves have been made
    let roundDraw = moveCount >= 9 && !board.includes('');
    if (roundDraw) {
        gameActive = false;
        displayWinner('draw');
        return;
    }

    switchPlayer();
}

// Function to switch player turn
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Function to display the winner modal
function displayWinner(result) {
    if (result === 'draw') {
        winnerMessage.textContent = 'It is a draw!';
    } else {
        winnerMessage.textContent = `Player ${currentPlayer} Wins!`;
    }

    // Add animation to the modal
    winnerModal.classList.add('animate-fade-in');
    winnerModal.classList.remove('hidden');
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        playerXScoreDisplay.textContent = playerXScore;
        playerXScoreDisplay.classList.add('animate-pulse');
        setTimeout(() => {
            playerXScoreDisplay.classList.remove('animate-pulse');
        }, 1000);
    } else {
        playerOScore++;
        playerOScoreDisplay.textContent = playerOScore;
        playerOScoreDisplay.classList.add('animate-pulse');
        setTimeout(() => {
            playerOScoreDisplay.classList.remove('animate-pulse');
        }, 1000);
    }
}

// Function to reset the board
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    moveCount = 0; // Reset move count

    // Hide the modal without animation class
    winnerModal.classList.add('hidden');
    winnerModal.classList.remove('animate-fade-in');

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('playerX', 'playerO');
        cell.style.transform = 'scale(1)'; // Reset cell transform
    });

    // Optional: Force a reflow to restart the animation
    void winnerModal.offsetWidth;
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetBoard);

closeModalButton.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    winnerModal.classList.remove('animate-fade-in'); // Remove animation class on close
});

// Add animation classes (defined in CSS)
