
document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset-button');
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let player1Points = 0;
    let player2Points = 0;

    // Function to handle cell click
    const handleCellClick = (clickedCellEvent) => {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.index);

        if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500'); // Add color to X and O

        checkResult();
    }

    // Function to check game result
    const checkResult = () => {
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

        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = gameBoard[winCondition[0]];
            const b = gameBoard[winCondition[1]];
            const c = gameBoard[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                highlightWinningCells(winCondition);
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            if (currentPlayer === 'X') {
                player1Points++;
                player1Score.textContent = player1Points;
            } else {
                player2Points++;
                player2Score.textContent = player2Points;
            }
            displayGameOverMessage(currentPlayer);
            return;
        }

        let roundDraw = !gameBoard.includes('');
        if (roundDraw) {
            gameActive = false;
            displayGameOverMessage('Draw');
            return;
        }

        switchPlayer();
    }

    // Function to switch player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    // Function to reset the game
    const resetGame = () => {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('text-blue-500', 'text-red-500', 'bg-green-200'); // Remove styling
        });

        hideGameOverMessage();
    }

    // Function to highlight winning cells
    const highlightWinningCells = (winCondition) => {
        winCondition.forEach(index => {
            cells[index].classList.add('bg-green-200'); // Highlight winning cells
        });
    }

    // Function to display game over message
    const displayGameOverMessage = (result) => {
        const message = result === 'Draw' ? 'It's a Draw!' : `Player ${result} Wins!`;
        // Display the message in the UI
        const gameOverMessage = document.createElement('div');
        gameOverMessage.classList.add('game-over-message', 'text-2xl', 'font-bold', 'text-center', 'mt-4');
        gameOverMessage.textContent = message;
        board.parentNode.appendChild(gameOverMessage);
    }

    // Function to hide game over message
    const hideGameOverMessage = () => {
        const gameOverMessage = document.querySelector('.game-over-message');
        if (gameOverMessage) {
            gameOverMessage.remove();
        }
    }

    // Add event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Add event listener to reset button
    resetButton.addEventListener('click', resetGame);

    // Initialize game
    resetGame();
});
