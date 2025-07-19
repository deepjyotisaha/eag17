
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xScore = 0;
let oScore = 0;

// Function to handle cell click
function cellClick(cell, index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');
        if (checkWin()) {
            updateMessage(`${currentPlayer} wins!`);
            if (currentPlayer === 'X') {
                xScore++;
            } else {
                oScore++;
            }
            updateScoreboard();
            gameActive = false;
            return;
        }
        if (checkDraw()) {
            updateMessage('Its a draw!');
            gameActive = false;
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateMessage(`${currentPlayer}'s turn`);
    }
}

// Function to check win conditions
function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    return !gameBoard.includes('');
}

// Function to update the game message
function updateMessage(msg) {
    message.innerText = msg;
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    updateMessage(`${currentPlayer}'s turn`);
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
}

function updateScoreboard() {
    document.getElementById('xScore').innerText = `${xScore}`
    document.getElementById('oScore').innerText = `${oScore}`
}

// Event listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(cell, index));
});

resetButton.addEventListener('click', resetGame);

// Initial message
updateMessage(`${currentPlayer}'s turn`);
