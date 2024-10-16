let board;
let boardWidth = 500;   // Width of the game board
let boardHeight = 500;  // Height of the game board

// Player properties
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;  // Horizontal movement speed of the player

// Player object with position, dimensions, and velocity
let player = {
    x: boardWidth / 2 - playerWidth / 2,  // Start position in the middle of the board
    y: boardHeight - playerHeight - 5,    // Position near the bottom of the board
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX            // Movement speed in X direction
}

// Ball properties
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;   // Horizontal speed of the ball
let ballVelocityY = 2;   // Vertical speed of the ball

// Ball object with position, dimensions, and velocity
let ball = {
    x: boardWidth / 2,   // Start in the middle of the board
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,   // Horizontal movement speed
    velocityY: ballVelocityY    // Vertical movement speed
}

// bricks
let brickArray = [];
let brickWidth = 50;
let brickHeight = 10;
let brickColumns = 8;
let brickRows = 3;
let brickMaxRows = 10 // limit of rows
let brickCount = 0

// starting brick (corner top left)
let brickX = 15;
let brickY = 45


// This function is called once the window loads
window.onload = () => {
    board = document.getElementById('board');  // Get the canvas element
    board.height = boardHeight;  // Set the board height
    board.width = boardWidth;    // Set the board width
    context = board.getContext('2d');  // Get the 2D drawing context

    // Draw the player rectangle on the board
    context.fillStyle = "#e68122";  // Color of the player
    context.fillRect(player.x, player.y, player.width, player.height);  // Draw player

    // Start the game loop
    requestAnimationFrame(update);
    // Add event listener for player movement
    document.addEventListener('keydown', movePlayer);

    // Create bricks
    createBricks();
}

// Game Loop
function update() {
    requestAnimationFrame(update);  // Continuously calls update function to create a game loop

    // Clear the canvas to redraw each frame
    context.clearRect(0, 0, boardWidth, boardHeight);

    // Draw the player
    context.fillStyle = "#e68122";
    context.fillRect(player.x, player.y, player.width, player.height);

    // Update ball position by adding velocity to the current position
    context.fillStyle = "#ffffff";  // Color of the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);  // Draw the ball

    // Ball collision with the walls
    if (ball.y <= 0) {  // Ball hits the top wall
        ball.velocityY *= -1;  // Reverse the vertical direction
    } else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {  // Ball hits left or right wall
        ball.velocityX *= -1;  // Reverse the horizontal direction
    } else if (ball.y + ball.height >= boardHeight) {  // Ball hits the bottom
        // Game over
    }

    // Check for ball collision with player paddle
    if (checkTopCollision(ball, player) || checkBottomCollision(ball, player)) {
        ball.velocityY *= -1;  // Reverse vertical direction on collision
    } else if (checkLeftCollision(ball, player) || checkRightCollision(ball, player)) {
        ball.velocityX *= -1;  // Reverse horizontal direction on collision
    }

    // draw bricks
    context.fillStyle = "#31ce36"
    for (let i = 0; i < brickArray.length; i++) {
        let brick = brickArray[i];
        if (!brick.break) {
            if (checkTopCollision(ball, brick) || checkBottomCollision(ball, brick)) {
                brick.break = true;
                ball.velocityY *= -1; // Reverse vertical direction on collision
                brickCount--;
            }
            else if(checkLeftCollision(ball, brick) || checkRightCollision(ball, brick)){
                brick.break = true;
                ball.velocityX *= -1; // Reverse horizontal direction on collision
                brickCount--;
            }
            context.fillRect(brick.x, brick.y, brickWidth, brickHeight);
        }
    }
}

// Check if the player is out of the game board limits
function outOfLimit(xPosition) {
    return (xPosition < 0 || xPosition + player.width > boardWidth);  // Returns true if player exceeds the boundaries
}

// Move player based on key press (ArrowLeft or ArrowRight)
function movePlayer(event) {
    if (event.code == 'ArrowLeft') {  // Move left
        let nextPlayerX = player.x - player.velocityX;
        if (!outOfLimit(nextPlayerX)) {  // Check if movement is within limits
            player.x = nextPlayerX;  // Update player position
        }
    } else if (event.code == 'ArrowRight') {  // Move right
        let nextPlayerX = player.x + player.velocityX;
        if (!outOfLimit(nextPlayerX)) {  // Check if movement is within limits
            player.x = nextPlayerX;  // Update player position
        }
    }
}

// Detect general collision between two objects (rectangles)
function detectCollision(a, b) {
    // Check if the right side of object 'a' is further to the left than the left side of object 'b'.
    return a.x < b.x + b.width &&
        // Check if the left side of object 'a' is further to the right than the right side of object 'b'.
        a.x + a.width > b.x &&
        // Check if the bottom side of object 'a' is higher than the top side of object 'b'.
        a.y < b.y + b.height &&
        // Check if the top side of object 'a' is lower than the bottom side of object 'b'.
        a.y + a.height > b.y;
    // If all four of these conditions are true, it means that object 'a' and object 'b' are overlapping
    // either horizontally, vertically, or both — which indicates a collision.
}

// Check if the ball collides with the top of the block (player)
function checkTopCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

// Check if the ball collides with the bottom of the block (player)
function checkBottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

// Check if the ball collides with the left side of the block (player)
function checkLeftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

// Check if the ball collides with the right side of the block (player)
function checkRightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

// Function to create bricks
function createBricks() {
    brickArray = []
    for (let c = 0; c < brickColumns; c++) {
        for (let r = 0; r < brickRows; r++) {
            let brick = {
                x: brickX + c * brickWidth + c * 10, // *10 space between the bricks
                y: brickY + r * brickHeight + r * 10,// *10 space between the bricks
                width: brickWidth,
                height: brickHeight,
                break: false
            }
            brickArray.push(brick);
        }
    }
    brickCount = brickArray.length;
}
