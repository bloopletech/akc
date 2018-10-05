"use strict";

window.router = function() {
  var routes = {
    "my_scores": function() {
      Panels.MyScores.mount();
    }
  }

  function onNavigate(event) {
    var action = routes[window.location.hash.substring(1)];
    if(action) action();
  }

  window.addEventListener("hashchange", onNavigate, false);
  onNavigate();
};

document.addEventListener("DOMContentLoaded", router);
