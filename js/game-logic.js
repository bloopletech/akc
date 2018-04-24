function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
}

Game.prototype.start = function() {
  this.allowedTime = 1000;
  this.score = 0;
  this.streak = 0;
  this.startTime = null;
  this.direction = null;
  this.pattern = this.generatePattern();
}

Game.prototype.generatePattern = function() {
  var pattern = [];
  for(var i = 0; i < 5; i++) pattern.push(this.randomDirection());
  return pattern;
}

Game.prototype.randomDirection = function() {
  return this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];;
}

Game.prototype.timeRemaining = function() {
  return (this.allowedTime - (Date.now() - this.startTime)) / (this.allowedTime + 0.0);
}

Game.prototype.roundStarted = function() {
  this.direction = this.pattern[this.streak % this.pattern.length];
  this.startTime = Date.now();
  return this.direction;
}

Game.prototype.roundEnded = function(playerDirection) {
  var diff = Date.now() - this.startTime;
  var correct = playerDirection == this.direction;

  //console.log(this.streak + "," + diff + "," + this.allowedTime);

  if(diff < 50 || diff > this.allowedTime || !correct) return true;

  this.streak++;
  var delta = (this.allowedTime - diff) + (this.streak * 100);
  if(diff <= (this.allowedTime * 0.3)) delta *= 2;
  this.score += delta;

  if(this.streak % this.pattern.length == 0) {
    if(this.allowedTime >= 750) this.allowedTime -= 50;
    else if(this.allowedTime > 300) this.allowedTime -= 30;
  }

  return false;
}