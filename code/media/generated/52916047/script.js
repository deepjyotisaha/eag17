// script.js
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function checkDraw() {
    return !board.includes('');
}

function handleCellClick(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        
        let winner = checkWin();
        if (winner) {
            message.textContent = `Player ${winner} wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            message.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}


cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});