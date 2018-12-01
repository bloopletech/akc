"use strict";

window.debug = window.location.hash == "#debug";

function debugInit() {
  function debugPlaying() {
    document.body.classList.remove("attract");
    document.body.classList.add("playing", "up");
    $("#time-remaining-track").style.strokeDashoffset = 1482.83;
    $("#delta").style.display = "block";
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div id="debug-root" style="position: absolute; top: 0; left: 0;">
      <a href="#" id="debug-playing">Debug Playing</a>
    </div>
  `);

  document.body.addEventListener("click", function(e) {
    if(e.target.matches("#debug-playing")) {
      e.preventDefault();
      debugPlaying();
    }
  });
}

if(window.debug) document.addEventListener("DOMContentLoaded", debugInit);
