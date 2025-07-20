// script.js

document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('gameBoard');
    const playerXScore = document.getElementById('playerXScore');
    const playerOScore = document.getElementById('playerOScore');
    const resetGameButton = document.getElementById('resetGame');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameWon = false;
    let scoreX = 0;
    let scoreO = 0;

    // Function to create the game board
    function createBoard() {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }

    // Function to handle cell click
    function handleCellClick(event) {
        const index = event.target.dataset.index;

        if (board[index] === '' && !gameWon) {
            board[index] = currentPlayer;
            event.target.textContent = currentPlayer;
            checkWin();
            switchPlayer();
        }
    }

    // Function to switch player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    // Function to check win
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameWon = true;
                updateScore();
                return;
            }
        }

        // Check for draw
        if (!board.includes('')) {
            gameWon = true;
        }
    }

    // Function to update score
    function updateScore() {
        if (currentPlayer === 'X') {
            scoreX++;
            playerXScore.textContent = scoreX;
        } else {
            scoreO++;
            playerOScore.textContent = scoreO;
        }
    }

    // Function to reset the game
    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameWon = false;
        const cells = document.querySelectorAll('#gameBoard > div');
        cells.forEach(cell => cell.textContent = '');
    }

    // Event listener for reset button
    resetGameButton.addEventListener('click', resetBoard);

    // Initialize the game
    createBoard();
});