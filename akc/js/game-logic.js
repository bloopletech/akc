function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
}

Game.prototype.start = function() {
  this.allowedTime = 1500;
  this.score = 0;
  this.streak = 0;
  this.grinding = false;
  this.startTime = null;
  this.direction = null;
  this.pattern = this.generatePattern();
  this.correct = false;
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
  this.correct = false;
  this.grindDuration = 0;
  return this.direction;
}

Game.prototype.input = function(playerDirection) {
  this.correct = playerDirection == this.direction;
  return this.correct;
}

Game.prototype.grindStarted = function() {
  this.grindStart = Date.now();
  this.grinding = true;
}

Game.prototype.grindEnded = function() {
  this.grindDuration += Date.now() - this.grindStart;
  this.grindStart = null;
  this.grinding = false;
}

Game.prototype.roundEnded = function() {
  var diff = Date.now() - this.startTime;
  if(diff < 50 || diff > this.allowedTime || !this.correct) return true;

  this.streak++;
  var delta = (this.allowedTime - diff) + (this.grindDuration * 5) + (this.streak * 100);
  if(diff <= (this.allowedTime * 0.3)) delta *= 2;
  this.score += delta;

  if(this.streak % this.pattern.length == 0) {
    if(this.allowedTime >= 750) this.allowedTime -= 50;
    else if(this.allowedTime > 300) this.allowedTime -= 30;
  }

  return false;
}