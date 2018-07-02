var Music = (function() {
  var player;
  var playerInited = false;

  function enabledKey() {
    return "music.enabled";
  }

  function getEnabled() {
    var enabled = localStorage[enabledKey()];
    return enabled ? enabled == "true" : true;
  }

  function setEnabled(enabled) {
    if(!enabled) pause();
    localStorage[enabledKey()] = enabled;
    if(enabled && !playerInited) initPlayer();
  }

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
    if(getEnabled()) player.play();
  }

  function pause() {
    if(getEnabled()) {
      player.pause();
      if(!player.ended) setLastStart(player.currentTime);
    }
  }

  function initPlayer() {
    player = new Audio("music/Audiobinger_-_City_Lights.mp3");
    player.addEventListener("ended", function() {
      setLastStart(null);
    });
    player.currentTime = getLastStart();

    playerInited = true;
  }

  if(getEnabled()) initPlayer();

  return {
    getEnabled: getEnabled,
    setEnabled: setEnabled,
    play: play,
    pause: pause
  };
})();
