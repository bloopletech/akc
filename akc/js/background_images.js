"use strict";

window.BackgroundImages = (function() {
  Settings.define("backgroundImageId", "integer", 17);

  function currentId() {
    if(arguments.length == 1) {
      Settings.backgroundImageId = arguments[0];
      render();
    }
    else {
      return Settings.backgroundImageId;
    }
  }

  function current() {
    return window.allImages[currentId()];
  }

  function render() {
    document.body.style.backgroundImage = `url("images/${current().path}")`;
  }

  document.addEventListener("DOMContentLoaded", render);

  return {
    images: function() {
      return window.allImages;
    },
    current: current,
    currentId: currentId
  };
})();
