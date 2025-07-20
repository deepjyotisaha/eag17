// script.js

// Function to handle cell click
function cellClick(cellIndex) {
    console.log("Cell clicked: " + cellIndex);
    // TODO: Implement cell click logic here
}

// Function to check win condition
function checkWin() {
    console.log("Checking win condition");
    // TODO: Implement win condition logic here
}

// Function to reset the game
function resetGame() {
    console.log("Resetting the game");
    // TODO: Implement reset game logic here
}

// Function to update the score
function updateScore() {
    console.log("Updating the score");
    // TODO: Implement update score logic here
}

// Function to display the winning message
function displayWinningMessage(winner) {
    console.log("Displaying winning message for: " + winner);
    // TODO: Implement display winning message logic here
}

// Add event listeners to the cells
const cells = document.querySelectorAll(".cell");
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => cellClick(index));
});

// Add event listener to the reset button
const resetButton = document.querySelector("#reset-btn");
resetButton.addEventListener("click", resetGame);