// Searches HTML document for element of canvas
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth -10;
canvas.height = window.innerHeight -10;

var c = canvas.getContext('2d');

var mouse = {x: undefined, y: undefined};
var pointerRadius = 10;
var circleRadius = 5;
var circleArray = [];
var colorArray = ['red', 'blue'];
var frameNum = 0;
var highScore = 0;
var onBlue = false;
var mouseColor = 'red';
var gameState = 'play';

document.addEventListener("keypress", buttonpress, false);

function buttonpress(e){
    var keyCode = e.keyCode;
    console.log("You pressed " + keyCode);
    if(keyCode == 32){
        console.log("You pressed Space!");
        onBlue = !onBlue;
    }
    if(keyCode == 13){
        console.log("You pressed Enter!");
        init();
    }
};

document.addEventListener("mousemove", followMouse, false);

function followMouse(e) {
  mouse.x = event.x;
  mouse.y = event.y;

  console.log(mouse.x + " " + mouse.y);
  console.log(frameNum);
  drawMouseCircle();
}

function drawMouseCircle(){
  if (onBlue){
    mouseColor = 'blue';
  }else if(!onBlue){
    mouseColor = 'red';
  }
  if (frameNum < 100){
    mouseColor = 'white';
  }

  c.beginPath();
  c.arc( mouse.x, mouse.y, pointerRadius, 0, Math.PI*2, false);
  c.strokeStyle = 'black';
  c.stroke();
  c.fillStyle = mouseColor;
  c.fill();
}

// Handles window resizing
window.addEventListener('resize',function(){
  canvas.width = window.innerWidth -10;
  canvas.height = window.innerHeight -10;
  init();
});

// Handles mouse movement
window.addEventListener('mousemove',mouseMoved);

function mouseMoved(){
  mouse.x = event.x;
  mouse.y = event.y;
  // console.log(mouse);
}

// Functions starting with capital letter indicate objects
function Circle( x, y, dx, dy, radius, dr){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = colorArray[Math.floor( Math.random()*colorArray.length )];
  this.dr = dr;

  // draw method
  this.draw = function(){
    c.beginPath();
    c.arc( this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.strokeStyle = this.color;
    c.stroke();
  }
  // update method
  this.update = function(){
    this.x += this.dx;
    this.y += this.dy;
    // This is collision detection for ripples vs mouse
    dist = Math.pow(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2), 0.5);
    // Interactivity (mouse movement)
    if (dist < this.radius + pointerRadius &&  dist > this.radius - pointerRadius && frameNum > 100 && mouseColor !== this.color){
       score = Math.round(frameNum/10);
       highScore = Math.max(score, highScore);
       gameState = 'lost';
    }
    // radius increases over time
    this.radius += this.dr;

    this.draw();
  }
}

// Call once at the beginning
function animate(){
  c.clearRect( 0, 0, innerWidth, innerHeight);
  // If the game is being played
  if (gameState === 'play'){
    frameNum += 1;
    if( Math.random()*100 < 2 ){
      addCircle();
    }

    for( var i = 0; i < circleArray.length; i++){
      circleArray[i].update();
    }
    drawMouseCircle();
  }// If you have lost the game
  else{
    c.fillStyle = "#000000";
    c.fillText("YOU LOSE", canvas.width/2, canvas.height/2);
    c.fillText("Youre final score was " + Math.round(frameNum/10), canvas.width/2-30, canvas.height/2+24);
    c.fillText("Press enter to restart, press space to change color.", canvas.width/2-90, canvas.height/2+12);
    circleArray = [];
  }

  c.fillStyle = "#000000";
  c.fillText("SCORE: " + Math.round(frameNum/10), 10, 20);
  c.fillText("High score: " + highScore, 10, 30);

  requestAnimationFrame(animate);
}

// Handles dynamic resizing of the canvas
function init(){
  gameState = 'play';
  frameNum = 0;
  circleArray = [];
  for (var i = 1; i < 100; i++){
    // addCircle();
  }
}

function addCircle(){
  var radius = circleRadius + (Math.random()-0.5) * 3;
  // Prevents circles getting stuck in sides
  var x = Math.random() * (innerWidth-circleRadius*2) + circleRadius;
  var y = Math.random() * (innerHeight-circleRadius*2) + circleRadius;
  var dx = (Math.random()-0.5) * 3;
  var dy = (Math.random()-0.5) * 3;
  var dr = Math.random() * 4;
  circleArray.push( new Circle( x, y, dx, dy, radius, dr) );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


init();
animate();
