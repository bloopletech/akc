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
    var link = e.target.closest("#menu a.list-item");
    if(link) {
      e.preventDefault();
      var type = link.getAttribute("href").substring(1);
      Panel.forward(new Panels[type]());
    }
    if(e.target.closest("#menu-trigger")) document.body.classList.add("menu-open");
    if(e.target.closest("#menu-close")) document.body.classList.remove("menu-open");
    if(e.target.closest("#music-status")) updateMusicStatus();
  });

  showMusicStatus();
};

document.addEventListener("DOMContentLoaded", menu);