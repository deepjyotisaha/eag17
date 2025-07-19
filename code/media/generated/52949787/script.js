
    // Initialize game variables
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let playerXScore = 0;
    let playerOScore = 0;

    // Get DOM elements
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset-button');
    const winnerModal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');
    const closeModalButton = document.getElementById('close-modal');
    const playerXScoreSpan = document.getElementById('player-x-score');
    const playerOScoreSpan = document.getElementById('player-o-score');

    // Winning conditions
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

    // Function to handle cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.index);

        if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());

        checkWin();
        checkDraw();
        switchPlayer();
    }

    // Function to switch player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    // Function to check for a win
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
                highlightWinningCells(winCondition);
                updateScore();
                showWinnerModal(a);
                break;
            }
        }
    }

    // Function to highlight winning cells
    function highlightWinningCells(winCondition) {
        winCondition.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }

    // Function to check for a draw
    function checkDraw() {
        if (!gameBoard.includes('') && gameActive) {
            gameActive = false;
            showWinnerModal('Draw!');
        }
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
    function showWinnerModal(winner) {
        winnerMessage.textContent = winner === 'Draw!' ? 'It's a Draw!' : `Player ${winner} wins!`;
        winnerModal.classList.remove('hidden');
    }

    // Function to close the winner modal
    function closeModal() {
        winnerModal.classList.add('hidden');
    }

    // Function to reset the game
    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winning-cell');
            cell.classList.remove('x');
            cell.classList.remove('o');
        });

        closeModal();
    }

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);
    closeModalButton.addEventListener('click', closeModal);
    