// script.js

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');
    const resetButton = document.getElementById('reset-button');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWinner() {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                return gameBoard[a];
            }
        }
        if (!gameBoard.includes('')) {
            gameActive = false;
            return 'Draw';
        }
        return null;
    }

    function updateScore() {
        player1Score.textContent = scorePlayer1;
        player2Score.textContent = scorePlayer2;
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const cellIndex = parseInt(clickedCell.dataset.index);

        if (gameBoard[cellIndex] !== '' || !gameActive) {
            return;
        }

        gameBoard[cellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        const winner = checkWinner();
        if (winner) {
            if (winner === 'Draw') {
                alert('It\'s a Draw!');
            } else if (winner === 'X') {
                scorePlayer1++;
                alert('Player 1 (X) wins!');
            } else {
                scorePlayer2++;
                alert('Player 2 (O) wins!');
            }
            updateScore();
            resetGame();
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        cells.forEach(cell => cell.textContent = '');
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);

    updateScore();
});