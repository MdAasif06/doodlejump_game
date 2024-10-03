//board

let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46
let doodlerX = boardWidth / 2 - doodlerWidth / 2
let doodlery = boardHeight * 7 / 8 - doodlerHeight;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlery,
    width: doodlerWidth,
    height: doodlerHeight
}

let doodlerRightImg;
let doodlerLeftImg;


//physics
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initianlVelocityY = -8;  //starting velocity Y
let gravity = 0.4;


//platform
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg


let score = 0;
let maxScore = 0;
let gameOver=false

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d'); //used for drawing on the board


    //draw doodler
    // context.fillStyle = "green";
    // context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height)

    //load image
    doodlerRightImg = new Image()
    doodlerRightImg.src = "./images/doodler-right.png";
    doodler.img = doodlerRightImg
    doodlerRightImg.onload = function () {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.height, doodler.width)
    }

    doodlerLeftImg = new Image()
    doodlerLeftImg.src = "./images/doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./images/platform.png"

    velocityY = initianlVelocityY
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);

}
function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return 
    }
    context.clearRect(0, 0, board.width, board.height)
    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth
    }

    doodler.y += velocityY;
    velocityY += gravity;
    if(doodler.y> boardHeight){
        gameOver=true
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodlerHeight)

   




    //platform
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
            platform.y -= initianlVelocityY;//slide the platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initianlVelocityY; //jump of the platform
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height)
    }

    //clear platform and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();//remove first element form the array
        newPlatform();//
    }

    //score
    updateScore();
    context.fillStyle = 'black';
    context.font = '16px sans-serif';
    context.fillText(score, 5, 20);
    if(gameOver){
        context.fillText("Game Over: Press 'space' to Restart",boardWidth/7,boardHeight*7/8)
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "keyD") {//move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "keyA") {//move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }else if(e.code == "Space" && gameOver){
        //reset the game
        let doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlery,
            width: doodlerWidth,
            height: doodlerHeight
        }       
        velocityX=0;
        velocityY=initianlVelocityY;
        score=0;
        maxScore=0;
        gameOver=false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];
    //starting platform
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight

    }
    platformArray.push(platform);

    // platform = {
    //     img: platformImg,
    //     x: boardWidth / 2,
    //     y: boardHeight - 150,
    //     width: platformWidth,
    //     height: platformHeight

    // }
    // platformArray.push(platform);
    for (let i = 0; i < 6; i++) {
        let randomX = Math.random() * boardWidth * 3 / 4; //(0-1)* boardWidth*3/4

        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight

        }
        platformArray.push(platform);



    }
}

function newPlatform() {
    let randomX = Math.random() * boardWidth * 3 / 4; //(0-1)* boardWidth*3/4

    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight

    }
    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&//a 's top left corner doesn't reach b's top right
        a.x + a.width > b.x &&  //a 's top right corner passes  b's top left corner
        a.y < b.y + b.height && //a 's top left corner doesn't reach b's top left corner
        a.y + a.height > b.y; //a 's bottom left corner passes  b's top left corner 
}

function updateScore() {
    let points = Math.floor(50 * Math.random());//(0-1)*50 ---> (0-50)
    if (velocityY < 0) { ///negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore

        }
    } else if (velocityY >= 0) {
        maxScore -= points;
    }
}