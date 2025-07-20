
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleClick(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        document.querySelectorAll('.cell')[index].innerText = currentPlayer;
        document.querySelectorAll('.cell')[index].classList.add(currentPlayer === 'X' ? 'text-red-500' : 'text-green-500');
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinningCells(combination);
            updateScore();
            break;
        }
    }

    if (!board.includes('') && gameActive) {
        gameActive = false;
        // Handle draw condition
    }
}

function highlightWinningCells(combination) {
    combination.forEach(index => {
        document.querySelectorAll('.cell')[index].classList.add('bg-yellow-200');
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        playerOScore++;
        document.getElementById('player-o-score').innerText = playerOScore;
    } else {
        playerXScore++;
        document.getElementById('player-x-score').innerText = playerXScore;
    }
}

document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleClick(index));
});


