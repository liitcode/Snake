const foodSound = new Audio("../assets/food.wav");
const gameOverSound = new Audio("../assets/lose.wav");
const moveSound = new Audio("../assets/move.wav");
const bgMusic = new Audio("../assets/bg.mp3");

bgMusic.loop = true;
bgMusic.play();

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class snakeBody {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

let speed = 7;
let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;
let headX = 10;
let headY = 10;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

const bodyParts = [];
let tailLength = 2;

let score = 0;

function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if(result) {
        bgMusic.pause();
        gameOverSound.play();
        reload();
        return;
    }    
    clearScreen();
    checkFoodCollision();
    drawFood();
    drawSnake();
    drawScore();
    speeds();
    setTimeout(drawGame,1000/speed);

}

function speeds(){
    if(score > 10) speed = 10;
    if(score > 20) speed = 20;
    if(score > 30) speed = 50;
    return speed;
}

function reload(){
    window.setTimeout(function(){location.reload()},3000);
}

function drawScore(){
    ctx.fillStyle = "white";
    ctx.font = "10px verdana";
    ctx.fillText("Score "+score,canvas.width-50,10)
}

function isGameOver(){
    let gameOver = false;

    if(yVelocity === 0 && xVelocity ===0) 
    return false;

    //walls
    if(headX < 0) gameOver = true;
    if(headY < 0) gameOver = true;
    if(headX === tileCount) gameOver = true;
    if(headY === tileCount) gameOver = true;

    for(let i = 0;i<bodyParts.length;i++){
        let part = bodyParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    var gradient = ctx.createLinearGradient(0,0,canvas.width,0);
    gradient.addColorStop("0","pink");
    gradient.addColorStop("0.5","purple");
    gradient.addColorStop("1.0","red");
    ctx.font = "50px helvetica";
    ctx.fillStyle = gradient;
    ctx.fillText("Game Over!" , canvas.width/6.5,canvas.height/2);

    return gameOver;
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake(){
    
    ctx.fillStyle = "orange";
    for(let i = 0; i< bodyParts.length;i++){
        let part = bodyParts[i];
        ctx.fillRect(part.x* tileCount,part.y*tileCount,tileSize,tileSize);
    }
    bodyParts.push(new snakeBody(headX,headY));
    if(bodyParts.length > tailLength){
        bodyParts.shift()
    }

    ctx.fillStyle = "red";
    ctx.fillRect(headX * tileCount, headY * tileCount,tileSize,tileSize);
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawFood(){
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(appleX * tileCount,appleY * tileCount,tileSize,tileSize)
}

function checkFoodCollision(){
    if(appleX === headX && appleY === headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        foodSound.play();
    }
}


drawGame();

document.addEventListener('keydown',keyDown);

function keyDown(event){
    moveSound.play();
    if(event.keyCode === 38){
        if(yVelocity === 1) return
        yVelocity = -1;
        xVelocity = 0;
    }
    if(event.keyCode === 40){
        if(yVelocity === -1) return
        yVelocity = 1;
        xVelocity = 0;
    }
    if(event.keyCode === 39){
        if(xVelocity === -1) return
        yVelocity = 0;
        xVelocity = 1;
    }
    if(event.keyCode === 37){
        if(xVelocity === 1) return
        yVelocity = 0;
        xVelocity = -1;
    }
}



