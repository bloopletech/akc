var player;
var playerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video', {
    videoId: 'dLovK29c9r4',
    playerVars: {
      autoplay: 0,
      disablekb: 1,
      controls: 0,
      fs: 0,
      showinfo: 0
    },
    events: {
      onReady: function() {
        playerReady = true;
      }
    }
  });
}

