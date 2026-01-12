// DOM Elements
const welcomePage = document.getElementById("welcomePage");
const gamePage = document.getElementById("gamePage");
const credits = ["Snir", "Marsel", "David", "Juda"];
let creditIndex = 0;
const creditsDiv = document.getElementById("credits");

// Game Elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Enable anti-aliasing for smooth rendering
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Add roundRect polyfill for older browsers
if (!ctx.roundRect) {
  ctx.roundRect = function(x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
  };
}

// Game Constants
const tileSize = 33;

// Level definitions with progressively larger maps and more ghosts
const levels = {
  1: {
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    ghosts: [
      { x: 15, y: 5, color: "#ff00ff", dx: -1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 }
    ]
  },
     2: {
     maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,0,1],
        [1,0,1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],
    ghosts: [
      { x: 17, y: 5, color: "#ff00ff", dx: -1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 1, y: 5, color: "#00ffff", dx: 1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 }
    ]
  },
  3: {
      maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,1,1,0,1],
        [1,0,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1],
        [1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,0,0,1,0,0,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,1],
        [1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ],

    ghosts: [
      { x: 20, y: 5, color: "#ff00ff", dx: -1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 1, y: 5, color: "#00ffff", dx: 1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 10, y: 9, color: "#ff8800", dx: 0, dy: -1, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 }
    ]
  },
  4: {
      maze: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
       ],

    ghosts: [
      { x: 20, y: 5, color: "#ff00ff", dx: -1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 1, y: 5, color: "#00ffff", dx: 1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 10, y: 11, color: "#ff8800", dx: 0, dy: -1, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 5, y: 9, color: "#8800ff", dx: 1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 }
    ]
  },
  5: {
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1],
      [1,0,1,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,1,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
     ],
    ghosts: [
      { x: 24, y: 5, color: "#ff00ff", dx: -1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 1, y: 5, color: "#00ffff", dx: 1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 12, y: 11, color: "#ff8800", dx: 0, dy: -1, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 6, y: 9, color: "#8800ff", dx: 1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 },
      { x: 18, y: 9, color: "#00ff88", dx: -1, dy: 0, moveDelay: 0, isChasing: false, chaseTimer: 0, chaseDuration: 0, flashTimer: 0, isRunning: false, runningTimer: 0, runningDuration: 0 }
    ]
  }
};

// Current level tracking
let currentLevel = 1;
let maxLevel = 5;


// Game Variables
let maze = [];

// Ghost respawn system
let ghostRespawnQueue = [];

// Score display system
let scoreDisplays = []; // Array to store floating score displays

// Scoring System:
// - Normal dots: 1 point
// - Power dots: 30 points  
// - Snowflake dots: 40 points
// - Cherry dots: 10 points
// - Eating ghosts: 50 points (with potential multiplier)
let ghostEatMultiplier = 1; // Multiplier for consecutive ghost eating
let lastGhostEatTime = 0; // Track when last ghost was eaten

// Lives and invincibility system
let isInvincible = false;
let invincibilityTimer = 0;
const INVINCIBILITY_DURATION = 90; // 3 seconds at 30 FPS
let respawnX = 1; // Respawn position X
let respawnY = 1; // Respawn position Y

// Special power dot variables
let powerDot = null;
let powerDotSpawnTimer = 0;
const POWER_DOT_SPAWN_INTERVAL = 900; // Spawn every 900 frames (30 seconds at 30 FPS)
const POWER_DOT_BONUS_SCORE = 30; // Bonus points for collecting power dot
const POWER_DOT_CHASE_DURATION = 45; // How long ghosts chase after power dot (1.5 seconds at 30 FPS)
const POWER_DOT_RUNNING_DURATION = 45; // How long ghosts run from Pac-Man (1.5 seconds at 30 FPS)

// Special snowflake dot variables
let snowflakeDot = null;
let snowflakeDotSpawnTimer = 0;
const SNOWFLAKE_DOT_SPAWN_INTERVAL = 600; // Spawn every 600 frames (20 seconds at 30 FPS) - different from power dots
const SNOWFLAKE_DOT_BONUS_SCORE = 40; // Bonus points for collecting snowflake dot
const SNOWFLAKE_DOT_FREEZE_DURATION = 90; // How long ghosts stay frozen (3 seconds at 30 FPS)
let isGhostsFrozen = false;
let ghostFreezeTimer = 0;

// Special cherry dot variables
let cherryDot = null;
let cherryDotSpawnTimer = 0;
const CHERRY_DOT_SPAWN_INTERVAL = 300; // Spawn every 300 frames (10 seconds at 30 FPS) - decent spawn rate
const CHERRY_DOT_BONUS_SCORE = 10; // Cherry dots give 10 points

let pacman = { 
  x: 1, y: 1, 
  dx: 0, dy: 0, 
  nextDx: 0, nextDy: 0, // Store next direction for smooth turning
  lastDx: 0, lastDy: 0, // Store last valid direction for visual rotation
  moveDelay: 0 // Add movement delay for slower gameplay
};

let ghosts = [];

let score = 0;
let lives = 3; // Pacman starts with 3 lives
let running = false;
let gameOver = false;
let gameInterval;
let lastTime = 0;
let moveCounter = 0; // Counter to control movement speed
let frameCounter = 0; // Counter to track game frames

// Load high score from localStorage
let highScore = parseInt(localStorage.getItem("pacmanHighScore")) || 0;

// Page Management Functions
function showWelcomePage() {
  welcomePage.style.display = "flex";
  gamePage.style.display = "none";
  updateWelcomeHighScore();
  
  // Start welcome theme loop
  if (typeof startWelcomeTheme === 'function') {
    startWelcomeTheme();
  }
}

function showGamePage() {
  welcomePage.style.display = "none";
  gamePage.style.display = "flex";
  
  // Stop welcome theme when starting game
  if (typeof stopWelcomeTheme === 'function') {
    stopWelcomeTheme();
  }
  
     // Load selected level for new game
   loadLevel(currentLevel);
   
   // Reset game state
   score = 0;
   lives = 3; // Reset lives to 3
   running = false;
   gameOver = false;
  
  // Draw initial state
  draw();
  
  // Update game status
  updateGameStatus();
  
  // Show beautiful countdown animation
  showCountdown();
}

function showCountdown() {
  const countdownElement = document.getElementById('countdown');
  const gameTitleElement = document.querySelector('.game-container .game-title');
  const levelIndicatorElement = document.getElementById('levelIndicator');
  countdownElement.style.display = 'block';
  
  let count = 3;
  countdownElement.textContent = count;
  // Play sound for the first number (3)
  playSound('countdown');
  
  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownElement.textContent = count;
      // Play countdown sound for each number
      playSound('countdown');
      // Add pulse effect for each number
      countdownElement.style.animation = 'none';
      setTimeout(() => {
        countdownElement.style.animation = 'countdownPulse 0.5s ease-in-out';
      }, 10);
    } else {
      countdownElement.textContent = 'GO!';
      // Play special "GO!" sound
      playSound('countdown');
      countdownElement.style.fontSize = '10rem';
      countdownElement.style.color = '#00ff00';
      countdownElement.style.textShadow = '0 0 30px #00ff00, 0 0 60px #00ff00';
      
               setTimeout(() => {
           countdownElement.style.display = 'none';
           // Hide the game title after countdown
           if (gameTitleElement) {
             gameTitleElement.style.display = 'none';
           }
           // Hide the level indicator after countdown
           if (levelIndicatorElement) {
             levelIndicatorElement.style.display = 'none';
           }
           
           // Ensure the canvas is visible and properly sized
           if (canvas) {
             canvas.style.display = 'block';
           }
           
           startGame();
         }, 1000);
      
      clearInterval(countdownInterval);
    }
  }, 1000);
}

function updateWelcomeHighScore() {
  document.querySelector(".score-text").textContent = "High Score: " + highScore;
}

// Generic dot spawning function
function spawnSpecialDot(dotType, dotObject, mazeValue) {
  if (dotObject) return; // Don't spawn if one already exists
  
  const availablePositions = [];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] !== 1 && !(x === pacman.x && y === pacman.y) && 
          !(powerDot && x === powerDot.x && y === powerDot.y) &&
          !(snowflakeDot && x === snowflakeDot.x && y === snowflakeDot.y) &&
          !(cherryDot && x === cherryDot.x && y === cherryDot.y)) {
        availablePositions.push({ x, y });
      }
    }
  }
  
  if (availablePositions.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  const position = availablePositions[randomIndex];
  
  // Update the dot object reference
  if (dotType === 'power') powerDot = { x: position.x, y: position.y, spawnTime: Date.now() };
  else if (dotType === 'snowflake') snowflakeDot = { x: position.x, y: position.y, spawnTime: Date.now() };
  else if (dotType === 'cherry') cherryDot = { x: position.x, y: position.y, spawnTime: Date.now() };
  
  maze[position.y][position.x] = mazeValue;
}

function startGhostFreeze() {
  // Freeze all ghosts in place
  ghosts.forEach(g => {
    // Store current movement state
    g.frozenDx = g.dx;
    g.frozenDy = g.dy;
    g.frozenIsChasing = g.isChasing;
    g.frozenIsRunning = g.isRunning;
    
    // Stop all movement
    g.dx = 0;
    g.dy = 0;
    g.isChasing = false;
    g.isRunning = false;
  });
  
  // Activate freeze mode
  isGhostsFrozen = true;
  ghostFreezeTimer = 0;
  
  console.log('Ghosts frozen for 3 seconds');
}

// Game Functions
function drawMaze() {
  for(let r = 0; r < maze.length; r++) {
    for(let c = 0; c < maze[r].length; c++) {
      if(maze[r][c] === 1) {
        // Simplified wall design for better performance
        const x = c * tileSize;
        const y = r * tileSize;
        
        // Create wall gradient
        const gradient = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
        gradient.addColorStop(0, "#0d2b4a");
        gradient.addColorStop(0.5, "#2d6bb8");
        gradient.addColorStop(1, "#1a4a8a");
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = "#4a90e2";
        ctx.shadowBlur = 8; // Reduced shadow blur for better performance
        ctx.shadowOffsetX = 1; // Reduced shadow offset
        ctx.shadowOffsetY = 1;
        
        // Draw rounded wall corners
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, tileSize - 2, tileSize - 2, 6); // Reduced radius
        ctx.fill();
        
        // Add simple wall highlight
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        const highlightGradient = ctx.createLinearGradient(x, y, x, y + tileSize);
        highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)"); // Reduced opacity
        highlightGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        
        ctx.fillStyle = highlightGradient;
        ctx.fillRect(x + 1, y + 1, tileSize - 2, (tileSize - 2) / 2);
        
      } else if(maze[r][c] === 0) {
        // Simple static dot design
        const centerX = c * tileSize + tileSize/2;
        const centerY = r * tileSize + tileSize/2;
        
        // Simple dot with gradient
        ctx.shadowBlur = 0;
        const dotGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 6); // Reduced size
        dotGradient.addColorStop(0, "#ffff00");
        dotGradient.addColorStop(0.7, "#ffcc00");
        dotGradient.addColorStop(1, "#ff9900");
        
        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2); // Reduced radius
        ctx.fill();
      } else if(maze[r][c] === 3) {
        // Power dot design - larger, pulsing, and colorful
        const centerX = c * tileSize + tileSize/2;
        const centerY = r * tileSize + tileSize/2;
        
        // Pulsing animation
        const time = Date.now() * 0.008;
        const pulseScale = 1 + Math.sin(time) * 0.3;
        const pulseRadius = 8 * pulseScale;
        
        // Create pulsing glow effect
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 15 + Math.sin(time * 2) * 5;
        
        // Outer glow ring
        const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius + 5);
        outerGradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
        outerGradient.addColorStop(0.5, "rgba(0, 255, 255, 0.4)");
        outerGradient.addColorStop(1, "rgba(0, 255, 255, 0)");
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius + 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Main power dot with rainbow colors
        const hue = (time * 50) % 360;
        const mainGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        mainGradient.addColorStop(0, `hsl(${hue}, 100%, 70%)`);
        mainGradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 100%, 60%)`);
        mainGradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 100%, 50%)`);
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = mainGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner white core
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if(maze[r][c] === 4) {
        // Snowflake dot design - icy blue with snowflake effect
        const centerX = c * tileSize + tileSize/2;
        const centerY = r * tileSize + tileSize/2;
        
        // Icy blue glow effect
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 12;
        
        // Outer icy glow ring
        const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
        outerGradient.addColorStop(0, "rgba(0, 255, 255, 0.6)");
        outerGradient.addColorStop(0.7, "rgba(0, 150, 255, 0.3)");
        outerGradient.addColorStop(1, "rgba(0, 100, 255, 0)");
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Main snowflake dot
        const mainGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 8);
        mainGradient.addColorStop(0, "#ffffff");
        mainGradient.addColorStop(0.3, "#00ffff");
        mainGradient.addColorStop(0.7, "#0088ff");
        mainGradient.addColorStop(1, "#0044aa");
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = mainGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw snowflake pattern
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        
        // Horizontal and vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX - 6, centerY);
        ctx.lineTo(centerX + 6, centerY);
        ctx.moveTo(centerX, centerY - 6);
        ctx.lineTo(centerX, centerY + 6);
        ctx.stroke();
        
        // Diagonal lines
        ctx.beginPath();
        ctx.moveTo(centerX - 4, centerY - 4);
        ctx.lineTo(centerX + 4, centerY + 4);
        ctx.moveTo(centerX - 4, centerY + 4);
        ctx.lineTo(centerX + 4, centerY - 4);
        ctx.stroke();
      } else if(maze[r][c] === 5) {
        // Cherry dot design - small round cherry with stem and leaf
        const centerX = c * tileSize + tileSize/2;
        const centerY = r * tileSize + tileSize/2;
        
        // Cherry glow effect
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 8;
        
        // Outer cherry glow ring
        const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 8);
        outerGradient.addColorStop(0, "rgba(255, 0, 0, 0.4)");
        outerGradient.addColorStop(0.7, "rgba(200, 0, 0, 0.1)");
        outerGradient.addColorStop(1, "rgba(150, 0, 0, 0)");
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Main cherry body - smaller and rounder
        const cherryGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 5);
        cherryGradient.addColorStop(0, "#ff6666");
        cherryGradient.addColorStop(0.4, "#ff0000");
        cherryGradient.addColorStop(0.8, "#cc0000");
        cherryGradient.addColorStop(1, "#990000");
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = cherryGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Cherry highlight - smaller and positioned better
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(centerX - 1.5, centerY - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Brown stem
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(centerX + 2, centerY - 3);
        ctx.lineTo(centerX + 4, centerY - 5);
        ctx.stroke();
        
        // Green leaf - smaller and more leaf-like
        ctx.fillStyle = "#228B22";
        ctx.beginPath();
        ctx.ellipse(centerX + 3, centerY - 4, 2, 1, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Leaf highlight
        ctx.fillStyle = "#32CD32";
        ctx.beginPath();
        ctx.ellipse(centerX + 2.5, centerY - 4.2, 1, 0.5, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  // Use grid positions for precise rendering
  const drawX = pacman.x * tileSize + tileSize / 2;
  const drawY = pacman.y * tileSize + tileSize / 2;
  
  // Check if Pacman is invincible and should flash
  if (isInvincible && Math.floor(invincibilityTimer / 3) % 2 === 0) {
    return; // Skip drawing every few frames to create flashing effect
  }
  
  // Save context to rotate Pac-Man
  ctx.save();
  ctx.translate(drawX, drawY);
  
  // Rotate Pac-Man based on last valid direction (for visual consistency)
  if (pacman.lastDx > 0 || (pacman.lastDx === 0 && pacman.lastDy === 0 && pacman.dx > 0)) {
    // Moving right or default right - no rotation needed
    ctx.rotate(0);
  } else if (pacman.lastDx < 0 || (pacman.lastDx === 0 && pacman.lastDy === 0 && pacman.dx < 0)) {
    // Moving left - flip horizontally
    ctx.scale(-1, 1);
  } else if (pacman.lastDy < 0 || (pacman.lastDx === 0 && pacman.lastDy === 0 && pacman.dy < 0)) {
    // Moving up - rotate -90 degrees
    ctx.rotate(-Math.PI / 2);
  } else if (pacman.lastDy > 0 || (pacman.lastDx === 0 && pacman.lastDy === 0 && pacman.dy > 0)) {
    // Moving down - rotate 90 degrees
    ctx.rotate(Math.PI / 2);
  }
  
  // Create Pac-Man with simplified design for better performance
  const time = Date.now() * 0.005; // Reduced animation speed
  const mouthAngle = 0.25 + Math.sin(time * 2) * 0.15; // Reduced frequency
  
  // Simplified glow effect
  ctx.shadowColor = "#ffff00";
  ctx.shadowBlur = 10; // Reduced shadow blur
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Main Pac-Man body
  const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, tileSize / 2);
  bodyGradient.addColorStop(0, "#ffff00");
  bodyGradient.addColorStop(0.6, "#ffcc00");
  bodyGradient.addColorStop(1, "#ff9900");
  
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, tileSize / 2 - 2, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  
  // Remove shadow for other elements
  ctx.shadowBlur = 0;
  
  // Add Pac-Man eye
  ctx.fillStyle = "#000";
  
  let eyeX, eyeY;
  if (pacman.dx > 0) {
    // Right - eye on top right
    eyeX = 4; eyeY = -10;
  } else if (pacman.dx < 0) {
    // Left - eye on top right (will be flipped to top left)
    eyeX = 4; eyeY = -10;
  } else if (pacman.dy < 0) {
    // Up - eye on top
    eyeX = 0; eyeY = -10;
  } else if (pacman.dy > 0) {
    // Down - eye on bottom
    eyeX = 0; eyeY = 10;
  } else {
    // Default position (not moving)
    eyeX = 4; eyeY = -10;
  }
  
  // Draw eye
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2); // Reduced eye size
  ctx.fill();
  
  // Add eye highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // Reduced opacity
  ctx.beginPath();
  ctx.arc(eyeX - 1, eyeY - 1, 1.5, 0, Math.PI * 2); // Reduced highlight size
  ctx.fill();
  
  // Restore context
  ctx.restore();
}

function drawGhost(g) {
  // Use grid positions for precise rendering
  const gx = g.x * tileSize + tileSize / 2;
  const gy = g.y * tileSize + tileSize / 2;

  ctx.save();
  ctx.translate(gx, gy);
  
  // Get current time for animations
  const time = Date.now() * 0.003;
  
  // Create floating animation similar to welcome page
  const floatOffset = Math.sin(time + g.x * 0.5) * 3;
  const scale = 1 + Math.sin(time * 2 + g.y * 0.3) * 0.1;
  
  ctx.translate(0, floatOffset);
  ctx.scale(scale, scale);
  
  // Change ghost color and shadow when chasing, running, flashing, or frozen
  if (isGhostsFrozen) {
    // Frozen state - icy blue with frost effects
    ctx.fillStyle = "#00ffff"; // Icy blue when frozen
    ctx.shadowColor = "#0088ff";
    ctx.shadowBlur = 25; // Intense icy shadow
  } else if (g.isChasing) {
    ctx.fillStyle = "#ff0000"; // Red when chasing
    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 20; // More intense shadow when chasing
  } else if (g.isRunning) {
    ctx.fillStyle = "#ffffff"; // White when running
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 20; // Intense shadow when running
  } else if (g.flashTimer > 0) {
    // Flash effect when chase ends
    ctx.fillStyle = g.flashTimer % 2 === 0 ? "#ffffff" : g.color; // Alternate between white and original color
    ctx.shadowColor = g.flashTimer % 2 === 0 ? "#ffffff" : g.color;
    ctx.shadowBlur = 25; // Intense flash shadow
  } else {
    ctx.fillStyle = g.color;
    ctx.shadowColor = g.color;
    ctx.shadowBlur = 15;
  }
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Draw proper ghost body (rounded top, straight sides, wavy bottom)
  ctx.beginPath();
  
  // Top rounded section (head) - perfect circle
  const headRadius = tileSize / 2 - 2;
  ctx.arc(0, -tileSize / 2 + 6, headRadius, Math.PI, 0, false);
  
  // Right side - straight line down to create body
  ctx.lineTo(headRadius, -tileSize / 2 + 6);
  ctx.lineTo(headRadius, tileSize / 2 - 6);
  
  // Bottom spiky edge - create classic ghost tail with animated jellyfish movement
  const spikeCount = 7; // Odd number for center spike
  const baseSpikeHeight = 10; // Increased from 8 to 10 for more stretch
  const baseValleyHeight = 2;
  const spikeWidth = tileSize - 4;
  
  // Right to left spiky bottom with jellyfish animation
  for (let i = 0; i <= spikeCount; i++) {
    const x = headRadius - (i / spikeCount) * spikeWidth;
    
    // Create jellyfish-like wave movement with enhanced stretching
    const waveOffset = Math.sin(time * 1.5 + i * 0.8) * 4; // Increased from 3 to 4 for more stretch
    const jellyfishFlow = Math.sin(time * 0.8 + i * 0.6) * 3; // Increased from 2 to 3 for more stretch
    
    // Create alternating spikes with enhanced animated heights
    if (i % 2 === 0) {
      // Spike point - extend down with enhanced jellyfish animation
      const animatedSpikeHeight = baseSpikeHeight + waveOffset + jellyfishFlow;
      const y = tileSize / 2 - 6 + animatedSpikeHeight;
      ctx.lineTo(x, y);
    } else {
      // Valley point - shorter height with subtle animation
      const animatedValleyHeight = baseValleyHeight + waveOffset * 0.3;
      const y = tileSize / 2 - 6 + animatedValleyHeight;
      ctx.lineTo(x, y);
    }
  }
  
  // Left side - straight line back up to head
  ctx.lineTo(-headRadius, tileSize / 2 - 6);
  ctx.lineTo(-headRadius, -tileSize / 2 + 6);
  
  ctx.closePath();
  ctx.fill();
  
  // Remove shadow for other elements
  ctx.shadowBlur = 0;
  
  // Add floating particles around the ghost (like welcome page)
  const particleCount = 6;
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + time;
    const distance = 18 + Math.sin(time * 3 + i) * 5;
    const particleX = Math.cos(angle) * distance;
    const particleY = Math.sin(angle) * distance;
    
    ctx.fillStyle = g.color;
    ctx.globalAlpha = 0.6 + Math.sin(time * 2 + i) * 0.3;
    
    ctx.beginPath();
    ctx.arc(particleX, particleY, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add ice particles around frozen ghosts
  if (isGhostsFrozen) {
    const iceParticleCount = 8;
    for (let i = 0; i < iceParticleCount; i++) {
      const angle = (i / iceParticleCount) * Math.PI * 2 + time * 0.5;
      const distance = 25 + Math.sin(time * 2 + i) * 8;
      const particleX = Math.cos(angle) * distance;
      const particleY = Math.sin(angle) * distance;
      
      // Ice particle colors
      const iceColors = ["#ffffff", "#00ffff", "#0088ff", "#0044aa"];
      ctx.fillStyle = iceColors[i % iceColors.length];
      ctx.globalAlpha = 0.8 + Math.sin(time * 3 + i) * 0.2;
      
      // Draw ice crystals
      ctx.beginPath();
      ctx.arc(particleX, particleY, 1.5 + Math.sin(time + i) * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Add small ice spikes
      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo(particleX - 2, particleY);
        ctx.lineTo(particleX + 2, particleY);
        ctx.moveTo(particleX, particleY - 2);
        ctx.lineTo(particleX, particleY + 2);
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  
  // Reset alpha
  ctx.globalAlpha = 1;
  
  // Ghost eyes with proper positioning
  if (isGhostsFrozen) {
    // Frozen mode - icy blue eyes
    ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
  } else if (g.isChasing) {
    // Chase mode - red angry eyes
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
  } else {
    // Normal mode - white eyes
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  }
  
  // Left eye
  ctx.beginPath();
  ctx.arc(-8, -tileSize / 2 + 10, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Right eye
  ctx.beginPath();
  ctx.arc(8, -tileSize / 2 + 10, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupils
  if (g.isChasing) {
    // Chase mode - white pupils for contrast
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  } else {
    // Normal mode - black pupils
    ctx.fillStyle = "#000";
  }
  
  // Left pupil
  ctx.beginPath();
  ctx.arc(-8, -tileSize / 2 + 10, 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Right pupil
  ctx.beginPath();
  ctx.arc(8, -tileSize / 2 + 10, 2.5, 0, Math.PI * 2);
  ctx.fill();
  

  
  ctx.restore();
}

function canMove(x, y) {
  // Check if position is within bounds
  if (x < 0 || y < 0 || x >= maze[0].length || y >= maze.length) {
    return false;
  }
  
  // Check if position is not a wall
  if (maze[y][x] === 1) {
    return false;
  }
  
  return true;
}

function movePacman() {
  // Only move every few frames to slow down the game moderately
  moveCounter++;
  if (moveCounter < 5) return; // Move every 5 frames (moderate speed - 5% speed)
  moveCounter = 0;
  
  // Check if we can change direction immediately
  if (pacman.nextDx !== 0 || pacman.nextDy !== 0) {
    const nextX = pacman.x + pacman.nextDx;
    const nextY = pacman.y + pacman.nextDy;
    
    if (canMove(nextX, nextY)) {
      // We can turn, so update direction
      pacman.dx = pacman.nextDx;
      pacman.dy = pacman.nextDy;
      // Store last valid direction for visual rotation
      pacman.lastDx = pacman.dx;
      pacman.lastDy = pacman.dy;
      pacman.nextDx = 0;
      pacman.nextDy = 0;
    }
  }
  
  // Calculate next position
  let nextX = pacman.x + pacman.dx;
  let nextY = pacman.y + pacman.dy;
  
  // Check if the next position is valid
  if (canMove(nextX, nextY)) {
    // Move to next position
    pacman.x = nextX;
    pacman.y = nextY;
    
         // Check if we're moving to a dot
     if (maze[nextY][nextX] === 0) {
       maze[nextY][nextX] = 2; // collected
       score += 1; // Normal dots give 1 point
       showScoreDisplay(1, nextX, nextY); // Show +1 score display
       // Play dot eating sound
       playSound('dotEat');
       updateGameStatus(); // Update status immediately when score changes
       checkWin();
     } else if (maze[nextY][nextX] === 3) {
      // Collect power dot
      maze[nextY][nextX] = 2; // collected
      score += POWER_DOT_BONUS_SCORE;
      showScoreDisplay(POWER_DOT_BONUS_SCORE, nextX, nextY); // Show +30 score display
      
      // Remove power dot object
      powerDot = null;
      
      // 50% chance for either chasing or running mode
      const isChasingMode = Math.random() < 0.5;
      
      if (isChasingMode) {
        // Trigger all ghosts to chase mode
        ghosts.forEach(g => {
          g.isChasing = true;
          g.chaseTimer = 0;
          g.chaseDuration = POWER_DOT_CHASE_DURATION;
          // Reset running state
          g.isRunning = false;
          g.runningTimer = 0;
          g.runningDuration = 0;
        });
      } else {
        // Trigger all ghosts to running mode
        ghosts.forEach(g => {
          g.isRunning = true;
          g.runningTimer = 0;
          g.runningDuration = POWER_DOT_RUNNING_DURATION;
          // Reset chasing state
          g.isChasing = false;
          g.chaseTimer = 0;
          g.chaseDuration = 0;
        });
      }
      
      // Play power dot sound effect
      playSound('powerDot');
      
      updateGameStatus(); // Update status immediately when score changes
      checkWin();
    } else if (maze[nextY][nextX] === 4) {
      // Collect snowflake dot
      maze[nextY][nextX] = 2; // collected
      score += SNOWFLAKE_DOT_BONUS_SCORE;
      showScoreDisplay(SNOWFLAKE_DOT_BONUS_SCORE, nextX, nextY); // Show +40 score display
      
      // Remove snowflake dot object
      snowflakeDot = null;
      
      // Start ghost freeze mode
      startGhostFreeze();
      
      // Play snowflake dot sound effect
      playSound('snowflakeDot');
      
      updateGameStatus(); // Update status immediately when score changes
      checkWin();
    } else if (maze[nextY][nextX] === 5) {
      // Collect cherry dot
      maze[nextY][nextX] = 2; // collected
      score += CHERRY_DOT_BONUS_SCORE;
      showScoreDisplay(CHERRY_DOT_BONUS_SCORE, nextX, nextY); // Show +10 score display
      
      // Remove cherry dot object
      cherryDot = null;
      
      // Play cherry dot sound effect
      playSound('cherryDot');
      
      updateGameStatus(); // Update status immediately when score changes
      checkWin();
    }
     } else {
     // Hit a wall - stop completely
     pacman.dx = 0;
     pacman.dy = 0;
     pacman.nextDx = 0;
     pacman.nextDy = 0;
   }
}

function moveGhosts() {
  if (isGhostsFrozen) return;
  
  const directions = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
  
  ghosts.forEach(g => {
    if (g.flashTimer > 0) g.flashTimer--;
    
    g.moveDelay++;
    if (g.moveDelay < 8) return;
    g.moveDelay = 0;
    
    // Helper function to find best move based on target distance
    const findBestMove = (targetX, targetY, preferCloser = true) => {
      const validMoves = directions.filter(d => canMove(g.x + d.dx, g.y + d.dy));
      if (validMoves.length === 0) return null;
      
      let bestMove = validMoves[0];
      let bestDistance = preferCloser ? Infinity : 0;
      
      for (const move of validMoves) {
        const nextX = g.x + move.dx;
        const nextY = g.y + move.dy;
        const distance = Math.abs(nextX - targetX) + Math.abs(nextY - targetY);
        
        if (preferCloser ? distance < bestDistance : distance > bestDistance) {
          bestDistance = distance;
          bestMove = move;
        }
      }
      return bestMove;
    };
    
    // Helper function to choose random valid move
    const chooseRandomMove = () => {
      const validMoves = directions.filter(d => canMove(g.x + d.dx, g.y + d.dy));
      if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        g.dx = move.dx;
        g.dy = move.dy;
      }
    };
    
    // Chase mode logic
    if (g.isChasing) {
      g.chaseTimer++;
      if (g.chaseTimer >= g.chaseDuration) {
        g.isChasing = false;
        g.chaseTimer = 0;
        g.chaseDuration = 0;
        g.flashTimer = 10;
        updateGameStatus();
        playSound('chaseEnd');
        if (typeof stopHorrorSound === 'function') stopHorrorSound();
        chooseRandomMove();
      } else {
        const bestMove = findBestMove(pacman.x, pacman.y, true);
        if (bestMove) {
          g.dx = bestMove.dx;
          g.dy = bestMove.dy;
        } else {
          chooseRandomMove();
        }
      }
    } else if (g.isRunning) {
      g.runningTimer++;
      if (g.runningTimer >= g.runningDuration) {
        g.isRunning = false;
        g.runningTimer = 0;
        g.runningDuration = 0;
        g.flashTimer = 10;
        updateGameStatus();
        chooseRandomMove();
      } else {
        const bestMove = findBestMove(pacman.x, pacman.y, false);
        if (bestMove) {
          g.dx = bestMove.dx;
          g.dy = bestMove.dy;
        } else {
          chooseRandomMove();
        }
      }
    } else {
      // Normal movement mode
      if (!g.isChasing && Math.random() < 0.01) {
        g.isChasing = true;
        g.chaseTimer = 0;
        g.chaseDuration = 30;
        updateGameStatus();
        playSound('chaseStart');
        if (typeof startHorrorSound === 'function') startHorrorSound();
      }
      
      // Turn opportunities and random direction changes
      const possibleMoves = directions.filter(d => canMove(g.x + d.dx, g.y + d.dy));
      if (possibleMoves.length > 1 && Math.random() < 0.6) {
        const oppositeDirection = { dx: -g.dx, dy: -g.dy };
        const forwardMoves = possibleMoves.filter(move => 
          !(move.dx === oppositeDirection.dx && move.dy === oppositeDirection.dy)
        );
        const availableMoves = forwardMoves.length > 0 ? forwardMoves : possibleMoves;
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        g.dx = randomMove.dx;
        g.dy = randomMove.dy;
      } else if (Math.random() < 0.03) {
        chooseRandomMove();
      }
    }
    
    // Movement execution
    const nextX = g.x + g.dx;
    const nextY = g.y + g.dy;
    
    if (canMove(nextX, nextY)) {
      g.x = nextX;
      g.y = nextY;
    } else {
      // Wall collision handling
      const wallMoves = directions.filter(d => canMove(g.x + d.dx, g.y + d.dy));
      if (wallMoves.length > 0) {
        if (g.isChasing) {
          const bestMove = findBestMove(pacman.x, pacman.y, true);
          if (bestMove) {
            g.dx = bestMove.dx;
            g.dy = bestMove.dy;
          } else {
            const randomMove = wallMoves[Math.floor(Math.random() * wallMoves.length)];
            g.dx = randomMove.dx;
            g.dy = randomMove.dy;
          }
        } else if (g.isRunning) {
          const bestMove = findBestMove(pacman.x, pacman.y, false);
          if (bestMove) {
            g.dx = bestMove.dx;
            g.dy = bestMove.dy;
          } else {
            const randomMove = wallMoves[Math.floor(Math.random() * wallMoves.length)];
            g.dx = randomMove.dx;
            g.dy = randomMove.dy;
          }
        } else {
          const randomMove = wallMoves[Math.floor(Math.random() * wallMoves.length)];
          g.dx = randomMove.dx;
          g.dy = randomMove.dy;
        }
      }
    }
  });
}

function checkCollision() {
  // Use a reverse loop to avoid index issues when removing elements
  for (let i = ghosts.length - 1; i >= 0; i--) {
    const g = ghosts[i];
    // Use grid positions for accurate collision detection
    if (pacman.x === g.x && pacman.y === g.y) {
      // Check if Pacman is invincible
      if (isInvincible) {
        console.log('Pacman is invincible, no collision damage');
        break; // Skip collision while invincible
      }
      
      if (g.isRunning) {
        // Pac-Man eats the ghost when it's in running mode
        
        // Calculate ghost eating score with multiplier
        const currentTime = Date.now();
        if (currentTime - lastGhostEatTime < 5000) { // Within 5 seconds
          ghostEatMultiplier++;
        } else {
          ghostEatMultiplier = 1; // Reset multiplier if too much time passed
        }
        
        const ghostScore = 50 * ghostEatMultiplier;
        score += ghostScore;
        showScoreDisplay(ghostScore, g.x, g.y); // Show score with multiplier
        
        lastGhostEatTime = currentTime;
        
        // Store ghost data for respawn
        const ghostData = {
          originalX: g.x,
          originalY: g.y,
          color: g.color,
          respawnTimer: 0,
          respawnDelay: 150 // Exactly 5 seconds at 30 FPS (150 frames)
        };
        
        // Remove the ghost from the array
        ghosts.splice(i, 1);
        
        // Add to respawn queue
        ghostRespawnQueue.push(ghostData);
        
        // Debug logging
        console.log(`Ghost eaten! Added to respawn queue. Queue size: ${ghostRespawnQueue.length}`);
        console.log(`Ghost will respawn at (${ghostData.originalX}, ${ghostData.originalY}) in 3 seconds`);
        
        // Update game status
        updateGameStatus();
        
        // Check if all ghosts are eaten
        if (ghosts.length === 0) {
          // All ghosts eaten - level complete
          checkWin();
        }
        
        // Play ghost eating sound (you can add this function later)
        // playGhostEatSound();
        
        // Break out of the loop since we've handled this collision
        break;
        
            } else {
        // Normal collision - Pacman loses a life
        lives--;
        
        // Play life lost sound
        playSound('lifeLost');
        
        // Store current position for respawn
        respawnX = pacman.x;
        respawnY = pacman.y;
        
        // Update lives display
        updateGameStatus();
        
        if (lives <= 0) {
          // No more lives - game over
          running = false;
          gameOver = true;
          showGameOverScreen();
        } else {
          // Respawn Pacman with invincibility
          respawnPacman();
        }
        
        // Break out of the loop since we've handled this collision
        break;
      }
    }
  }
}

function respawnPacman() {
  // Respawn Pacman at the stored position
  pacman.x = respawnX;
  pacman.y = respawnY;
  
  // Reset Pacman's movement
  pacman.dx = 0;
  pacman.dy = 0;
  pacman.nextDx = 0;
  pacman.nextDy = 0;
  pacman.lastDx = 0;
  pacman.lastDy = 0;
  
  // Activate invincibility
  isInvincible = true;
  invincibilityTimer = 0;
  
  // Show respawn effect
  showScoreDisplay('RESPAWN', respawnX, respawnY);
  
  console.log(`Pacman respawned at (${respawnX}, ${respawnY}) with invincibility`);
}

function showGameOverScreen() {
  // Reset level to 1 when game over
  currentLevel = 1;
  
  // Create or find game over overlay
  let gameOverOverlay = document.getElementById('gameOverOverlay');
  if (!gameOverOverlay) {
    gameOverOverlay = document.createElement('div');
    gameOverOverlay.id = 'gameOverOverlay';
    gameOverOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    `;
    document.body.appendChild(gameOverOverlay);
  }
  
  // Create game over content
  const gameOverContent = document.createElement('div');
  gameOverContent.style.cssText = `
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border: 3px solid #ff6600;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 0 30px rgba(255, 102, 0, 0.5), 0 0 60px rgba(255, 102, 0, 0.3);
    max-width: 500px;
    width: 90%;
    position: relative;
    overflow: hidden;
  `;
  
  // Add animated background particles
  const particlesContainer = document.createElement('div');
  particlesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  `;
  
  // Create floating particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${i % 2 === 0 ? '#00ff88' : '#0088ff'};
      border-radius: 50%;
      opacity: 0.6;
      animation: float ${2 + i * 0.2}s ease-in-out infinite;
      animation-delay: ${i * 0.1}s;
    `;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particlesContainer.appendChild(particle);
  }
  
  gameOverContent.appendChild(particlesContainer);
  
  // Game Over title
  const title = document.createElement('h1');
  title.textContent = 'GAME OVER';
  title.style.cssText = `
    color: #ff6600;
    font-size: 3.5rem;
    margin: 0 0 20px 0;
    text-shadow: 0 0 20px #ff6600, 0 0 40px #ff6600;
    font-weight: bold;
    letter-spacing: 2px;
  `;
  
  // Skull emoji
  const skull = document.createElement('div');
  skull.textContent = '💀';
  skull.style.cssText = `
    font-size: 4rem;
    margin: 20px 0;
    animation: skullBounce 2s ease-in-out infinite;
  `;
  
  // Score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.cssText = `
    margin: 20px 0;
    color: white;
    font-size: 1.2rem;
    line-height: 1.6;
  `;
  
  const finalScore = document.createElement('div');
  finalScore.innerHTML = `Final Score: <span style="color: #ffff00; font-weight: bold; font-size: 1.4rem;">${score}</span>`;
  
  const highScoreDisplay = document.createElement('div');
  highScoreDisplay.innerHTML = `High Score: <span style="color: #ffff00; font-weight: bold; font-size: 1.4rem;">${highScore}</span>`;
  
  scoreDisplay.appendChild(finalScore);
  scoreDisplay.appendChild(highScoreDisplay);
  
  // Timer display
  const timerDisplay = document.createElement('div');
  timerDisplay.style.cssText = `
    margin: 30px 0 20px 0;
    color: white;
    font-size: 1.1rem;
    line-height: 1.6;
  `;
  
  const timerText = document.createElement('div');
  timerText.innerHTML = `Returning to menu in <span style="color: #ff6600; font-weight: bold; font-size: 1.3rem;">5</span> seconds...`;
  timerDisplay.appendChild(timerText);
  
  // Assemble the game over content
  gameOverContent.appendChild(title);
  gameOverContent.appendChild(skull);
  gameOverContent.appendChild(scoreDisplay);
  gameOverContent.appendChild(timerDisplay);
  
  // Start 5-second countdown timer
  let countdown = 5;
  const countdownInterval = setInterval(() => {
    countdown--;
    timerText.innerHTML = `Returning to menu in <span style="color: #ff6600; font-weight: bold; font-size: 1.3rem;">${countdown}</span> seconds...`;
    
            if (countdown <= 0) {
          clearInterval(countdownInterval);
          document.body.removeChild(gameOverOverlay);
          showWelcomePage();
        }
  }, 1000);

  // Clear any existing content and add new content
  gameOverOverlay.innerHTML = '';
  gameOverOverlay.appendChild(gameOverContent);
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
      50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    @keyframes skullBounce {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-5deg); }
      75% { transform: scale(1.1) rotate(5deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Play game over sound
      playSound('gameOver');
  
  // Stop horror sound if playing
  if (typeof stopHorrorSound === 'function') {
    stopHorrorSound();
  }
  
  clearInterval(gameInterval);
  updateHighScore();
}

function handleGhostRespawn() {
  // Check if there are ghosts waiting to respawn
  if (!ghostRespawnQueue || ghostRespawnQueue.length === 0) {
    return;
  }
  
  // Debug logging
  console.log(`Processing respawn queue: ${ghostRespawnQueue.length} ghosts waiting`);
  
  // Process each ghost in the respawn queue
  for (let i = ghostRespawnQueue.length - 1; i >= 0; i--) {
    const ghostData = ghostRespawnQueue[i];
    
    // Increment respawn timer
    ghostData.respawnTimer++;
    
    // Debug logging for each ghost
    console.log(`Ghost respawn timer: ${ghostData.respawnTimer}/${ghostData.respawnDelay} at position (${ghostData.originalX}, ${ghostData.originalY})`);
    
    // Check if it's time to respawn
    if (ghostData.respawnTimer >= ghostData.respawnDelay) {
      // Create new ghost at original position
      const newGhost = {
        x: ghostData.originalX,
        y: ghostData.originalY,
        color: ghostData.color,
        dx: -1, // Start moving left
        dy: 0,
        moveDelay: 0,
        isChasing: false,
        chaseTimer: 0,
        chaseDuration: 0,
        flashTimer: 20, // Flash for 20 frames when respawning
        isRunning: false,
        runningTimer: 0,
        runningDuration: 0
      };
      
      // Add the ghost back to the game
      ghosts.push(newGhost);
      
      // Remove from respawn queue
      ghostRespawnQueue.splice(i, 1);
      
      console.log(`Ghost respawned at position (${newGhost.x}, ${newGhost.y})`);
      
      // Play respawn sound
      playSound('ghostRespawn');
    }
  }
}

function checkWin() {
  for(let r=0; r < maze.length; r++) {
    for(let c=0; c < maze[r].length; c++) {
      if(maze[r][c] === 0) return;
    }
  }
  running = false;
  gameOver = true;
  
  // Create or find win overlay
  let winOverlay = document.getElementById('winOverlay');
  if (!winOverlay) {
    winOverlay = document.createElement('div');
    winOverlay.id = 'winOverlay';
    winOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    `;
    document.body.appendChild(winOverlay);
  }
  
  // Create win content
  const winContent = document.createElement('div');
  winContent.style.cssText = `
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border: 3px solid #00ff88;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3);
    max-width: 500px;
    width: 90%;
    position: relative;
    overflow: hidden;
  `;
  
  // Add animated background particles
  const particlesContainer = document.createElement('div');
  particlesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  `;
  
  // Create floating particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${i % 2 === 0 ? '#00ff88' : '#ffff00'};
      border-radius: 50%;
      opacity: 0.6;
      animation: float ${2 + i * 0.2}s ease-in-out infinite;
      animation-delay: ${i * 0.1}s;
    `;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particlesContainer.appendChild(particle);
  }
  
  winContent.appendChild(particlesContainer);
  
  // Win title
  const title = document.createElement('h1');
  title.textContent = '🎉 YOU WON! 🎉';
  title.style.cssText = `
    color: #00ff88;
    font-size: 3rem;
    margin: 0 0 20px 0;
    text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88;
    font-weight: bold;
    letter-spacing: 2px;
  `;
  
  // Trophy emoji
  const trophy = document.createElement('div');
  trophy.textContent = '🏆';
  trophy.style.cssText = `
    font-size: 4rem;
    margin: 20px 0;
    animation: trophyGlow 2s ease-in-out infinite;
  `;
  
  // Score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.cssText = `
    margin: 20px 0;
    color: white;
    font-size: 1.2rem;
    line-height: 1.6;
  `;
  
  const finalScore = document.createElement('div');
  finalScore.innerHTML = `Final Score: <span style="color: #ffff00; font-weight: bold; font-size: 1.4rem;">${score}</span>`;
  
  const highScoreDisplay = document.createElement('div');
  highScoreDisplay.innerHTML = `High Score: <span style="color: #ffff00; font-weight: bold; font-size: 1.4rem;">${highScore}</span>`;
  
  scoreDisplay.appendChild(finalScore);
  scoreDisplay.appendChild(highScoreDisplay);
  
         // Timer display
       const timerDisplay = document.createElement('div');
       timerDisplay.style.cssText = `
         margin: 30px 0 20px 0;
         color: white;
         font-size: 1.1rem;
         line-height: 1.6;
       `;
       
       const timerText = document.createElement('div');
       if (currentLevel < maxLevel) {
         timerText.innerHTML = `Moving to Level ${currentLevel + 1} in <span style="color: #00ff88; font-weight: bold; font-size: 1.3rem;">5</span> seconds...`;
       } else {
         timerText.innerHTML = `Returning to menu in <span style="color: #00ff88; font-weight: bold; font-size: 1.3rem;">5</span> seconds...`;
       }
       timerDisplay.appendChild(timerText);
       
       // Assemble the win content
       winContent.appendChild(title);
       winContent.appendChild(trophy);
       winContent.appendChild(scoreDisplay);
       winContent.appendChild(timerDisplay);
       
       // Start 5-second countdown timer
       let countdown = 5;
       const countdownInterval = setInterval(() => {
         countdown--;
         if (currentLevel < maxLevel) {
           timerText.innerHTML = `Moving to Level ${currentLevel + 1} in <span style="color: #00ff88; font-weight: bold; font-size: 1.3rem;">${countdown}</span> seconds...`;
         } else {
           timerText.innerHTML = `Returning to menu in <span style="color: #00ff88; font-weight: bold; font-size: 1.3rem;">${countdown}</span> seconds...`;
         }
         
         if (countdown <= 0) {
           clearInterval(countdownInterval);
           document.body.removeChild(winOverlay);
           // The level progression is handled by the setTimeout above
           // Make sure the game state is properly reset for the new level
           gameOver = false;
           running = false;
         }
       }, 1000);
  
  // Clear any existing content and add new content
  winOverlay.innerHTML = '';
  winOverlay.appendChild(winContent);
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
      50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    @keyframes trophyGlow {
      0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
      50% { transform: scale(1.1) rotate(5deg); filter: brightness(1.3); }
    }
  `;
  document.head.appendChild(style);
  
     // Play win sound
       playSound('win');
   
   // Stop horror sound if playing
   if (typeof stopHorrorSound === 'function') {
     stopHorrorSound();
   }
   
   clearInterval(gameInterval);
   updateHighScore();
   
          // Check if there's a next level
       if (currentLevel < maxLevel) {
         // Progress to next level automatically after countdown
         setTimeout(() => {
           // Reset game state for new level (but keep the score!)
           gameOver = false;
           running = false;
           
           // Load the next level
           loadLevel(currentLevel + 1);
           
           // Show countdown for the new level
           showCountdown();
         }, 5000); // Wait for the 5-second countdown to complete
       } else {
         // Final level completed - return to welcome page after countdown
         setTimeout(() => {
           showWelcomePage();
         }, 5000); // Wait for the 5-second countdown to complete
       }
}

function updateHighScore() {
  if(score > highScore) {
    highScore = score;
    localStorage.setItem("pacmanHighScore", highScore.toString());
    updateWelcomeHighScore();
  }
}

function showScoreDisplay(points, x, y) {
  const scoreDisplay = {
    points: points,
    x: x * tileSize + tileSize / 2,
    y: y * tileSize + tileSize / 2,
    timer: 0,
    maxTimer: 60, // Show for 2 seconds at 30 FPS
    alpha: 1.0
  };
  
  scoreDisplays.push(scoreDisplay);
}

function updateScoreDisplays() {
  for (let i = scoreDisplays.length - 1; i >= 0; i--) {
    const display = scoreDisplays[i];
    display.timer++;
    display.alpha = 1.0 - (display.timer / display.maxTimer);
    
    if (display.timer >= display.maxTimer) {
      scoreDisplays.splice(i, 1);
    }
  }
}

function drawScoreDisplays() {
  scoreDisplays.forEach(display => {
    ctx.save();
    ctx.globalAlpha = display.alpha;
    
    // Position the score display above the collection point
    const drawX = display.x;
    const drawY = display.y - 20 - (display.timer * 0.5); // Float upward
    
    // Set text properties
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    
    // Determine color based on points
    let color;
    if (display.points === 10) {
      color = '#ffff00'; // Yellow for normal dots
    } else if (display.points === 30) {
      color = '#00ffff'; // Cyan for power dots
    } else if (display.points >= 50) {
      // Ghost eating scores - different colors for multipliers
      if (display.points === 50) {
        color = '#ff8800'; // Orange for single ghost
      } else if (display.points === 100) {
        color = '#ff4400'; // Red-orange for double ghost
      } else if (display.points === 150) {
        color = '#ff2200'; // Dark red for triple ghost
      } else {
        color = '#ff0088'; // Pink for higher multipliers
      }
    } else {
      color = '#ffffff'; // White for other
    }
    
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Draw the score text
    ctx.strokeText(`+${display.points}`, drawX, drawY);
    ctx.fillText(`+${display.points}`, drawX, drawY);
    
    ctx.restore();
  });
}

function updateGameStatus() {
  // Update score display
  const currentScoreElement = document.getElementById('currentScore');
  if (currentScoreElement) {
    currentScoreElement.textContent = score;
  }
  
  // Update lives display
  const livesDisplayElement = document.getElementById('livesDisplay');
  if (livesDisplayElement) {
    livesDisplayElement.textContent = lives;
    if (lives <= 1) {
      livesDisplayElement.style.color = '#ff4400';
      livesDisplayElement.style.textShadow = '0 0 5px #ff4400';
    } else {
      livesDisplayElement.style.color = '#00ff88';
      livesDisplayElement.style.textShadow = 'none';
    }
  }
  
  // Update ghost status display
  const ghostStatusElement = document.getElementById('ghostStatus');
  if (ghostStatusElement) {
    const chasingGhosts = ghosts.filter(g => g.isChasing).length;
    const runningGhosts = ghosts.filter(g => g.isRunning).length;
    const respawningGhosts = ghostRespawnQueue ? ghostRespawnQueue.length : 0;
    
    if (chasingGhosts > 0) {
      ghostStatusElement.textContent = `Chasing (${chasingGhosts})`;
      ghostStatusElement.style.color = '#ff0000';
    } else if (runningGhosts > 0) {
      ghostStatusElement.textContent = `Running (${runningGhosts})`;
      ghostStatusElement.style.color = '#ffffff';
    } else if (respawningGhosts > 0) {
      // Calculate time remaining for next respawn
      const nextRespawn = ghostRespawnQueue ? 
        Math.min(...ghostRespawnQueue.map(g => g.respawnDelay - g.respawnTimer)) : 0;
      const secondsRemaining = Math.ceil(nextRespawn / 30); // Convert frames to seconds
      
      ghostStatusElement.textContent = `Respawning (${respawningGhosts}) - ${secondsRemaining}s`;
      ghostStatusElement.style.color = '#888888';
      
      // Debug logging
      console.log(`Respawn queue: ${respawningGhosts} ghosts, next respawn in ${secondsRemaining}s`);
    } else {
      ghostStatusElement.textContent = 'Normal';
      ghostStatusElement.style.color = '#ffff00';
    }
  }
  
  // Update power dot status display
  const powerDotStatusElement = document.getElementById('powerDotStatus');
  if (powerDotStatusElement) {
    if (powerDot) {
      powerDotStatusElement.textContent = 'Power Dot Active!';
      powerDotStatusElement.style.color = '#00ffff';
      powerDotStatusElement.style.textShadow = '0 0 10px #00ffff';
    } else {
      powerDotStatusElement.textContent = 'No Power Dot';
      powerDotStatusElement.style.color = '#888888';
      powerDotStatusElement.style.textShadow = 'none';
    }
  }
  
  // Update respawn queue display
  const respawnQueueElement = document.getElementById('respawnQueue');
  if (respawnQueueElement) {
    respawnQueueElement.textContent = ghostRespawnQueue ? ghostRespawnQueue.length : 0;
    if (ghostRespawnQueue && ghostRespawnQueue.length > 0) {
      respawnQueueElement.style.color = '#ff8800';
    } else {
      respawnQueueElement.style.color = '#888888';
    }
  }
  
  // Update ghost multiplier display
  const ghostMultiplierElement = document.getElementById('ghostMultiplier');
  if (ghostMultiplierElement) {
    ghostMultiplierElement.textContent = `${ghostEatMultiplier}x`;
    if (ghostEatMultiplier > 1) {
      ghostMultiplierElement.style.color = '#ff4400';
      ghostMultiplierElement.style.textShadow = '0 0 5px #ff4400';
    } else {
      ghostMultiplierElement.style.color = '#888888';
      ghostMultiplierElement.style.textShadow = 'none';
    }
  }
  
  // Update Pacman status display
  const pacmanStatusElement = document.getElementById('pacmanStatus');
  if (pacmanStatusElement) {
    if (isInvincible) {
      pacmanStatusElement.textContent = 'INVINCIBLE';
      pacmanStatusElement.style.color = '#00ffff';
      pacmanStatusElement.style.textShadow = '0 0 5px #00ffff';
    } else {
      pacmanStatusElement.textContent = 'Normal';
      pacmanStatusElement.style.color = '#00ff88';
      pacmanStatusElement.style.textShadow = 'none';
    }
  }
  
  // Update ghost freeze status display
  const ghostFreezeStatusElement = document.getElementById('ghostFreezeStatus');
  if (ghostFreezeStatusElement) {
    if (isGhostsFrozen) {
      const timeRemaining = Math.ceil((SNOWFLAKE_DOT_FREEZE_DURATION - ghostFreezeTimer) / 30); // Convert frames to seconds
      ghostFreezeStatusElement.textContent = `FROZEN (${timeRemaining}s)`;
      ghostFreezeStatusElement.style.color = '#00ffff';
      ghostFreezeStatusElement.style.textShadow = '0 0 5px #00ffff';
    } else {
      ghostFreezeStatusElement.textContent = 'Normal';
      ghostFreezeStatusElement.style.color = '#888888';
      ghostFreezeStatusElement.style.textShadow = 'none';
    }
  }
}

// Consolidated sound playing function
function playSound(soundType) {
  const soundFunctions = {
    chaseStart: () => generateAudio('scary'),
    chaseEnd: () => generateAudio('chaseEnd'),
    powerDot: () => generateAudio('power'),
    dotEat: () => generateAudio('num'),
    gameStart: () => generateAudio('gameStart'),
    gameOver: () => generateAudio('gameOver'),
    win: () => generateAudio('win'),
    countdown: () => generateAudio('countdown'),
    ghostRespawn: () => generateAudio('ghostRespawn'),
    lifeLost: () => generateAudio('lifeLost'),
    snowflakeDot: () => generateAudio('snowflakeDot'),
    cherryDot: () => generateAudio('cherryDot'),
    welcomeTheme: generateWelcomeTheme
  };
  
  const soundFunction = soundFunctions[soundType];
  if (typeof soundFunction === 'function') {
    soundFunction();
  } else {
    console.log(`${soundType} sound function not available`);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clearCanvas();
  drawMaze();
  drawPacman();
  ghosts.forEach(drawGhost);
  drawScoreDisplays(); // Draw floating score displays
}

function gameTick() {
  if(!running) return;
  
  // Increment frame counter
  frameCounter++;
  
  // Update game logic
  movePacman();
  moveGhosts();
  
  // Handle ghost respawning
  handleGhostRespawn();
  
  // Update score displays
  updateScoreDisplays();
  
  // Update invincibility timer
  if (isInvincible) {
    invincibilityTimer++;
    if (invincibilityTimer >= INVINCIBILITY_DURATION) {
      isInvincible = false;
      invincibilityTimer = 0;
      console.log('Pacman invincibility ended');
    }
  }
  
  // Update ghost freeze timer
  if (isGhostsFrozen) {
    ghostFreezeTimer++;
    if (ghostFreezeTimer >= SNOWFLAKE_DOT_FREEZE_DURATION) {
      isGhostsFrozen = false;
      ghostFreezeTimer = 0;
      console.log('Ghosts unfrozen');
      
      // Restore ghost movement
      ghosts.forEach(g => {
        if (g.frozenDx !== undefined && g.frozenDy !== undefined) {
          g.dx = g.frozenDx;
          g.dy = g.frozenDy;
          g.isChasing = g.frozenIsChasing || false;
          g.isRunning = g.frozenIsRunning || false;
          
          // Clear frozen state
          delete g.frozenDx;
          delete g.frozenDy;
          delete g.frozenIsChasing;
          delete g.frozenIsRunning;
        }
      });
    }
  }
  
  // Debug logging every 30 frames (1 second)
  if (frameCounter % 30 === 0) {
    console.log(`Frame ${frameCounter}: Respawn queue size: ${ghostRespawnQueue.length}, Active ghosts: ${ghosts.length}`);
  }
  
  // Power dot spawning logic
  powerDotSpawnTimer++;
  if (powerDotSpawnTimer >= POWER_DOT_SPAWN_INTERVAL) {
    spawnSpecialDot('power', powerDot, 3);
    powerDotSpawnTimer = 0;
  }
  
  // Snowflake dot spawning logic
  snowflakeDotSpawnTimer++;
  if (snowflakeDotSpawnTimer >= SNOWFLAKE_DOT_SPAWN_INTERVAL) {
    spawnSpecialDot('snowflake', snowflakeDot, 4);
    snowflakeDotSpawnTimer = 0;
  }
  
  // Cherry dot spawning logic
  cherryDotSpawnTimer++;
  if (cherryDotSpawnTimer >= CHERRY_DOT_SPAWN_INTERVAL) {
    spawnSpecialDot('cherry', cherryDot, 5);
    cherryDotSpawnTimer = 0;
  }
  
  // Check collision every frame for responsive gameplay
  checkCollision();
  
  // Update game status display
  updateGameStatus();
  
  // Draw the game
  draw();
}

function startGame() {
  if(!running && !gameOver) {
    running = true;
    lastTime = Date.now();
    // Use 30 FPS for moderate, manageable gameplay
    // Ghost respawn timing: 150 frames = 5 seconds at 30 FPS
    gameInterval = setInterval(gameTick, 33.33); // 30 FPS
    
    // Play game start sound
    playSound('gameStart');
    
    // Update game status when game starts
    updateGameStatus();
  }
}

function resetAndRestartGame() {
  // Reload current level
  loadLevel(currentLevel);
  
  // Reset game state
  score = 0;
  running = false;
  gameOver = false;
  
  // Stop horror sound if playing
  if (typeof stopHorrorSound === 'function') {
    stopHorrorSound();
  }
  
  // Draw initial state
  draw();
  
  // Update game status
  updateGameStatus();
  
  // Show countdown again
  showCountdown();
}

// Credits Animation
function changeCredit() {
  creditIndex = (creditIndex + 1) % credits.length;
  document.querySelector(".credits-text").textContent = "Created by " + credits[creditIndex];
}



// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to the button content
    const buttonContent = document.querySelector('.button-content');
    if (buttonContent) {
        buttonContent.addEventListener('click', function() {
            showGamePage();
        });
    }

    
    // Initialize welcome page
    showWelcomePage();
    updateWelcomeHighScore();
    
    // Initialize the game with level 1 (this sets up canvas size and initial state)
    loadLevel(1);
    
    // Start credits rotation
    setInterval(changeCredit, 2000);
    
    // Test audio loading
    setTimeout(() => {
        console.log('Testing audio elements...');
        const chaseSound = document.getElementById('chaseStartSound');
        if (chaseSound) {
            console.log('Chase sound element found, readyState:', chaseSound.readyState);
            console.log('Chase sound src:', chaseSound.currentSrc);
            chaseSound.addEventListener('loadstart', () => console.log('Chase sound loading started'));
            chaseSound.addEventListener('canplay', () => console.log('Chase sound can play'));
            chaseSound.addEventListener('error', (e) => console.log('Chase sound error:', e));
        } else {
            console.log('Chase sound element not found');
        }
    }, 1000);
});

// Audio Functions - Moved from HTML
// Create audio context for generating scary sounds
let audioContext;
let audioInitialized = false;

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioInitialized = true;
    console.log('Audio context initialized successfully');
  } catch (e) {
    console.log('Audio context failed:', e);
  }
}

// Initialize audio when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize audio context on first user interaction
  document.addEventListener('click', function() {
    if (!audioInitialized) {
      initAudio();
    }
  }, { once: true });
});

// Consolidated audio generation function
function generateAudio(soundType) {
  if (!audioContext || !audioInitialized) return;
  
  const soundConfigs = {
    scary: { type: 'sawtooth', freq: [80, 40], duration: 0.5, gain: [0.3, 0.01] },
    num: { type: 'sine', freq: [800, 1200, 600], duration: 0.2, gain: [0.2, 0.01] },
    power: { type: 'square', freq: [200, 800], duration: 0.3, gain: [0.25, 0.01] },
    gameStart: { type: 'triangle', freq: [400, 600, 300], duration: 0.4, gain: [0.3, 0.01] },
    chaseEnd: { type: 'sine', freq: [300, 150], duration: 0.3, gain: [0.25, 0.01] },
    gameOver: { type: 'sawtooth', freq: [200, 100, 50], duration: 1.2, gain: [0.3, 0.01] },
    win: { type: 'sine', freq: [523.25, 659.25, 783.99, 1046.50, 1318.51], duration: 0.2, gain: [0.2, 0.01] },
    countdown: { type: 'square', freq: [600, 800], duration: 0.15, gain: [0.25, 0.01] },
    ghostRespawn: { type: 'sine', freq: [300, 500, 200], duration: 0.4, gain: [0.2, 0.01] },
    lifeLost: { type: 'sawtooth', freq: [400, 200, 100], duration: 0.6, gain: [0.3, 0.01] },
    snowflakeDot: { type: 'sine', freq: [800, 1200, 600], duration: 0.3, gain: [0.2, 0.01] },
    cherryDot: { type: 'sine', freq: [600, 800, 400], duration: 0.25, gain: [0.2, 0.01] }
  };
  
  try {
    const config = soundConfigs[soundType];
    if (!config) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = config.type;
    
    // Handle frequency changes
    if (config.freq.length === 2) {
      oscillator.frequency.setValueAtTime(config.freq[0], audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(config.freq[1], audioContext.currentTime + config.duration);
    } else if (config.freq.length === 3) {
      oscillator.frequency.setValueAtTime(config.freq[0], audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(config.freq[1], audioContext.currentTime + config.duration * 0.5);
      oscillator.frequency.exponentialRampToValueAtTime(config.freq[2], audioContext.currentTime + config.duration);
    } else if (soundType === 'win') {
      // Special handling for win sound with multiple notes
      let currentTime = audioContext.currentTime;
      config.freq.forEach((freq, index) => {
        const noteOsc = audioContext.createOscillator();
        const noteGain = audioContext.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(audioContext.destination);
        
        noteOsc.type = config.type;
        noteOsc.frequency.setValueAtTime(freq, currentTime);
        noteGain.gain.setValueAtTime(config.gain[0], currentTime);
        noteGain.gain.exponentialRampToValueAtTime(config.gain[1], currentTime + config.duration);
        
        noteOsc.start(currentTime);
        noteOsc.stop(currentTime + config.duration);
        currentTime += config.duration + 0.05;
      });
      return;
    }
    
    gainNode.gain.setValueAtTime(config.gain[0], audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(config.gain[1], audioContext.currentTime + config.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.duration);
    
    console.log(`${soundType} sound generated successfully`);
  } catch (e) {
    console.log(`Failed to generate ${soundType} sound:`, e);
  }
}

// Function to generate classic Pac-Man welcome theme
function generateWelcomeTheme() {
  if (!audioContext || !audioInitialized) return;
  
  try {
    // Create Indian-inspired theme with bhangra feel
    // Using pentatonic scale similar to Punjabi music
    const notes = [
      { freq: 220.00, duration: 0.4, type: 'square' }, // A3 - base note
      { freq: 293.66, duration: 0.3, type: 'square' }, // D4 - dominant
      { freq: 329.63, duration: 0.3, type: 'square' }, // E4 - melodic
      { freq: 440.00, duration: 0.5, type: 'square' }, // A4 - higher octave
      { freq: 329.63, duration: 0.3, type: 'square' }, // E4 - return
      { freq: 293.66, duration: 0.4, type: 'square' }, // D4 - ending
      { freq: 220.00, duration: 0.6, type: 'square' }  // A3 - final
    ];
    
    let currentTime = audioContext.currentTime;
    
    // Add percussion-like rhythm (dhol-style)
    const percussionNotes = [
      { freq: 150, duration: 0.1, type: 'sawtooth' }, // Low dhol sound
      { freq: 200, duration: 0.08, type: 'sawtooth' }, // Mid dhol sound
      { freq: 120, duration: 0.12, type: 'sawtooth' }  // Bass dhol sound
    ];
    
    // Play percussion rhythm
    percussionNotes.forEach((perc, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = perc.type;
      oscillator.frequency.setValueAtTime(perc.freq, currentTime);
      
      gainNode.gain.setValueAtTime(0.08, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + perc.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + perc.duration);
      
      currentTime += perc.duration + 0.05;
    });
    
    // Reset time for main melody
    currentTime = audioContext.currentTime + 0.3; // Start melody after percussion
    
    notes.forEach((note, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = note.type;
      oscillator.frequency.setValueAtTime(note.freq, currentTime);
      
      // Add some variation to make it more interesting
      if (index === 3) { // Higher octave note
        oscillator.frequency.exponentialRampToValueAtTime(note.freq * 1.1, currentTime + note.duration * 0.5);
      }
      
      gainNode.gain.setValueAtTime(0.12, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration + 0.02; // Smaller gap for faster rhythm
    });
    
    console.log('Indian-inspired welcome theme with percussion generated successfully');
  } catch (e) {
    console.log('Failed to generate Indian-inspired welcome theme:', e);
  }
}

// Function to generate welcome theme with loop
let welcomeThemeInterval;
function startWelcomeTheme() {
  if (welcomeThemeInterval) {
    clearInterval(welcomeThemeInterval);
  }
  
  // Play theme immediately
  generateWelcomeTheme();
  
  // Loop every 3 seconds (theme duration + gap)
  welcomeThemeInterval = setInterval(() => {
    generateWelcomeTheme();
  }, 3000);
}

function stopWelcomeTheme() {
  if (welcomeThemeInterval) {
    clearInterval(welcomeThemeInterval);
    welcomeThemeInterval = null;
  }
}



// Function to generate continuous horror sound for chase mode
function generateHorrorSound() {
  if (!audioContext || !audioInitialized) return;
  
  try {
    // Create multiple oscillators for layered horror effect
    const oscillators = [];
    const gainNodes = [];
    
    // Layer 1: Low rumbling bass
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(45, audioContext.currentTime + 2);
    gain1.gain.setValueAtTime(0.15, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 2);
    
    // Layer 2: Creepy mid-range
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(120, audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + 1.5);
    gain2.gain.setValueAtTime(0.12, audioContext.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 1.5);
    
    // Layer 3: High-pitched screech
    const osc3 = audioContext.createOscillator();
    const gain3 = audioContext.createGain();
    osc3.type = 'square';
    osc3.frequency.setValueAtTime(800, audioContext.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 1);
    gain3.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + 1);
    
    // Connect all layers
    [osc1, osc2, osc3].forEach((osc, index) => {
      const gain = [gain1, gain2, gain3][index];
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 2);
      
      oscillators.push(osc);
      gainNodes.push(gain);
    });
    
    console.log('Horror sound generated successfully');
  } catch (e) {
    console.log('Failed to generate horror sound:', e);
  }
}

// Variables for horror sound loop
let horrorSoundInterval;
let isHorrorPlaying = false;

// Function to start continuous horror sound loop
function startHorrorSound() {
  if (isHorrorPlaying) return; // Already playing
  
  isHorrorPlaying = true;
  
  // Play horror sound immediately
  generateHorrorSound();
  
  // Loop every 2 seconds (duration of the horror sound)
  horrorSoundInterval = setInterval(() => {
    if (isHorrorPlaying) {
      generateHorrorSound();
    }
  }, 2000);
  
  console.log('Horror sound loop started');
}

// Function to stop horror sound loop
function stopHorrorSound() {
  if (!isHorrorPlaying) return; // Not playing
  
  isHorrorPlaying = false;
  
  if (horrorSoundInterval) {
    clearInterval(horrorSoundInterval);
    horrorSoundInterval = null;
  }
  
  console.log('Horror sound loop stopped');
}

// Function to load a specific level
function loadLevel(levelNumber) {
  if (!levels[levelNumber]) {
    console.log(`Level ${levelNumber} not found`);
    return false;
  }
  
  const level = levels[levelNumber];
  currentLevel = levelNumber;
  
  // Update canvas dimensions based on level
  const levelCols = level.maze[0].length;
  const levelRows = level.maze.length;
  canvas.width = levelCols * tileSize;
  canvas.height = levelRows * tileSize;
  
  // Load maze and ghosts from level data
  maze = JSON.parse(JSON.stringify(level.maze)); // Deep copy
  ghosts = JSON.parse(JSON.stringify(level.ghosts)); // Deep copy
  
  // Reset Pac-Man position to start
  pacman.x = 1;
  pacman.y = 1;
  pacman.dx = 0;
  pacman.dy = 0;
  pacman.nextDx = 0;
  pacman.nextDy = 0;
  pacman.lastDx = 0;
  pacman.lastDy = 0;
  pacman.moveDelay = 0;
  
     // Reset power dot
   powerDot = null;
   powerDotSpawnTimer = 0;
   
   // Reset move counter
   moveCounter = 0;
   
   // Reset frame counter
   frameCounter = 0;
   
   // Reset ghost states for new level
   ghosts.forEach(g => {
     g.isChasing = false;
     g.chaseTimer = 0;
     g.chaseDuration = 0;
     g.isRunning = false;
     g.runningTimer = 0;
     g.runningDuration = 0;
     g.flashTimer = 0;
   });
   
      // Reset ghost respawn queue for new level
   ghostRespawnQueue = [];
   
   // Reset score displays for new level
   scoreDisplays = [];
   
   // Reset ghost eating multiplier for new level
   ghostEatMultiplier = 1;
   lastGhostEatTime = 0;
   
   // Reset invincibility system for new level
   isInvincible = false;
   invincibilityTimer = 0;
   
   // Reset snowflake dot system for new level
   snowflakeDot = null;
   snowflakeDotSpawnTimer = 0;
   isGhostsFrozen = false;
   ghostFreezeTimer = 0;
   
   // Reset cherry dot system for new level
   cherryDot = null;
   cherryDotSpawnTimer = 0;
   
   // Update level indicator
   const levelIndicator = document.getElementById('levelIndicator');
  if (levelIndicator) {
    levelIndicator.textContent = `LEVEL ${currentLevel}`;
  }
  
     console.log(`Loaded level ${currentLevel} - Maze: ${levelCols}x${levelRows}, Ghosts: ${ghosts.length}`);
   console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
   console.log(`Maze array length: ${maze.length}, First row length: ${maze[0] ? maze[0].length : 'undefined'}`);
   
   // Force a redraw to ensure the new level is visible
   draw();
   
   return true;
}

async function pollESP32() {
  await getDirection(); // מעדכן pacman.nextDx / pacman.nextDy
  // קורא לעצמו שוב במהירות גבוהה (למשל כל 50 מ״ש)
  setTimeout(pollESP32, 50);
}

// מתחיל את polling כשהמשחק מתחיל
pollESP32();

// ============================
// PACMAN CONTROLS: Keyboard + ESP32
// ============================

// Keyboard input
document.addEventListener('keydown', function(event) {
  if (!running) return;

  switch (event.key) {
    case 'ArrowUp':
      pacman.nextDx = 0;
      pacman.nextDy = -1;
      break;
    case 'ArrowDown':
      pacman.nextDx = 0;
      pacman.nextDy = 1;
      break;
    case 'ArrowLeft':
      pacman.nextDx = -1;
      pacman.nextDy = 0;
      break;
    case 'ArrowRight':
      pacman.nextDx = 1;
      pacman.nextDy = 0;
      break;
    default:
      // אין פעולה עבור מקשים אחרים
      break;
  }
});

// ============================
// ESP32 remote control
// ============================
async function getDirection() {
  try {
    const response = await fetch("http://192.168.4.1:8080/");
    const direction = await response.text();
    // מסיר רווחים או תווים נוספים
    const dir = direction.trim();
    console.log("ESP32 direction:", dir);

    switch (dir) {
      case "U":
        pacman.nextDx = 0;
        pacman.nextDy = -1;
        break;
      case "D":
        pacman.nextDx = 0;
        pacman.nextDy = 1;
        break;
      case "L":
        pacman.nextDx = -1;
        pacman.nextDy = 0;
        break;
      case "R":
        pacman.nextDx = 1;
        pacman.nextDy = 0;
        break;
      default:
        // אין שינוי אם הכיוון לא תקין
        break;
    }
  } catch (error) {
    console.error("ESP32 CONNECTION ERROR:", error);
  }
}