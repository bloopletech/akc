"use strict";

window.Backgrounds = (function() {
  var currentImage = null;

  function show(index) {
    currentImage = window.backgroundImages[index];
    $("body").style.backgroundImage = `url("images/${currentImage.path}")`;
  }

  function init() {
    show(17);
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    attribution: function() {
      return currentImage.attribution;
    },
    show: show
  };
})();
