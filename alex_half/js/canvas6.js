// Searches HTML document for element of canvas
var canvas = document.querySelector('canvas');

// canvas.width = window.innerWidth-50;
// canvas.height = window.innerHeight;
canvas.width = 900;
canvas.height = 700;

var c = canvas.getContext('2d');
var t = 0;
var dt = .05;
var mass = 10;
var g = 9.81;

var cannonX = 50;
var cannonY = 600;

// Functions starting with capital letter indicate objects
function Circle( x, y, dx, dy, radius){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  // this acts as a method called draw
  this.draw = function(){
    c.fillStyle = "blue";
    c.beginPath();
    c.arc( this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.stroke();
    c.fill();
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

    // Gravity
    this.dy += g*dt;

    // Friction
    this.dy = this.dy*0.999;
    this.dx = this.dx*0.999;

    c.fillStyle = "#000000";
    c.fillText("dy: " + Math.abs(this.dy), 10, 20);
    c.fillText("t: " + t, 10, 40);

    this.draw();
  }
}

function drawCannon( ){
  // c.fillStyle = "brown";
  // c.beginPath();
  // c.rotate(-Math.PI/4);
  // c.rect(-500,canvas.height-300,150,100);
  // c.stroke();
  // c.rotate(Math.PI/4);
  // c.arc( cannonX-10, cannonY+80, 50, 0, Math.PI*2, false);
  // c.fill();

  // Line
  c.beginPath();
  c.moveTo(0,canvas.height);
  c.lineTo(300,100);
  c.stroke();
}

function animate(){
  t += dt;

  requestAnimationFrame(animate);
  c.clearRect( 0, 0, innerWidth, innerHeight);

  for( var i = 0; i < circleArray.length; i++){
    // circleArray[i].update();
  }
  drawCannon();
}



var circleArray = [];

for (var i = 1; i < 2; i++){
  var radius = 15;
  // Prevents circles getting stuck in sides
  var x = Math.random() * (innerWidth-radius*2) + radius;
  var y = Math.random() * (innerHeight-radius*2) + radius;
  x = cannonX;
  y = cannonY;
  var dx = (Math.random()-0.5) * 3;
  var dy = (Math.random()-0.5) * 3;
  dx = 8.0;
  dy = -10.0;
  circleArray.push( new Circle( x, y, dx, dy, radius) );
}

animate();
