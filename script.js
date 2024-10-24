const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const ballRadius = 20;
const demonCircleRadius = 40;
const demonCircleX = canvas.width / 2;
const demonCircleY = canvas.height / 4;

let balls = [];
let ballCount = 10;

document.getElementById('count').textContent = ballCount;

for (let i = 0; i < ballCount; i++) {
    balls.push({
        x: Math.random() * (canvas.width - ballRadius * 2) + ballRadius,
        y: Math.random() * (canvas.height - ballRadius * 2) + ballRadius,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        color: getRandomColor()
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawDemonCircle() {
    ctx.beginPath();
    ctx.arc(demonCircleX, demonCircleY, demonCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDemonCircle();

    balls.forEach((ball, index) => {
        // 碰撞检测
        for (let j = 0; j < balls.length; j++) {
            if (j !== index && isColliding(ball, balls[j])) {
                ball.color = getRandomColor();
            }
        }

        // 碰撞恶魔圈
        if (isCollidingWithDemonCircle(ball)) {
            balls.splice(index, 1);
            ballCount--;
            document.getElementById('count').textContent = ballCount;
            return;
        }

        // 更新位置
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 边界反弹
        if (ball.x - ballRadius < 0 || ball.x + ballRadius > canvas.width) {
            ball.dx = -ball.dx;
        }
        if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
            ball.dy = -ball.dy;
        }

        // 绘制小球
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    });

    requestAnimationFrame(drawBalls);
}

function isColliding(ball1, ball2) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < ballRadius * 2;
}

function isCollidingWithDemonCircle(ball) {
    const dx = ball.x - demonCircleX;
    const dy = ball.y - demonCircleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < ballRadius + demonCircleRadius;
}

drawBalls();