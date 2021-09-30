const canvas = document.getElementById('arkanoid'); 
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 500;
var brickRowCount = Math.floor(Math.random() * 7) + 2;
var brickHeight = 30;
var brickPadding = 4;
var paddleWidth = 140;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var rightPress = false;
var leftPress = false;
// var spacePress = false;
var interval;

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 24,
    dx: 1,
    dy: 1,
    width: 10,
    height: 10,
    radius: 10,
    score: 0,
    rotate: Math.PI / 4 + Math.random() * Math.PI / 2,
}

const paddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - 15,
    width: paddleWidth,
    height: 10,
}

var bricks = [];
for(var i = 0; i < brickRowCount; i++) {
    var brickColumnCount = Math.floor(Math.random() * 3) + 3;
    var brickWidth = Math.floor((canvas.width - ((brickColumnCount - 1) * brickPadding)) - (2 * brickOffsetLeft)) / brickColumnCount;
    for(var j = 0; j < brickColumnCount; j++) {
        bricks.push({
            width: brickWidth,
            height: brickHeight,
            x: (j * (brickWidth + brickPadding)) + brickOffsetLeft,
            y: (i * (brickHeight + brickPadding)) + brickOffsetTop,
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
        })
    }
}

function drawBricks() {
    bricks.forEach(function(brick) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = "rgba(" + brick.r + "," + brick.g + "," + brick.b + ",1)";
        ctx.fill();
        ctx.closePath();
    })
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#bb498d";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#420320";
    ctx.fill();
    ctx.closePath();
}

function ballScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#420320";
    ctx.fillText("Score: " + ball.score, canvas.width - 95, 20);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('keyup', gameStart, false)

function keyDownHandler(e) {
    if(e.key == "ArrowRight") {
        rightPress = true;
    }
    else if(e.key == "ArrowLeft") {
        leftPress = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "ArrowRight") {
        rightPress = false;
    }
    else if(e.key == "ArrowLeft") {
        leftPress = false;
    }
}

function gameStart(e) {
    if (e.code === 'Space') {
        interval = setInterval(game, 7);     
    }
}

function isCollide(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function gameOverDraw() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#420320";
    ctx.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2 - 20);
    document.removeEventListener('keyup', event => {
        if (event.code === 'Space') {
            interval = setInterval(game, 7);
        }
    });
} 

function gameWin() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#420320";
    ctx.fillText("CONGRATULATIONS, YOU WON!!!", canvas.width / 2 - 240, canvas.height / 2 - 20);
}

function drawGame() {
    drawBall();
    drawBricks();
    drawPaddle();
    ballScore();
}

drawGame();

function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGame();

    if(ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if(ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    }

    if(rightPress && paddle.x < canvas.width - paddle.width) {
        paddle.x += 4;
    }  else if(leftPress && paddle.x > 0) {
        paddle.x -= 4;
    }

    if (isCollide(ball, paddle)) {
        ball.dy = -ball.dy;
        ball.y = paddle.y - ball.height;
    }

    for (let i = 0; i < bricks.length; i++) {
        let brick = bricks[i];
        if (ball.x - ball.radius + brickOffsetLeft + brickPadding > brick.x && 
            ball.x - ball.radius < brick.x + brickWidth && 
            ball.y - ball.radius + brickOffsetLeft + brickPadding > brick.y && 
            ball.y - ball.radius < brick.y + brickHeight) {
            bricks.splice(i, 1);
            ball.dy = -ball.dy;
            ball.score ++;            
        }
    } 

    if(bricks.length == 0) {
        
        document.removeEventListener('keyup', gameStart, false)
        setTimeout(() => {
            clearInterval(interval);
        }, 300);
        gameWin();
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.dy > canvas.height - ball.radius) {
        ball.x += 0;
        ball.y -= 0;
        gameOverDraw();
        document.removeEventListener('keyup', gameStart, false)
        clearInterval(interval);
    };
}

