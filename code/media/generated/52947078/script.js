// Game logic
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let xScore = 0;
let oScore = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        return 'draw';
    }

    return null;
}

function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');

        const winner = checkWinner();
        if (winner) {
            if (winner === 'X') {
                xScore++;
                playerXScore.textContent = xScore;
            } else if (winner === 'O') {
                oScore++;
                playerOScore.textContent = oScore;
            }
            alert(winner === 'draw' ? 'It\'s a draw!' : `Player ${winner} wins!`);
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

resetButton.addEventListener('click', resetGame);

// FUTURE GAME LOGIC IMPROVEMENTS PLACEHOLDER