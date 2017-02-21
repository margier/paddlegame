var canvas;
//graphical part
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const winningScore = 5;
var startGameFlag = true;
var showWinScreen = true;

var paddle1Y = 250;
var paddle2Y = 250;
const paddleThickness = 10;
const paddleHeight = 100;


function calcMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
        x : mouseX,
        y : mouseY
  };
}

//define event to start game again
function handleMouseClick(evt) {
    if(showWinScreen) {
      player1Score = 0;
      player2Score = 0;
      showWinScreen = false;
    }
};
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.font = "20px Verdana";

    // slow it down
    var framesPerSecond = 30;
    setInterval(function() {
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    // tests left paddle
    canvas.addEventListener('mousemove', function (evt) {
      var mousePos = calcMousePos(evt);
      paddle1Y = mousePos.y - (paddleHeight/2);
    });
    // tests right paddle
    canvas.addEventListener('mousemove', function (evt) {
      var mousePos = calcMousePos(evt);
      paddle2Y = mousePos.y - (paddleHeight/2);
    });

};

//resets the ball
function ballReset () {
  //check score here
  if(player1Score >= winningScore || player2Score >= winningScore) {
        showWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}
// lining up right paddle with ball hit
// line up to the center of the ball
function computerMovement() {
    var paddle2YCenter = paddle2Y + (paddleHeight/2);
    //here
    if(paddle2YCenter < ballY-35) {
        paddle2Y += 6;
    } else {
        paddle2Y -= 6;
    }
}

function moveEverything() {
  if(showWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // this tests left boundary hitting paddle
  if (ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
          ballSpeedX = -ballSpeedX;
          var deltaY = ballY
                -(paddle1Y+paddleHeight/2);
          ballSpeedY = deltaY * 0.35;
        } else {
            player2Score ++; // must be before ball reset
            ballReset();

        }
  }
  // this tests right boundary hitting paddle
  if (ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
          ballSpeedX = -ballSpeedX;
          var deltaY = ballY
                -(paddle2Y+paddleHeight/2);
          ballSpeedY = deltaY * 0.35;
        } else {
          player1Score ++; //must be before ball reset
          ballReset();

        }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet () {
  for(var i = 0; i < canvas.height; i+=40) {
      colorRect(canvas.width/2-1, i,2,20, 'white');
  }
}

function drawEverything() {

  // next line blanks out screen with black
  colorRect(0,0,canvas.width,canvas.height,'black');

  if(showWinScreen) {
    canvasContext.fillStyle = 'green';

    //check score here
    if(player1Score >= winningScore) {
      canvasContext.fillText('Left Player Won!',300,200);
    } else if (player2Score >= winningScore) {
        canvasContext.fillText('Right Player Won!',300,200);
      }
    canvasContext.fillText("Click to start game", 300,500);
  }

  drawNet();
  // this is left player paddle
  colorRect(0,paddle1Y,paddleThickness,paddleHeight,'white');

  // this is right player paddle
  colorRect(canvas.width - paddleThickness,paddle2Y,paddleThickness,paddleHeight,'white');

  // next line draws the ball
  colorCircle(ballX, ballY, 10, 'white')
  // display scores
  canvasContext.fillText(player1Score, 100,100);
  canvasContext.fillText(player2Score, canvas.width-100,100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillColor = 'drawColor';
  canvasContext.beginPath();
  // making circle for ball
  // first 2 positions are x-y position (center of the circle)
  // 10 is radius of circle 10 pixels wide/tall
  // Math.PI*2 gets circumfrance of a circle
  canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
