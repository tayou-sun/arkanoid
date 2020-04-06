
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var blocks = [];
var score = 0;
var blockRowCount = 4;
var blockColumnCount = 2;

var blockInfo = {
    width: 80,
    height: 30,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

const brickInfo = {
    w: 70,
    h: 20,
    padding: 20,
    offsetX: 35,
    offsetY: 80,
    visible: true
};

const paddleInfo = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    width: 80,
    height: 10,
    dx: 0,
    speed: 8
}


function initBlocks() {
    for (var i = 0; i < blockRowCount; i++) {
        blocks[i] = [];
        for (var j = 0; j < blockColumnCount; j++) {
            var x = i * (blockInfo.width + 10) + 40;
            var y = j * (blockInfo.height + 10) + 40;

            blocks[i][j] = { x, y, ...blockInfo };
        }
    }
}

function drawBlocks() {

    blocks.forEach(x => {
        x.forEach(block => {
            ctx.beginPath();
            ctx.rect(block.x, block.y, block.width, block.height);
            ctx.fillStyle = block.visible ? '#e0f7ff' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#e0f7ff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleInfo.x, paddleInfo.y, paddleInfo.width, paddleInfo.height);
    ctx.fillStyle = '#e0f7ff';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall()
    drawBlocks();
    drawPaddle();
    drawScore();
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;   

    }

    blocks.forEach(element => {
        element.forEach(block => {
            if (block.visible) {
                if (ball.y + ball.size > block.y &&
                    ball.x + ball.size > block.x &&
                    ball.x - ball.size < block.x + block.width &&
                    ball.y - ball.size < block.y + block.height) {
                    ball.dy *= -1;
                    block.visible = false;
                    score++;
                }
            }
        })
    });

    if (ball.y + ball.size > paddleInfo.y &&
        ball.x + ball.size < paddleInfo.x + paddleInfo.width &&
        ball.x - ball.size > paddleInfo.x) {
        ball.dy *= -1;
    }

    if (ball.y + ball.size > canvas.height){
        setAllBlocksVisible();
        score = 0;
    }
}

function movePaddle() {
    paddleInfo.x += paddleInfo.dx;

    if (paddleInfo.x < 0){
        paddleInfo.x = 0
    }

    if (paddleInfo.x + paddleInfo.width > canvas.width){
        paddleInfo.x = canvas.width - paddleInfo.width
    }
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Результат: ${score}`, canvas.width - 130, 30);
}


function setAllBlocksVisible() {
    blocks.forEach(x=>{
        x.forEach(block =>{
            block.visible = true;
        })
    })
}
function update() {
    moveBall();
    movePaddle();
    draw();

    requestAnimationFrame(update)
}

document.addEventListener('keydown', event => {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        paddleInfo.dx = paddleInfo.speed;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        paddleInfo.dx = -paddleInfo.speed;
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'Right' ||
        event.key === 'ArrowRight' ||
        event.key === 'Left' ||
        event.key === 'ArrowLeft'
    ) {
        paddleInfo.dx = 0;
    }
});

initBlocks();
update();
