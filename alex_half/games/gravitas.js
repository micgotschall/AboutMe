// Searches HTML document for element of canvas
var canvas = document.querySelector('canvas');

// canvas.width = window.innerWidth-50;
// canvas.height = window.innerHeight;
canvas.width = 900;
canvas.height = 700;

var moving = false;
var c = canvas.getContext('2d');
var t = 0;
var dt = .05;
var mass = 10;
var g = 9.81;

var keysDown = { 37:false, 38:false, 39:false, 40:false};
var cannonX = 50; var cannonY = canvas.height-50;
var cannonR = 100; var cannonTheta = Math.PI/4;
var cannonBall = new Circle(1,1,1,1,1,"red");//Dummy

window.addEventListener("keydown", function(e) {
  if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
});
window.addEventListener("keyup", function(e) {
  if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
});

function processInput(currentFrameTime){
  if(keysDown[38]) { cannonR += 2; } // Up
  else if(keysDown[40]) { cannonR -= 2; } // Down
  else if(keysDown[37]) { cannonTheta+=Math.PI/64; } // Left
  else if(keysDown[39]) { cannonTheta-=Math.PI/64; } // Right
  if (keysDown[37]||keysDown[38]||keysDown[39]||keysDown[40]) {
    initializeCannonball();
  }
}

window.addEventListener("keypress", buttonpress, false);

function buttonpress(e){
  var keyCode = e.keyCode;
  console.log("You pressed " + keyCode);
  if(keyCode == 32){ // SPACE
    // Rotate the game map when space is pressed
    moving = true;
  }
  if(keyCode == 13){ // ENTER
    // Restart the game when enter is pressed
    initializeCannonball();
  }
};


// Functions starting with capital letter indicate objects
function Circle( x, y, dx, dy, radius, color){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  // this acts as a method called draw
  this.draw = function( ){
    c.fillStyle = this.color;
    c.beginPath();
    c.arc( this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.stroke();
    c.fill();
  }
  this.updatePlayer = function(){
    if (this.x+this.radius > canvas.width || this.x-this.radius < 0){
      this.dx = -this.dx;
    }if (this.y+this.radius > canvas.height || this.y-this.radius < 0){
      this.dy = -this.dy;
    }
    // Update position based on velocity
    this.x += this.dx;
    this.y += this.dy;

    // Down Gravity
    // this.dy += g*dt;

    // Hitting other circles
    for( var i = 0; i < circleArray.length; i++){
      dist = Math.sqrt((circleArray[i].x-this.x)*(circleArray[i].x-this.x)+(circleArray[i].y-this.y)*(circleArray[i].y-this.y));
      if ( dist < this.radius + circleArray[i].radius ){
        this.dx = -this.dx;
        this.dy = -this.dy;
        circleArray[i].dx = -circleArray[i].dx;
        circleArray[i].dy = -circleArray[i].dy;
      }

    }

    // Circle Gravity
    for( var i = 0; i < blackHoleArray.length; i++){
      yDist = Math.abs(blackHoleArray[i].y-this.y);
      xDist = Math.abs(blackHoleArray[i].x-this.x);
      dist = Math.sqrt(xDist*xDist+yDist*yDist);
      forceGravity = 100000/(dist*dist);

      this.dx += forceGravity*dt*(xDist/(xDist+yDist));
      this.dy += forceGravity*dt*(yDist/(xDist+yDist));
    }

    // Friction
    this.dy = this.dy*0.996;
    this.dx = this.dx*0.999;

    c.fillStyle = "#000000";
    // c.fillText("dy: " + Math.abs(this.dy), 10, 20);
    c.fillText("t: " + t, 10, 40);

    this.draw();
  }
  this.update = function(){
    if (this.x+this.radius > canvas.width || this.x-this.radius < 0){
      this.dx = -this.dx;
    }if (this.y+this.radius > canvas.height || this.y-this.radius < 0){
      this.dy = -this.dy;
    }
    // Update position based on velocity
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

function drawCannon( ){
  // Line
  c.beginPath();
  c.moveTo(cannonX,cannonY);
  c.lineTo(cannonX+cannonR*Math.cos(cannonTheta),cannonY-cannonR*Math.sin(cannonTheta));
  c.stroke();
}

function animate(){
  t += dt;

  requestAnimationFrame(animate);
  c.clearRect( 0, 0, innerWidth, innerHeight);

  if (moving){cannonBall.updatePlayer();}

  for( var i = 0; i < circleArray.length; i++){
    circleArray[i].update();
  }
  for( var i = 0; i < blackHoleArray.length; i++){
    blackHoleArray[i].update();
  }

  drawCannon();
  processInput();
}

function initializeCannonball(){
  var radius = 15;
  x = cannonX;
  y = cannonY;
  dx = 0.1*cannonR*Math.cos(cannonTheta);
  dy = -0.1*cannonR*Math.sin(cannonTheta);
  cannonBall = new Circle( x, y, dx, dy, radius, "blue")
  moving = false;
}



// Code that runs the game and calls the Functions
var circleArray = [];
var blackHoleArray = []
for (var i = 1; i < 3; i++){
  var radius = 15;
  // Prevents circles getting stuck in sides
  var x = Math.random() * (innerWidth-radius*2) + radius;
  var y = Math.random() * (innerHeight-radius*2) + radius;
  var dx = (Math.random()-0.5) * 3;
  var dy = (Math.random()-0.5) * 3;
  circleArray.push( new Circle( x, y, dx, dy, radius, "black") );
}
for (var i = 1; i < 2; i++){
  var radius = 10;
  // Prevents circles getting stuck in sides
  var x = Math.random() * (innerWidth-radius*2) + radius;
  var y = Math.random() * (innerHeight-radius*2) + radius;
  var dx = (Math.random()-0.5) * 0;
  var dy = (Math.random()-0.5) * 0;
  blackHoleArray.push( new Circle( x, y, dx, dy, radius, "red") );
}
initializeCannonball();
animate();
