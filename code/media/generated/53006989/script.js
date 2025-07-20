
const gameBoard = document.querySelector('.grid');
const resetButton = document.querySelector('.reset-button');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const cells = document.querySelectorAll('.cell');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameWon = false;
let xScore = 0;
let oScore = 0;
let moves = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameWon = true;
            return board[a];
        }
    }
    return null;
}

function checkDraw() {
    return moves === 9 && !gameWon;
}

function updateScore() {
    playerXScore.textContent = xScore;
    playerOScore.textContent = oScore;
}

function cellClicked(cellIndex) {
    if (board[cellIndex] === '' && !gameWon) {
        board[cellIndex] = currentPlayer;
        cells[cellIndex].textContent = currentPlayer;
        moves++;
        
        let winner = checkWin();
        if (winner) {
            if (winner === 'X') {
                xScore++;
            } else {
                oScore++;
            }
            updateScore();
            alert('Player ' + winner + ' wins!');
            resetBoard();
        } else if (checkDraw()) {
            alert('It\'s a draw!');
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameWon = false;
    moves = 0;
    cells.forEach(cell => cell.textContent = '');
}

resetButton.addEventListener('click', () => {
    resetBoard();
});

gameBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('cell')) {
        const cellIndex = event.target.dataset.cell;
        cellClicked(cellIndex);
    }
});

updateScore();

