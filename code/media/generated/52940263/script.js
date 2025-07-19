// script.js

const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const resetButton = document.getElementById('resetButton');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameWon = false;
let scoreX = 0;
let scoreO = 0;

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameWon = true;
            return board[a];
        }
    }

    if (!board.includes('')) {
        gameWon = true;
        return 'Tie';
    }

    return null;
}

function cellClick(index) {
    if (board[index] === '' && !gameWon) {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');

        const win = checkWin();
        if (win) {
            if (win === 'X') {
                scoreX++;
                playerXScore.textContent = scoreX;
            } else if (win === 'O') {
                scoreO++;
                playerOScore.textContent = scoreO;
            }
            alert(win === 'Tie' ? 'It\'s a Tie!' : `Player ${win} wins!`);
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameWon = false;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => cellClick(index));
});

resetButton.addEventListener('click', resetBoard);

// UPDATE_JS