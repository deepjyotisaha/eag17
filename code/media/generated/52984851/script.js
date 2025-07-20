
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let winner = null;
let gameActive = true;

let playerXScore = 0;
let playerOScore = 0;

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeButton = document.querySelector('.close');
const playerXScoreSpan = document.getElementById('playerXScore');
const playerOScoreSpan = document.getElementById('playerOScore');


function handleCellClick(event) {
    const cellIndex = event.target.dataset.cellIndex;
    
    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        
        checkWin();
        checkDraw();

        if(gameActive){
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
            gameActive = false;
            
            // Open the modal with the winner message
            winnerMessage.textContent = `Player ${winner} wins!`;
            openModal();

            // Update the score
            if (winner === 'X') {
                playerXScore++;
                playerXScoreSpan.textContent = playerXScore;
            } else {
                playerOScore++;
                playerOScoreSpan.textContent = playerOScore;
            }
            break;
        }
    }
}

function checkDraw() {
    if (!board.includes('') && !winner) {
        gameActive = false;

         // Open the modal with the draw message
        winnerMessage.textContent = 'Its a draw!';
        openModal();
    }
}


cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);


function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    winner = null;
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = '';
    });

    closeModal();
}

function openModal() {
    winnerModal.style.display = 'flex';
}

function closeModal() {
    winnerModal.style.display = 'none';
}

closeButton.addEventListener('click', closeModal);

// Initial score display
playerXScoreSpan.textContent = playerXScore;
playerOScoreSpan.textContent = playerOScore;

