"use strict";

window.Backgrounds = (function() {
  var CURRENT_ID_KEY = "backgrounds.index";
  Setting.init(CURRENT_ID_KEY, 17, "integer");

  function currentId() {
    if(arguments.length == 1) {
      Setting(CURRENT_ID_KEY, arguments[0]);
      render();
    }
    else {
      return Setting(CURRENT_ID_KEY);
    }
  }

  function current() {
    return window.backgroundImages[currentId()];
  }

  function render() {
    document.body.style.backgroundImage = `url("images/${current().path}")`;
  }

  document.addEventListener("DOMContentLoaded", render);

  return {
    images: function() {
      return window.backgroundImages;
    },
    current: current,
    currentId: currentId
  };
})();
