
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let xScore = 0;
let oScore = 0;

// Elements
const boardElement = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const xScoreElement = document.getElementById('x-score');
const oScoreElement = document.getElementById('o-score');

// Win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function cellClickHandler(cellIndex) {
    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        cells[cellIndex].innerText = currentPlayer;
        cells[cellIndex].classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');
        checkWin();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinner(condition);
            updateScore();
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        // Handle draw condition if needed
        return;
    }
}

function highlightWinner(winningCondition) {
    winningCondition.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        xScore++;
        xScoreElement.innerText = xScore;
    } else {
        oScore++;
        oScoreElement.innerText = oScore;
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('text-blue-500', 'text-green-500', 'winner');
    });
}

// Event Listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClickHandler(index));
});

resetButton.addEventListener('click', () => {
    resetBoard();
});

xScoreElement.innerText = xScore;
oScoreElement.innerText = oScore;

