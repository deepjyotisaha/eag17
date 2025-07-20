// JavaScript for Tic Tac Toe game

const gameboard = document.getElementById('gameboard');
const cells = document.querySelectorAll('.cell');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

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

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        
gameActive = false;
displayWinner(currentPlayer);
return;

        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        
gameActive = false;
displayWinner(null);
return;

        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});


const resetButton = document.getElementById('resetButton');
const playerXScoreSpan = document.getElementById('playerXScore');
const playerOScoreSpan = document.getElementById('playerOScore');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeModalButton = document.getElementById('closeModalButton');

let playerXScore = 0;
let playerOScore = 0;

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    winnerModal.classList.add('hidden');
}

resetButton.addEventListener('click', resetGame);

closeModalButton.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
});



function updateScore() {
    playerXScoreSpan.textContent = playerXScore;
    playerOScoreSpan.textContent = playerOScore;
}

function displayWinner(winner) {
    if (winner === 'X') {
        playerXScore++;
        winnerMessage.textContent = 'Player X wins!';
    } else if (winner === 'O') {
        playerOScore++;
        winnerMessage.textContent = 'Player O wins!';
    } else {
        winnerMessage.textContent = 'Its a draw!';
    }
    winnerModal.classList.remove('hidden');
    updateScore();
}


// Get the modal
var modal = document.getElementById("winnerModal");

// Get the button that opens the modal
var btn = document.getElementById("resetButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

