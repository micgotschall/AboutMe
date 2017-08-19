// Searches HTML document for element of canvas
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth -10;
canvas.height = window.innerHeight -10;

var c = canvas.getContext('2d');

var mouse = {x: undefined, y: undefined};
var pointerRadius = 10;
var circleRadius = 5;
var circleArray = [];
var colorArray = ['#510029','#6bdbcf','#c4091c','#e4e028','#00a000'];
var frameNum = 0;
var highScore = 0;

document.addEventListener("mousemove", followMouse, false);

function followMouse(e) {
  mouse.x = event.x;
  mouse.y = event.y;

  console.log(mouse.x + " " + mouse.y);
  console.log(frameNum);
  drawMouseCircle();
}

function drawMouseCircle(){
  var color = 'black';
  if (frameNum < 100){
    color = 'white';
  }


  c.beginPath();
  c.arc( mouse.x, mouse.y, pointerRadius, 0, Math.PI*2, false);
  c.strokeStyle = 'black';
  c.stroke();
  c.fillStyle = color;
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
function Circle( x, y, dx, dy, radius){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  // this.color = colorArray[Math.floor( Math.random()*colorArray.length )];
  this.color = getRandomColor();

  // draw method
  this.draw = function(){
    c.beginPath();
    c.arc( this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.strokeStyle = 'black';
    c.stroke();
    c.fillStyle = this.color;
    c.fill();
  }
  // update method
  this.update = function(){
    if (this.x+this.radius > canvas.width || this.x-this.radius < 0){
      this.dx = -this.dx;
    }if (this.y+this.radius > canvas.height || this.y-this.radius < 0){
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    dist = Math.pow(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2), 0.5);
    // Interactivity (mouse movement)
    if (dist < this.radius + pointerRadius && frameNum > 100){
       score = Math.round(frameNum/10);
       highScore = Math.max(score, highScore);
       c.fillStyle = this.color;
       c.fillRect(0, 0, canvas.width, canvas.height);
       alert('YOU LOSE.          FINAL SCORE: ' + score);
       init();
    }else if (this.radius > radius){
      this.radius -=1;
    }

    this.draw();
  }
}

// Call once at the beginning
function animate(){
  frameNum += 1;
  c.clearRect( 0, 0, innerWidth, innerHeight);

  if( Math.random()*20 < 2 ){
    addCircle();
  }

  for( var i = 0; i < circleArray.length; i++){
    circleArray[i].update();
  }
  drawMouseCircle();

  c.fillStyle = "#000000";
  c.fillText("SCORE: " + Math.round(frameNum/10), 10, 20);
  c.fillText("High score: " + highScore, 10, 30);

  requestAnimationFrame(animate);
}

// Handles dynamic resizing of the canvas
function init(){
  frameNum = 0;
  circleArray = [];
  for (var i = 1; i < 100; i++){
    addCircle();
  }
}

function addCircle(){
  var radius = circleRadius + (Math.random()-0.5) * 3;
  // Prevents circles getting stuck in sides
  var x = Math.random() * (innerWidth-circleRadius*2) + circleRadius;
  var y = Math.random() * (innerHeight-circleRadius*2) + circleRadius;
  var dx = (Math.random()-0.5) * 3;
  var dy = (Math.random()-0.5) * 3;
  circleArray.push( new Circle( x, y, dx, dy, radius) );
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
