var ctx = null;
//  0: wall   1: path   2: goal   3: nugget
var gameMapO = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 3, 0, 2, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
var gameMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 3, 0, 2, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
var tileW = 40, tileH = 40;
var mapW = gameMapO[1].length, mapH = gameMapO.length;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;
var keysDown = { 37:false, 38:false, 39:false, 40:false};
var playerTurn = true;
var AP = 3; // The normal number of action points
var player = new Character();
var turnsLeft = 20;
var playerNuggets = 0;
var enemy1 = new Character(); var enemy2 = new Character(); var enemy3 = new Character();
var enemies = [ enemy1, enemy2, enemy3];

window.addEventListener("keydown", function(e) {
  if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
});
window.addEventListener("keyup", function(e) {
  if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
});

window.addEventListener("keypress", buttonpress, false);

function buttonpress(e){
  var keyCode = e.keyCode;
  console.log("You pressed " + keyCode);
  if(keyCode == 114){ // SPACE
    // Rotate the game map when space is pressed
    if ( player.actionPoints === AP ){
      player.actionPoints = 0;
      rotate(gameMap);
    }
  }
  if(keyCode == 13){ // ENTER
    // Restart the game when enter is pressed
    startGame();
  }
  if(keyCode == 115){ // s
    // Skips rest of player turn when s is pressed
    player.actionPoints = 0;
  }
  if(keyCode == 98){ // b
    // place a block down when b is pressed
    if ( player.actionPoints >= 2 ){
      player.actionPoints -= 1;
      gameMap[player.tileTo[1]][player.tileTo[0]] = 0;
    }
  }
};

function rotateChars(i,j,n){
  for( var e = 0; e < enemies.length; e++ ){
    if( i==enemies[e].tileTo[0] && j==enemies[e].tileTo[1] ){
      enemies[e].placeAt(n-1-j,i);
    }else if( n-1-j==enemies[e].tileTo[0] && i==enemies[e].tileTo[1]){
      enemies[e].placeAt(n-1-i,n-1-j);
    }else if( n-1-i==enemies[e].tileTo[0] && n-1-j==enemies[e].tileTo[1]){
      enemies[e].placeAt(j,n-1-i);
    }else if( j==enemies[e].tileTo[0] && n-1-i==enemies[e].tileTo[1]){
      enemies[e].placeAt(i,j);
    }
  }
}

function rotate(matrix) {
  var n = matrix.length;
  for (var i = 0; i < n / 2; i++) {
      for (var j = 0; j < Math.floor(n/2); j++) {
          var temp = matrix[i][j];
          matrix[i][j] = matrix[n-1-j][i];
          matrix[n-1-j][i] = matrix[n-1-i][n-1-j];
          matrix[n-1-i][n-1-j] = matrix[j][n-1-i];
          matrix[j][n-1-i] = temp;
          // Rotates enemies also
          rotateChars(i,j,n);
      }
  }
  return matrix;
}

function Character(){
  this.tileFrom	= [1,1]; // [xCor,yCor]
  this.tileTo		= [1,1];
  this.timeMoved	= 0;
  this.dimensions	= [30,30];
  // position[0] = x,  increments of tileW
  this.position	= [45,45];
  this.delayMove	= 200;
  // Action points are the number of moves you get per turn
  this.actionPoints = AP;
  // Further variables are only for computers
  this.dl = 1; // +/-1 will determine forward/backward movement
  this.charType = 1;

  this.placeAt = function(x, y){
    this.tileFrom	= [x,y];
    this.tileTo		= [x,y];
    this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)),
                     ((tileH*y)+((tileH-this.dimensions[1])/2))];
  }
  this.processMovement = function(t){
    // return false, for not currently moving, if tileTo == tileFrom
    if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { return false; }
    // If 'delayMove' amount of miliseconds have passed then place player on proper tile
    if( (t-this.timeMoved)>=this.delayMove ){
      this.placeAt(this.tileTo[0], this.tileTo[1]);
    }// Otherwise move the player partway to it, between tiles
    else{
      this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
      this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

      if(this.tileTo[0] != this.tileFrom[0]){
        var diff = (tileW / this.delayMove) * (t-this.timeMoved);
        this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
      }
      if(this.tileTo[1] != this.tileFrom[1]){
        var diff = (tileH / this.delayMove) * (t-this.timeMoved);
        this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
      }

      this.position[0] = Math.round(this.position[0]);
      this.position[1] = Math.round(this.position[1]);
    }

    return true;
  }
}

// Returns number of nuggets [val of 3] on the map
function numberOfNuggets(){
  var noN = 0;
  for(var y = 0; y < mapH; ++y){
    for(var x = 0; x < mapW; ++x){
      if( gameMapO[y][x] == 3 ){
        noN += 1;
      }
    }
  }
  return noN;
}

// Player will pick up a nugget if on top of one, contains win condition
function processMapEvents(){
  var x = player.tileFrom[0];
  var y = player.tileFrom[1];
  // if on nugget
  if ( gameMap[y][x]==3 ){
    playerNuggets += 1;
    gameMap[y][x] = 1;
  }// if on goal
  if ( gameMap[y][x]==2 ){
    if ( playerNuggets == numberOfNuggets() ){
      ctx.fillStyle = "#000000";
      ctx.font="bold 60px Verdana";
      // Create gradient
      var gradient=ctx.createLinearGradient(0,0, (mapW)*tileW, 0);
      gradient.addColorStop("0","white");
      gradient.addColorStop("0.5","#0000af");
      gradient.addColorStop("1.0","white");
      // Fill with gradient
      ctx.fillStyle=gradient;
      ctx.fillText("YOU WIN", (mapW/2)*tileW-150, (mapH/2)*tileH-50);
      // Ensures that the player cannot move
      playerTurn = false;
      player.actionPoints = 0.1;
    }
  }
}

function drawMap(){
  wallColor = 'black';
  pathColor = '#5ac457';
  // Cycle through the y and x coordinates of the grid
  for(var y = 0; y < mapH; ++y){
    for(var x = 0; x < mapW; ++x){
      // Assign color based on the number on the grid
      switch(gameMap[y][x]){
        case 0: // Wall
          ctx.fillStyle = wallColor;
          ctx.clearRect( x*tileW, y*tileH, tileW, tileH);
          ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
          break;
        case 1: // Path
          ctx.fillStyle = pathColor;
          ctx.clearRect( x*tileW, y*tileH, tileW, tileH);
          ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
          break;
        case 2: // Goal
          ctx.fillStyle = "#ffff20";
          ctx.clearRect( x*tileW, y*tileH, tileW, tileH);
          ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
          break;
        case 3: // Nugget
          ctx.fillStyle = pathColor;
          ctx.clearRect( x*tileW, y*tileH, tileW, tileH);
          ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
          ctx.fillStyle = "#ffff00";
          ctx.beginPath();
          radius = 5;
          ctx.arc( x*tileW+tileW/2, y*tileH+tileH/2, radius, 0, Math.PI*2, false);
          ctx.strokeStyle = 'black';
          ctx.stroke();
          ctx.fillStyle = this.color;
          ctx.fill();
          break;
        default:
          ctx.fillStyle = "#5aa457";
          ctx.clearRect( x*tileW, y*tileH, tileW, tileH);
          ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
      }
    }
  }
}

function drawPlayer(){
  // This will draw the player
  ctx.fillStyle = "#0000ff";
  // Player is drawn wherever its 'position' is.
  ctx.fillRect(player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);

  ctx.beginPath();
  ctx.strokeStyle = '#afaf00';
  ctx.lineWidth="3"
  ctx.rect(player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);
  ctx.stroke();
}

function  drawHeader(){
  ctx.font="16px Verdana";
  ctx.fillStyle = "#ff0000";
  ctx.fillText("FPS: " + framesLastSecond, 10, 25);

  ctx.fillStyle = "#ffffff";
  if ( playerTurn ){ // If player's turn
    ctx.fillText("YOUR TURN        AP: " + player.actionPoints, (mapW/2)*tileW-150, 25);
    ctx.fillText("Turns: " + turnsLeft, (mapW/2)*tileW+75, 25);
  }else{ // If computer's turn
    ctx.fillText("COMPUTER'S TURN", (mapW/2)*tileW-50, 20);
  }

  ctx.font="12px Verdana";
  ctx.fillText("r: rotate stage (3AP)    b: place block (1AP)    s: skip turn    enter: restart", 10, (mapH)*tileH-15);
}

function isValidMoveLoc( x, y){ // Checks is location can be moved to
  // Checks to make sure is not a wall and is not the player location
  if( gameMap[y][x]==0 || (player.tileFrom[0]==x && player.tileFrom[1]==y)){
    return false;
  }
  for( var e = 0; e < enemies.length; e++ ){
    if( enemies[e].tileTo[0]==x && enemies[e].tileTo[1]==y ){
      return false;
    }
  }
  return true;
}

function processPlayer(currentFrameTime){
  // Do if the player is not currently transitioning to a new point
  if( !player.processMovement(currentFrameTime) ){
    // Set the 'tileTo' based on which arrow key was pushed
    player.actionPoints -= 1;
    if(keysDown[38] && player.tileFrom[1]>0 && isValidMoveLoc( player.tileFrom[0], player.tileFrom[1]-1 )) { player.tileTo[1]-= 1; }
    else if(keysDown[40] && player.tileFrom[1]<(mapH-1) && isValidMoveLoc( player.tileFrom[0], player.tileFrom[1]+1 )) { player.tileTo[1]+= 1; }
    else if(keysDown[37] && player.tileFrom[0]>0 && isValidMoveLoc( player.tileFrom[0]-1, player.tileFrom[1] )) { player.tileTo[0]-= 1; }
    else if(keysDown[39] && player.tileFrom[0]<(mapW-1) && isValidMoveLoc( player.tileFrom[0]+1, player.tileFrom[1] )) { player.tileTo[0]+= 1; }
    else { player.actionPoints += 1; }
    //
    if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1]){
      player.timeMoved = currentFrameTime;
    }

  }
}

function processComputers(currentFrameTime){
  for( var e = 0; e < enemies.length; e++ ){
    var vertMove = 1;
    if( player.tileFrom[1] < enemies[e].tileFrom[1] ){
      vertMove = 0-vertMove;
    }
    // Everything done within this if statement, ensures animations finish
    if( !enemies[e].processMovement(currentFrameTime) && enemies[e].actionPoints > 0 ){
      // This will count attempted moves as a partial move
      enemies[e].actionPoints -= 0.05;
      // If the player is adjacent
      if( Math.abs(enemies[e].tileFrom[0]-player.tileFrom[0]) + Math.abs(enemies[e].tileFrom[1]-player.tileFrom[1]) <=1 ){
        enemies[e].tileTo[0] += player.tileFrom[0]-enemies[e].tileFrom[0];
        enemies[e].tileTo[1] += player.tileFrom[1]-enemies[e].tileFrom[1];
      }// Random vertical movement
      else if( isValidMoveLoc( enemies[e].tileFrom[0], enemies[e].tileFrom[1]+vertMove ) ){
        enemies[e].tileTo[1] += vertMove;
        enemies[e].actionPoints -= 1;
      }

      if(enemies[e].tileFrom[0]!=enemies[e].tileTo[0] || enemies[e].tileFrom[1]!=enemies[e].tileTo[1]){
          enemies[e].timeMoved = currentFrameTime;
      }
    }
  }
}

function drawComputers(){
  for( var e = 0; e < enemies.length; e++ ){
    // This will draw the enemies
    ctx.fillStyle = "#ff0000";
    // Player is drawn wherever its 'position' is.
    ctx.fillRect(enemies[e].position[0], enemies[e].position[1],
                 enemies[e].dimensions[0], enemies[e].dimensions[1]);
  }
}

function gameStatus(currentFrameTime){
  // This var & for loop check if the enemies finished their turn yet
  var enemyTurnFinished = false;
  for( var e = 0; e < enemies.length; e++ ){
    // cannot switch to true back from false
    if ( enemies[e].processMovement(currentFrameTime) || enemies[e].actionPoints>0 ){
      enemyTurnFinished = true;
    }
  }
  // Switches turns if other side is out of AP
  if ( player.actionPoints <= 0 && playerTurn && !player.processMovement(currentFrameTime)){
    enemyUpkeep();
    playerTurn = false;
  }else if( !playerTurn && !enemyTurnFinished ){
    player.actionPoints = AP;
    playerTurn = true;
  }
  // You lose if the enemy shares a position with you
  for( var e = 0; e < enemies.length; e++ ){
    if( enemies[e].position[0] == player.position[0] &&  enemies[e].position[1] == player.position[1] ){
      loseScreen();
    }
  }
  if( turnsLeft <= 0 ){
    loseScreen();
  }
}

function loseScreen(){
  ctx.fillStyle = "#000000";
  ctx.font="bold 60px Verdana";
  // Create gradient
  var gradient=ctx.createLinearGradient(0,0, (mapW)*tileW, 0);
  gradient.addColorStop("0","black");
  gradient.addColorStop("0.5","#af0000");
  gradient.addColorStop("1.0","black");
  // Fill with gradient
  ctx.fillStyle=gradient;
  ctx.fillText("YOU LOSE", (mapW/2)*tileW-170, (mapH/2)*tileH-50);
  // Ensures that the player cannot move
  playerTurn = false;
  player.actionPoints = 0.1;
}

function enemyUpkeep(){
  for( var e = 0; e < enemies.length; e++ ){
    enemies[e].actionPoints = AP;
  }
  turnsLeft-=1;
}

function mapEvents(){

}

function drawGame(){
  if(ctx==null) { return; }

  var currentFrameTime = Date.now();
  var timeElapsed = currentFrameTime - lastFrameTime;
  // Calculates current second and FPS
  var sec = Math.floor(Date.now()/1000);
  if(sec!=currentSecond){
    currentSecond = sec;
    framesLastSecond = frameCount;
    frameCount = 1;
  }
  else { frameCount++; }

  drawMap();

  if ( playerTurn ){
    processPlayer(currentFrameTime);
  }else{ // Else it is the computer's turn
    processComputers(currentFrameTime);
  }

  drawPlayer();
  drawComputers();

  drawHeader();

  // Finally we check to see if it is time to change turns, if the player won,
  // or if the player lost
  gameStatus(currentFrameTime);
  // processMapEvents processes interactions with the terrain and the player/enemies
  processMapEvents();

  requestAnimationFrame(drawGame);
}

window.onload = function(){
  ctx = document.getElementById('game').getContext("2d");
  startGame();
};

function resetMap(){
  // Have to go element by element not pass reference
  for(var y = 0; y < mapH; ++y){
    for(var x = 0; x < mapW; ++x){
      gameMap[y][x] = gameMapO[y][x];
    }
  }
}

function startGame(){
  player.placeAt(1,1);
  player.actionPoints = AP;
  // Places the enemies
  for( var e = 0; e < enemies.length; e++ ){
    if(e==0){
      enemies[e].placeAt(6,6);
    }else if (e==1){
      enemies[e].placeAt(11,6);
    }else{
      enemies[e].placeAt(1,11);
    }
    enemies[e].actionPoints = AP;
    enemies[e].charType = e;
  }
  turnsLeft = 20;
  playerTurn = true;
  playerNuggets = 0;
  currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;
  resetMap();
  requestAnimationFrame(drawGame);
}
