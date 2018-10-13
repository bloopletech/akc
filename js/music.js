"use strict";

window.Music = (function() {
  var player;

  function lastStartKey() {
    return "music.lastStart";
  }

  function getLastStart() {
    var lastStart = localStorage[lastStartKey()];
    return lastStart ? parseFloat(lastStart) : 0;
  }

  function setLastStart(time) {
    if(time == null) delete localStorage[lastStartKey()];
    else localStorage[lastStartKey()] = time;
  }

  function play() {
    player.play();
  }

  function pause() {
    player.pause();
    if(!player.ended) setLastStart(player.currentTime);
  }

  function initPlayer() {
    player = new Audio("music/Audiobinger_-_City_Lights.mp3");
    player.addEventListener("ended", function() {
      setLastStart(null);
    });
    player.currentTime = getLastStart();
  }

  return {
    init: initPlayer,
    play: play,
    pause: pause
  };
})();
