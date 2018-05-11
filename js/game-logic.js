function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
  this.ROUND_DELAY = 250;
}

Game.prototype.start = function() {
  this.allowedTime = 1300;
  this.score = 0;
  this.streak = 0;
  this.startTime = null;
  this.grinding = false;
  this.grindStart = null;
  this.grindDuration = 0;
  this.direction = null;
  this.pattern = this.generatePattern();
  this.correct = false;
  this.highPrecisionTimer = (typeof window.performance == "object");
}

Game.prototype.generatePattern = function() {
  var pattern = [];
  for(var i = 0; i < 5; i++) pattern.push(this.randomDirection());
  return pattern;
}

Game.prototype.randomDirection = function() {
  return this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];;
}

Game.prototype.now = function() {
  return this.highPrecisionTimer ? Math.round(performance.now()) : Date.now();
}

Game.prototype.timePassed = function() {
  if(this.grindStart) {
    return ((this.now() - this.grindStart) * 1.5) + (this.grindStart - this.startTime);
  }
  else {
    return this.now() - this.startTime;
  }
}

Game.prototype.timeRemaining = function() {
  var time = (this.allowedTime - this.timePassed()) / (this.allowedTime + 0.0);
  if(time < 0) return 0;
  if(time > 1) return 1;
  return time;
}

Game.prototype.roundStarted = function() {
  this.direction = this.pattern[this.streak % this.pattern.length];
  this.startTime = this.now();
  this.correct = false;
  this.grinding = false;
  this.grindStart = null;
  this.grindDuration = 0;
  return this.direction;
}

Game.prototype.input = function(playerDirection) {
  this.correct = playerDirection == this.direction;
  return this.correct;
}

Game.prototype.grindStarted = function() {
  this.grindStart = this.now();
  this.grinding = true;
}

Game.prototype.grindEnded = function() {
  this.grindDuration += this.now() - this.grindStart;
  this.grinding = false;
}

Game.prototype.roundEnded = function() {
  var diff = Math.floor(this.timePassed());
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