
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let player1Score = 0;
let player2Score = 0;
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            return board[a];
        }
    }
    return null;
}

function checkDraw() {
    return !board.includes('') && gameActive;
}

function updateScore() {
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
}

function handleCellClick(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        document.getElementById('gameboard').children[index].textContent = currentPlayer;
        document.getElementById('gameboard').children[index].classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');

        let winner = checkWin();
        if (winner) {
            if (winner === 'X') {
                player1Score++;
            } else {
                player2Score++;
            }
            updateScore();
            alert(`Player ${winner} wins!`);
            resetBoard();
        } else if (checkDraw()) {
            alert('It's a draw!');
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    const cells = document.querySelectorAll('#gameboard > div');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
}


// Add cells to the gameboard
const gameboard = document.getElementById('gameboard');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i));
    gameboard.appendChild(cell);
}


// Reset button functionality
document.getElementById('reset-button').addEventListener('click', resetBoard);

updateScore();
