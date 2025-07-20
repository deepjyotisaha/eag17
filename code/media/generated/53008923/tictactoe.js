// Game Logic
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const player1ScoreSpan = document.getElementById('player1-score');
const player2ScoreSpan = document.getElementById('player2-score');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Score = 0;
let player2Score = 0;

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


// Game Status Display
const gameStatusSpan = document.getElementById('game-status');

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkWin();

    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatusSpan.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWin() {
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            gameActive = false;
            if (a === 'X') {
                player1Score++;
                player1ScoreSpan.textContent = player1Score;
                gameStatusSpan.textContent = 'Player X wins!';
            } else {
                player2Score++;
                player2ScoreSpan.textContent = player2Score;
                gameStatusSpan.textContent = 'Player O wins!';
            }
            highlightWinningCells(winCondition);
            return;
        }
    }

    checkDraw();
}

function checkDraw() {
    if (!gameBoard.includes('')) {
        gameActive = false;
        gameStatusSpan.textContent = 'It's a draw!';
    }
}

function handleResetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    gameStatusSpan.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCells(winCondition) {
    winCondition.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
resetButton.addEventListener('click', handleResetGame);

// Set initial game status
gameStatusSpan.textContent = `Player ${currentPlayer}'s turn`;


function checkWin() {
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            gameActive = false;
            if (a === 'X') {
                player1Score++;
                player1ScoreSpan.textContent = player1Score;
            } else {
                player2Score++;
                player2ScoreSpan.textContent = player2Score;
            }
            
            
            return;
        }
    }

    checkDraw();
}

function checkDraw() {
    if (!gameBoard.includes('')) {
        gameActive = false;
        // Future Visual Enhancements: Display a draw message
        
    }
}


// Game Status Display
const gameStatusSpan = document.getElementById('game-status');

function handleResetGame() {

    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    // Future Game Logic Enhancements: Reset scores
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
resetButton.addEventListener('click', handleResetGame);

// Future AI opponent
// Future Enhancements: Add more features and enhancements
