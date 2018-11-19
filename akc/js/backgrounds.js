"use strict";

window.Backgrounds = (function() {
  var BACKGROUND_INDEX_KEY = "backgrounds.index";
  Setting.init(BACKGROUND_INDEX_KEY, 0, "integer");

  function getIndex() {
    return Setting(BACKGROUND_INDEX_KEY);
  }

  function setIndex(index) {
    Setting(BACKGROUND_INDEX_KEY, index);
    render();
  }

  function current() {
    return window.backgroundImages[getIndex()];
  }

  function render() {
    $("body").style.backgroundImage = `url("images/${current().path}")`;
  }

  document.addEventListener("DOMContentLoaded", render);

  return {
    images: function() {
      return window.backgroundImages;
    },
    current: current,
    getIndex: getIndex,
    setIndex: setIndex
  };
})();
