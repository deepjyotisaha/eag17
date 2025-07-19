
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let timer;
let timeLeft = 10;
let player1Score = 0;
let player2Score = 0;
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const timerDisplay = document.getElementById('timer');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const winnerMessage = document.getElementById('winner-message');
const resetButton = document.getElementById('reset-button');

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkWin();
    switchPlayer();
    resetTimer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningCombinations[i];
        const a = gameBoard[winCondition[0]];
        const b = gameBoard[winCondition[1]];
        const c = gameBoard[winCondition[2]];
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
        stopTimer();
        if (currentPlayer === 'X') {
            player2Score++;
            player2ScoreDisplay.textContent = player2Score;
            winnerName = 'Player O';
            winnerMessage.textContent = `Winner: ${winnerName}`;
        } else {
            player1Score++;
            player1ScoreDisplay.textContent = player1Score;
            winnerName = 'Player X';
            winnerMessage.textContent = `Winner: ${winnerName}`;
        }
        if (player1Score === 3){
             winnerMessage.textContent = 'Player X is the GRAND winner!';
        } else if (player2Score === 3){
             winnerMessage.textContent = 'Player O is the GRAND winner!';
        }

        return;
    }

    let roundDraw = !gameBoard.includes("");
    if (roundDraw) {
        gameActive = false;
        stopTimer();
        winnerMessage.textContent = 'Draw!';
        return;
    }
}

function startTimer() {
    timeLeft = 10;
    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            stopTimer();
            switchPlayer();
            resetTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

function stopTimer() {
    clearInterval(timer);
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    timeLeft = 10;
    timerDisplay.textContent = timeLeft;
    winnerMessage.textContent = '';
    cells.forEach(cell => cell.textContent = '');
    stopTimer();
    startTimer();
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

startTimer();
