"use strict";

window.menu = function() {
  function showJukeboxStatus() {
    $("#jukebox-status").classList.remove("enabled", "disabled");
    $("#jukebox-status").classList.add(Jukebox.getEnabled() ? "enabled" : "disabled");
  }

  function updateJukeboxStatus() {
    Jukebox.setEnabled(!Jukebox.getEnabled());
    showJukeboxStatus();
  }

  document.body.addEventListener("click", function(e) {
    if(e.target.matches("#menu a")) {
      e.preventDefault();
      var type = e.target.getAttribute("href").substring(1);
      Panel.forward(new Panels[type]());
    }
    if(e.target.closest("#menu-trigger")) document.body.classList.add("menu-open");
    if(e.target.closest("#menu-close")) document.body.classList.remove("menu-open");
    if(e.target.closest("#jukebox-status")) updateJukeboxStatus();
  });

  showJukeboxStatus();
};

document.addEventListener("DOMContentLoaded", menu);