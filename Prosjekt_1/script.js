//JQuery usage, for toggling ai.
var aiToggle = false;
$(document).ready(function() {
    $('a#button').click(function() {
        $(this).toggleClass("down");

    });
});

$(document).ready(function() {
    $('a.toggler').click(function() {
        $(this).toggleClass('off');
        aiToggle = !aiToggle;
        console.log(aiToggle);
    });
});

var c = document.getElementById("myCanvas");
ctx = c.getContext("2d");
ctx.fillRect(0, 0, c.width, c.height);
ctx.fillStyle = 'black';

var UpPressed2 = false;
var DownPressed2 = false;
var UpPressed1 = false;
var DownPressed1 = false;

var radius = 6;
var raf;
var paddleH = 60;
var paddleW = 7;
var paddle1Y = paddle2Y = c.height / 2;
var paddle1X = c.width / 20;
var paddle2X = paddle1X * 19;
var scoreP1 = 0;
var scoreP2 = 0;

//TODO: Fiks hitbox så en ball som treffer et hjørn ikke går inn i paddle.
//Kan fikses ved å extende hitboks skrått.

//Drawing ball and keeping radius global for colision purposes.
var ball = {
    x: c.width / 2,
    y: c.height / 2,
    vx: 2,
    vy: -2,
    color: 'green',
    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

//Add eventlistners for keypresses
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Drawing the left most paddle.
function drawPaddle1() {
    ctx.beginPath();
    ctx.rect(paddle1X, paddle1Y, paddleW, paddleH);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

//Drawing the right most paddle.
function drawPaddle2() {
    ctx.beginPath();
    ctx.rect(paddle2X, paddle2Y, -paddleW, paddleH);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawDotted() {
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.moveTo(c.width / 2, 0);
    ctx.lineTo(c.width / 2, c.height);
    ctx.stroke();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "14px Arial";
    ctx.fillStyle = "grey";
    ctx.fillText(scoreP1, c.width / 3, c.height / 7);
    ctx.fillText(scoreP2, c.width / 3 * 2, c.height / 7);
}

//Function to handle drawing figures
function drawFigs() {
    drawDotted();
    drawScore();
    ball.draw();
    drawPaddle1();
    drawPaddle2();
}

//Main heavy lifting function, handles redrawing and boundaries.
function draw() {
    ctx.fillStyle = 'black'
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fill();
    drawFigs();
    ball.y += ball.vy;
    ball.x += ball.vx;

    move1();
    move2();

    //Collision of ball against edge of screen.
    if (ball.y + ball.vy > c.height - radius || ball.y + ball.vy < radius) {
        ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > c.width - radius || ball.x + ball.vx < radius) {
        ball.vx = -ball.vx;
    }
    //Collision of ball against paddle of player 2.
    if (ball.y + radius > paddle1Y && ball.y - radius < paddle1Y + paddleH) {
        if (ball.x + radius > paddle1X && ball.x - radius < paddle1X + paddleW) {
            //Give player a point if they recieved the ball
            if (ball.vx < 0) {
                scoreP1 += 1;
            }
            console.log(scoreP1);
            ball.vx = -ball.vx;
        }
    }
    //Collision of ball against paddle of player 2.
    if (ball.y + radius > paddle2Y && ball.y - radius < paddle2Y + paddleH) {
        if (ball.x + radius > paddle2X - paddleW && ball.x - radius < paddle2X) {
            //Give player a point if they recieved the ball
            if (ball.vx > 0) {
                scoreP2 += 1;
            }
            console.log(scoreP2);
            ball.vx = -ball.vx;
        }
    }


    raf = window.requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    // 38 is the Up arrow key
    if (e.keyCode == '38') {
        UpPressed2 = true;

        // 40 is the Down arrow key
    } else if (e.keyCode == '40') {
        DownPressed2 = true;
    }
    // 87 is the W key
    if (e.keyCode == '87') {
        UpPressed1 = true;

        // 83 is the S key
    } else if (e.keyCode == '83') {
        DownPressed1 = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == '38') {
        UpPressed2 = false;

    } else if (e.keyCode == '40') {
        DownPressed2 = false;
    }
    if (e.keyCode == '87') {
        UpPressed1 = false;
    } else if (e.keyCode == '83') {
        DownPressed1 = false;
    }
}

function move1() {
    if (UpPressed1) {
        paddle1Y -= 5;
        if (paddle1Y < 0) {
            paddle1Y = 0;
        }
    } else if (DownPressed1) {
        paddle1Y += 5;
        if (paddle1Y + paddleH > c.height) {
            paddle1Y = c.height - paddleH;
        }
    }
}

function move2() {
    if (aiToggle) {
        if (ball.vy < 0) {
            paddle2Y -= 2;
            if (paddle2Y < 0) {
                paddle2Y = 0;
            }
        } else if (ball.vy) {
            paddle2Y += 2;
            if (paddle2Y + paddleH > c.height) {
                paddle2Y = c.height - paddleH;
            }
        }
    } else {
        if (UpPressed2) {
            paddle2Y -= 5;
            if (paddle2Y < 0) {
                paddle2Y = 0;
            }
        } else if (DownPressed2) {
            paddle2Y += 5;
            if (paddle2Y + paddleH > c.height) {
                paddle2Y = c.height - paddleH;
            }
        }
    }
}

//Start animation when the mouse is hovering over canvas window.
c.addEventListener('mouseover', function(e) {
    raf = window.requestAnimationFrame(draw);
});

//Fun little change ball color to red and back.
c.addEventListener('click', function(e) {
    if (ball.color == 'green') {
        ball.color = 'red';
    } else {
        ball.color = 'green';
    }
})

//Pause window when the mouse aint there.
c.addEventListener('mouseout', function(e) {
    window.cancelAnimationFrame(raf);
});

//Could use setInterval here, but then id need to change variables to lower speed values for the ball :)
drawFigs();