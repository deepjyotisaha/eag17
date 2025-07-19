
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const gameboard = document.getElementById('gameboard');
const score = document.getElementById('score');
const reset = document.getElementById('reset');

function initializeBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameboard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        gameboard.appendChild(cell);
    }
    updateScore();
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        event.target.innerText = currentPlayer;
        checkWin();
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinningCells(condition);
            updateScoreForWinner(board[a]);
            return;
        }
    }
    if (!board.includes('')) {
        gameActive = false;
        updateScore();
    }
}

function highlightWinningCells(condition) {
    condition.forEach(index => {
        gameboard.children[index].classList.add('winning-cell');
    });
}

function updateScoreForWinner(winner) {
    if (winner === 'X') {
        playerXScore++;
    } else {
        playerOScore++;
    }
    updateScore();
}

function updateScore() {
    score.innerText = `X: ${playerXScore} | O: ${playerOScore}`;
}

reset.addEventListener('click', initializeBoard);

initializeBoard();


const gameboard = document.getElementById('gameboard');
const score = document.getElementById('score');
const reset = document.getElementById('reset');

// Initialize the game board
function initializeBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.addEventListener('click', handleCellClick);
        gameboard.appendChild(cell);
    }
}

// Handle cell click event
function handleCellClick(event) {
    
}

// Reset the game
reset.addEventListener('click', function() {
    
});

initializeBoard();