// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameWon = false;
let playerXScore = 0;
let playerOScore = 0;

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeModalButton = document.getElementById('closeModalButton');
const playerXScoreSpan = document.getElementById('playerXScore');
const playerOScoreSpan = document.getElementById('playerOScore');

// Function to render the game board
function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = index;
        cell.textContent = value;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    });
}

// Function to handle cell click
function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] === '' && !gameWon) {
        board[index] = currentPlayer;
        renderBoard();
        if (checkWin()) {
            gameWon = true;
            updateScore();
            showWinnerModal();
        } else if (checkDraw()) {
            gameWon = true;
            winnerMessage.textContent = 'It\'s a draw!';
            showWinnerModal();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Function to check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Function to check for a draw
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Function to update the score
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        playerXScoreSpan.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreSpan.textContent = playerOScore;
    }
}

// Function to show the winner modal
function showWinnerModal() {
    winnerMessage.textContent = `Player ${currentPlayer} wins!`;
    winnerModal.style.display = 'flex';
}

// Function to close the winner modal
function closeModal() {
    winnerModal.style.display = 'none';
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameWon = false;
    renderBoard();
    closeModal();
}

// Event listeners
resetButton.addEventListener('click', resetGame);
closeModalButton.addEventListener('click', closeModal);

// Initial render
renderBoard();

/* Future Enhancements:
* 1. Improve UI with animations
* 2. Implement advanced game logic (AI opponent)
* 3. Add sound effects
*/
// Timer variables
let timerInterval;
let seconds = 0;
let minutes = 0;

// DOM element for timer
const timerSpan = document.getElementById('timer');

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        // Update timer display
        timerSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    minutes = 0;
    timerSpan.textContent = '00:00';
}

// Modify resetGame function to reset the timer
const originalResetGame = resetGame;
resetGame = () => {
    originalResetGame();
    resetTimer();
    startTimer();
}

// Modify handleCellClick function to start timer only on first click
let firstClick = true;
const originalHandleCellClick = handleCellClick;
handleCellClick = (event) => {
    if (firstClick) {
        startTimer();
        firstClick = false;
    }
    originalHandleCellClick(event);
}

// Modify showWinnerModal function to stop timer
const originalShowWinnerModal = showWinnerModal;
showWinnerModal = () => {
    stopTimer();
    originalShowWinnerModal();
}

// Modify checkDraw function to stop timer
const originalCheckDraw = checkDraw;
checkDraw = () => {
    if (originalCheckDraw()) {
        stopTimer();
        return true;
    }
    return false;
}

// Reset game on page load
resetGame();

/* Future Enhancements:
* 1. Implement advanced game logic (AI opponent)
* 2. Add sound effects
* 3. Add AI opponent logic here
*/

/* Future Enhancements:
* 1. Implement advanced game logic (AI opponent)
* 2. Add sound effects
*/

/* AI Opponent Logic */
function aiMove() {
    let difficulty = document.getElementById('difficulty').value;
    let bestMove;

    if (difficulty === 'easy') {
        // Make a random move
        let availableCells = [];
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerText === '') {
                availableCells.push(i);
            }
        }
        if (availableCells.length > 0) {
            let randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
            cells[randomMove].click();
        }
    } else if (difficulty === 'medium') {
        // Implement medium difficulty logic (e.g., block player wins, take center)
        bestMove = getBestMove(board, huPlayer);
        if (bestMove !== null) {
            cells[bestMove].click();
        } else {
            // Fallback to random move
            let availableCells = [];
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].innerText === '') {
                    availableCells.push(i);
                }
            }
            if (availableCells.length > 0) {
                let randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
                cells[randomMove].click();
            }
        }
    } else if (difficulty === 'hard') {
        // Implement hard difficulty logic (e.g., minimax algorithm)
        bestMove = getBestMove(board, huPlayer);
        if (bestMove !== null) {
            cells[bestMove].click();
        }
    }
}

// Minimax algorithm
function getBestMove(board, player) {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableMoves.push(i);
        }
    }

    if (availableMoves.length === 0) {
        return null;
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < availableMoves.length; i++) {
        let move = availableMoves[i];
        board[move] = aiPlayer;
        let score = minimax(board, 0, false);
        board[move] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    let scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = huPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Add AI move after player move
const origBoard = Array.from(Array(9).keys());
let huPlayer = 'X';
let aiPlayer = 'O';

function handleClick(cell) {
    if (typeof origBoard[cell.target.id] == 'number') {
        turnClick(cell.target.id, huPlayer)
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turnClick(bestSpot(), aiPlayer);
    }
}

function turnClick(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', handleClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");


}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, huPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', handleClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
        return {
            score: -10
        };
    } else if (checkWin(newBoard, aiPlayer)) {
        return {
            score: 10
        };
    } else if (availSpots.length === 0) {
        return {
            score: 0
        };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == huPlayer) {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}


