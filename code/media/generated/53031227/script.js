<script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"></script>

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameWon = false;
let playerXScore = 0;
let playerOScore = 0;

const cells = document.querySelectorAll('.cell');
const playerXScoreSpan = document.getElementById('playerXScore');
const playerOScoreSpan = document.getElementById('playerOScore');
const resetButton = document.getElementById('resetButton');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeModalButton = document.getElementById('closeModalButton');

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameWon = true;
            return board[a];
        }
    }

    return null;
}

function checkDraw() {
    return !board.includes(null);
}

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] || gameWon) {
        return;
    }

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');

    const winner = checkWinner();

    if (winner) {
        winnerMessage.textContent = `Player ${winner} wins!`;
        winnerModal.classList.remove('hidden');
        if (winner === 'X') {
            playerXScore++;
            playerXScoreSpan.textContent = playerXScore;
        } else {
            playerOScore++;
            playerOScoreSpan.textContent = playerOScore;
        }
        updateScores();
    } else if (checkDraw()) {
        winnerMessage.textContent = 'It's a draw!';
        winnerModal.classList.remove('hidden');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameWon = false;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-500', 'text-green-500');
    });
    winnerModal.classList.add('hidden');
}

function updateScores() {
    localStorage.setItem('playerXScore', playerXScore);
    localStorage.setItem('playerOScore', playerOScore);
}

function loadScores() {
    playerXScore = localStorage.getItem('playerXScore') ? parseInt(localStorage.getItem('playerXScore')) : 0;
    playerOScore = localStorage.getItem('playerOScore') ? parseInt(localStorage.getItem('playerOScore')) : 0;
    playerXScoreSpan.textContent = playerXScore;
    playerOScoreSpan.textContent = playerOScore;
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);

closeModalButton.addEventListener('click', function() {
    winnerModal.classList.add('hidden');
    resetGame();
});

loadScores();

// Function to start the confetti animation
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const confetti = new Confetti(canvas);
    confetti.start();

    // Stop confetti after 5 seconds
    setTimeout(() => {
        confetti.stop();
    }, 5000);
}

// Add confetti trigger when a player wins
function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] || gameWon) {
        return;
    }

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer === 'X' ? 'text-blue-500' : 'text-green-500');

    const winner = checkWinner();

    if (winner) {
        winnerMessage.textContent = `Player ${winner} wins!`;
        winnerModal.classList.remove('hidden');
        startConfetti(); // Start confetti animation
        if (winner === 'X') {
            playerXScore++;
        } else {
            playerOScore++;
        }
        updateScores();
    } else if (checkDraw()) {
        winnerMessage.textContent = 'It's a draw!';
        winnerModal.classList.remove('hidden');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Confetti.js library (add this to your script.js file)
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.confettiParticles = [];
        this.animationFrameId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createConfetti() {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height - this.height;
        const size = Math.random() * 10 + 5;
        const speed = Math.random() * 4 + 2;
        const rotation = Math.random() * Math.PI;
        const color = this.getRandomColor();

        this.confettiParticles.push({
            x, y, size, speed, rotation, color,
        });
    }

    getRandomColor() {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawConfetti() {
        this.confettiParticles.forEach((particle, index) => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            particle.y += particle.speed;
            particle.x += Math.sin(particle.rotation) * 0.5;

            if (particle.y > this.height) {
                this.confettiParticles.splice(index, 1);
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawConfetti();

        if (this.isRunning) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            for (let i = 0; i < 100; i++) {
                this.createConfetti();
            }
            this.animate();
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            cancelAnimationFrame(this.animationFrameId);
            this.confettiParticles = [];
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
}
