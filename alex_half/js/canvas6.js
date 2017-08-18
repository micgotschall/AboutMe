// Searches HTML document for element of canvas
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

// Functions starting with capital letter indicate objects
function Circle( x, y, dx, dy, radius){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  // this acts as a method called draw
  this.draw = function(){
    c.beginPath();
    c.arc( this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.stroke();
  }
  this.update = function(){
    if (this.x+this.radius > innerWidth || this.x-this.radius < 0){
      this.dx = -this.dx;
    }if (this.y+this.radius > innerHeight || this.y-this.radius < 0){
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

function animate(){
  requestAnimationFrame(animate);
  c.clearRect( 0, 0, innerWidth, innerHeight);

  for( var i = 0; i < circleArray.length; i++){
    circleArray[i].update();
  }
}



var circleArray = [];

for (var i = 1; i < 500; i++){
  var radius = 30;
  // Prevents circles getting stuck in sides
  var x = Math.random() * (innerWidth-radius*2) + radius;
  var y = Math.random() * (innerHeight-radius*2) + radius;
  var dx = (Math.random()-0.5) * 3;
  var dy = (Math.random()-0.5) * 3;
  circleArray.push( new Circle( x, y, dx, dy, radius) );
}

animate();
