// script.js
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xScore = 0;
let oScore = 0;

// Function to handle a cell click
function cellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        checkWin();
        switchPlayer();
    }
}

// Function to switch player turns
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
            // alert(`Player ${currentPlayer} wins!`);
            updateScore();
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        // alert('It\'s a draw!');
    }
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        xScore++;
        playerXScore.textContent = xScore;
    } else {
        oScore++;
        playerOScore.textContent = oScore;
    }
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
}

// Add event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(index));
});

// Add event listener to reset button
resetBtn.addEventListener('click', resetGame);

// Get the modal
const modal = document.getElementById("winnerModal");

// Get the button that closes the modal
const closeModalBtn = document.getElementById("closeModalBtn");
const winnerMessage = document.getElementById("winnerMessage")

// Function to open the modal
function openModal(winner) {
    if (winner === 'Its a draw!') {
        winnerMessage.textContent = `It's a draw!`;
    } else {
        winnerMessage.textContent = `Player ${winner} Wins!`;
    }
    modal.classList.remove("hidden");
}

// Function to close the modal
function closeModal() {
    modal.classList.add("hidden");
}

// When the user clicks the button, close the modal 
closeModalBtn.addEventListener("click", closeModal);

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
            openModal(currentPlayer);
            updateScore();
            return;
        }
    }

    // Check for a draw
    if (!gameBoard.includes('')) {
        gameActive = false;
        openModal("It's a draw!");
        return;
    }
}

// Function to handle a cell click
function cellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        checkWin();
        switchPlayer();
    }
}




