"use strict";

window.debug = window.location.hash == "#debug";

window.DebugConsole = (function() {
  var entries = [];

  function log() {
    var entry = [performance.now()];
    for(var i = 0; i < arguments.length; i++) entry.push(arguments[i].toString());
    entries.push(entry.join(", "));
  }

  return {
    log: log,
    entries: function() {
      return entries;
    }
  }
})();

function debugInit() {
  function debugPlaying() {
    document.body.classList.remove("attract");
    document.body.classList.add("playing", "up");
    $("#time-remaining-track").style.strokeDashoffset = 1482.83;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div id="debug-root" style="position: absolute; top: 0; left: 0;">
      <a href="#" id="debug-playing">Debug Playing</a>
      <br>
      <a href="#" id="debug-console">Debug Console</a>
    </div>
  `);

  document.body.addEventListener("click", function(e) {
    if(e.target.matches("#debug-playing")) {
      e.preventDefault();
      debugPlaying();
    }
    else if(e.target.matches("#debug-console")) {
      e.preventDefault();
      Panel.forward(new Panels.DebugConsole());
    }
  });
}

if(window.debug) document.addEventListener("DOMContentLoaded", debugInit);
