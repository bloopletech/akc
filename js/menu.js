"use strict";

window.menu = function() {
  function showMusicStatus() {
    $("#music-status").classList.remove("enabled", "disabled");
    $("#music-status").classList.add(Music.getEnabled() ? "enabled" : "disabled");
  }

  function updateMusicStatus() {
    Music.setEnabled(!Music.getEnabled());
    showMusicStatus();
  }

  document.body.addEventListener("click", function(e) {
    if(e.target.closest("#menu-trigger")) document.body.classList.add("menu-open");
    if(e.target.closest("#menu-close")) document.body.classList.remove("menu-open");
    if(e.target.closest("#music-status")) updateMusicStatus();
    if(e.target.closest("#attribution-link")) {
      e.preventDefault();
      Modal.show($("#attribution").innerHTML);
    }
  });

  showMusicStatus();
};

document.addEventListener("DOMContentLoaded", menu);