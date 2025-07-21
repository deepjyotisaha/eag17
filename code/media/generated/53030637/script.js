// JavaScript logic for the Tic Tac Toe game
const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Points = 0;
let player2Points = 0;

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    if (gameBoard[cellIndex] === '' && gameActive) {
        gameBoard[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        checkWin();
        checkDraw();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

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
            highlightWinningCells(pattern);
            updateScore();
            displayWinner();
            return;
        }
    }
}

function checkDraw() {
    if (!gameBoard.includes('') && gameActive) {
        gameActive = false;
        displayDraw();
    }
}

function highlightWinningCells(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        player1Points++;
        player1Score.textContent = player1Points;
    } else {
        player2Points++;
        player2Score.textContent = player2Points;
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

function displayWinner(){
    setTimeout(() => {
        alert(`Player ${currentPlayer} wins!`);
    }, 500);
}

function displayDraw(){
    setTimeout(() => {
        alert("It's a draw!");
    }, 500);
}