let board
let boardWidth = 500
let boardHeight = 500

let playerWidth = 80
let playerHeight = 10
let playerVelocityX = 10

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
}

// ball
let ballWidth = 10
let ballHeight = 10
let ballVelocityX = 3
let ballVelocityY = 2

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}


window.onload = () => {
    board = document.getElementById('board')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d')

    // draw player
    context.fillStyle = "#e68122"
    context.fillRect(player.x, player.y, player.width, player.height)

    requestAnimationFrame(update)
    document.addEventListener('keydown', movePlayer)
}

// Game Loop
function update() {
    requestAnimationFrame(update)
    // clear board
    context.clearRect(0, 0, boardWidth, boardHeight)

    // draw player
    context.fillStyle = "#e68122"
    context.fillRect(player.x, player.y, player.width, player.height)

    // draw ball
    context.fillStyle = "#ffffff"
    ball.x += ball.velocityX
    ball.y += ball.velocityY
    context.fillRect(ball.x, ball.y, ball.width, ball.height)

    // ball off walls collision detection
    if (ball.y <= 0) {// if ball touches top wall
        ball.velocityY *= -1 // reverse direction of ball
    }
    else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        // if ball touches left or right wall
        ball.velocityX *= -1 // reverse direction of ball
    }
    else if (ball.y + ball.height >= boardHeight) { // if ball touches bottom
        // Game ended
    }

    // ball off player collision detection
    if (checkTopCollision(ball, player) || checkBottomCollision(ball, player)) {
        ball.velocityY *= -1 // reverse direction of ball
    }
    else if (checkLeftCollision(ball, player) || checkRightCollision(ball, player)) {
        ball.velocityX *= -1 // reverse direction of ball
    }
}

function outOfLimit(xPosition) {
    return (xPosition < 0 || xPosition + player.width > boardWidth)
}

function movePlayer(event) {
    if (event.code == 'ArrowLeft') {
        let nextPlayerX = player.x - player.velocityX
        if (!outOfLimit(nextPlayerX)) {
            player.x = nextPlayerX
        }
    }
    else if (event.code == 'ArrowRight') {
        let nextPlayerX = player.x + player.velocityX
        if (!outOfLimit(nextPlayerX)) {
            player.x = nextPlayerX
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function checkTopCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y
}

function checkBottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y
}

function checkLeftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x
}

function checkRightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x
}