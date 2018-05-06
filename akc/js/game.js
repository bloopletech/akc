var $;
var engine;
function init() {
  $ = document.querySelector.bind(document);

  engine = new Engine(function() {});

  if(window.innerWidth >= 768) {
    window.addEventListener("keydown", function(event) {
      engine.onKeyDown(event);
    });
    window.addEventListener("keyup", function(event) {
      engine.onKeyUp(event);
    });
  }
  else {
    window.addEventListener("touchend", function(event) {
      engine.onClick(event);
    });
  }

  document.body.addEventListener("click", function(e) {
    if(e.target.matches(".play")) engine.start();
    else if(e.target.matches("#settings")) showBack;
    else if(e.target.matches("#done")) showFront;
  })
}

document.addEventListener("DOMContentLoaded", init);