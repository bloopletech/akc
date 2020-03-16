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
      <table class="rounds">
        <tr>
          <th>#</th>
          <th></th>
          <th>
            <svg class="icon">
              <use xlink:href="#icon-touch-app" href="#icon-touch-app" />
            </svg>
            <svg class="icon">
              <use xlink:href="#icon-alarm" href="#icon-alarm" />
            </svg>
          </th>
          <th>
            <svg class="icon">
              <use xlink:href="#icon-space-bar" href="#icon-space-bar" />
            </svg>
            <svg class="icon">
              <use xlink:href="#icon-schedule" href="#icon-schedule" />
            </svg>
          </th>
          <th>
            <svg class="icon">
              <use xlink:href="#icon-track-changes" href="#icon-track-changes" />
            </svg>
          </th>
          <th>
            <svg class="icon">
              <use xlink:href="#icon-score" href="#icon-score" />
            </svg>
          </th>
          <th>
            <svg class="icon">
              <use xlink:href="#icon-loop" href="#icon-loop" />
            </svg>
          </th>
        </tr>
        ${renderRounds(result.rounds)}
      </table>`);
  }

  function renderRounds(rounds) {
    var output = [];
    for(var i = 0; i < rounds.length; i++) output.push(renderRound(rounds[i]));
    return output.join("");
  }

  function renderRound(round) {
    var segments = [];

    segments.push(`<td class="streak">${ef(round.streak)}</td>`);
    segments.push(`<td class="direction">${renderDirection(round.direction)}</td>`);
    segments.push(renderTimes(round));

    if(round.delta != null) {
      segments.push(`<td class="delta">+${ef(round.delta)}</td>`);
    }
    else {
      segments.push(`<td class="delta"></td>`);
    }

    if(round.combo) {
      segments.push(`
        <td class="combo">
          <svg class="icon">
            <use xlink:href="#icon-dot" href="#icon-dot" />
          </svg>
        </td>`);
    }
    else {
      segments.push(`<td class="combo"></td>`);
    }

    return `<tr>${segments.join("")}</tr>`;
  }

  function renderTimes(round) {
    var ms = `<span class="ms">ms</span>`;
    var allowedTime = `
      <td class="allowed-time">${ef(round.allowedTime)}${ms}</td>`;

    if(round.grindStart != null) {
      var reactionTime = Math.round(round.grindStart - round.startTime);
      var grindDuration = Math.round(round.now - round.grindStart);
      return `
        <td class="reaction-time">${ef(reactionTime)}${ms}</td>
        <td class="grind-duration">${ef(grindDuration)}${ms}</td>
        ${allowedTime}`;
    }

    return `
      <td class="reaction-time"></td>
      <td class="grind-duration"></td>
      ${allowedTime}`;
  }

  function renderDirection(direction) {
    return `
      <svg class="icon">
        <use xlink:href="#icon-arrow-${direction}" href="#icon-arrow-${direction}" />
      </svg>`;
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
