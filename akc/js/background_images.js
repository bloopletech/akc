"use strict";

window.BackgroundImages = (function() {
  Settings.define("backgroundImageId", "integer", 17);

  function current() {
    return window.allImages[Settings.backgroundImageId];
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
    get currentId() {
      return Settings.backgroundImageId;
    },
    set currentId(value) {
      Settings.backgroundImageId = value;
      render();
    }
  };
})();
