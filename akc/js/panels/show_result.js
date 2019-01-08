"use strict";

window.Panels.ShowResult = function(scoreId) {
  function mount() {
    Api.loadResult(scoreId, render);
    return `<div id="show-result-root">Loading...</div>`;
  }

  function render(result) {
    $("#show-result-root").innerHTML = m(`
      <h2>Game Result #${e(result.id)}</h2>
      <table class="game-result">
        <tr>
          <th>User</th>
          <td>${e(result.username)}</td>
        </tr>
        <tr>
          <th>Played At</th>
          <td>${ef(new Date(result.created_at))}</td>
        </tr>
        <tr>
          <th>Outcome</th>
          <td>${e(Game.formatOutcome(result.outcome))}</td>
        </tr>
        <tr>
          <th>Streak</th>
          <td>${ef(result.streak)}</td>
        </tr>
        <tr>
          <th>Score</th>
          <td>${ef(result.value)}</td>
        </tr>
        <tr>
          <th>Rank</th>
          <td>${ef(result.rank)}</td>
        </tr>
        <tr>
          <th>Mode</th>
          <td>${ef(result.mode)}</td>
        </tr>
      </table>
      <h3>Rounds</h3>
      <svg class="template">
        <symbol id="icon-schedule" width="24" height="24" viewBox="0 0 24 24">
          <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </symbol>
        <symbol id="icon-timelapse" width="24" height="24" viewBox="0 0 24 24">
          <path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </symbol>
        <symbol id="icon-track-changes" width="24" height="24" viewBox="0 0 24 24">
          <path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.9 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V2h-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z"/>
        </symbol>
        <symbol id="icon-hourglass-full" width="24" height="24" viewBox="0 0 24 24">
          <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/>
        </symbol>
        <symbol id="icon-touch-app" width="24" height="24" viewBox="0 0 24 24">
          <defs>
            <path id="a" d="M0 0h24v24H0V0z"/>
          </defs>
          <clipPath id="b">
            <use xlink:href="#a" overflow="visible"/>
          </clipPath>
          <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" clip-path="url(#b)"/>
        </symbol>
      </svg>
      ${renderRounds(result.rounds)}`);
  }

  function renderRounds(rounds) {
    var output = [];
    for(var i = 0; i < rounds.length; i++) output.push(renderRound(rounds[i]));
    return `<ol class="rounds">${output.join("")}</ol>`;
  }

  function renderRound(round) {
    var segments = [];

    segments.push(`<span class="direction">${e(renderDirection(round.direction))}</span>`);
    segments.push(renderTimes(round));

    if(round.delta != null) {
      segments.push(`<span class="delta">+${ef(round.delta)}</span>`);
    }
    else {
      segments.push(`<span class="delta">—</span>`);
    }

    segments.push(`<span class="combo">${e(round.combo ? "Comboed" : "")}</span>`);

    return `<li>${segments.join("")}</li>`;
  }

  function renderTimes(round) {
    var ms = `<span class="ms">ms</span>`;
    var allowedTime = `
      <span class="allowed-time">
        <svg class="icon">
          <use xlink:href="#icon-track-changes" href="#icon-track-changes" />
        </svg>
        ${ef(round.allowedTime)}${ms}
      </span>`;

    if(round.grindStart != null) {
      var reactionTime = round.grindStart - round.startTime;
      var grindDuration = round.now - round.grindStart;
      return `
        <span class="reaction-time">
          <svg class="icon">
            <use xlink:href="#icon-schedule" href="#icon-schedule" />
          </svg>
          ${ef(reactionTime)}${ms}
        </span>
        <span class="grind-duration">
          <svg class="icon">
            <use xlink:href="#icon-touch-app" href="#icon-touch-app" />
          </svg>
          ${ef(grindDuration)}${ms}
        </span>
        ${allowedTime}`;
    }
    return `<span class="reaction-time">—</span> <span class="grind-duration">—</span> ${allowedTime}`;
  }

  function renderDirection(direction) {
    if(direction == "up") return "🡱";
    if(direction == "right") return "🡲";
    if(direction == "down") return "🡳";
    if(direction == "left") return "🡰";
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
