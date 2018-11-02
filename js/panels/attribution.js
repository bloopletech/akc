"use strict";

window.Panels.Attribution = function() {
  function mount() {
    return `
      Music: "<a href="http://freemusicarchive.org/music/Audiobinger/~/City_Lights_1859">City Lights</a>" by <a href="http://freemusicarchive.org/music/Audiobinger/">Audiobinger</a><br>
      From the <a href="https://freemusicarchive.org/">Free Music Archive</a><br>
      <a href="http://creativecommons.org/licenses/by-nc/4.0/">CC BY NC</a>
    `;
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
};