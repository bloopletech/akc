"use strict";

window.Panels.MyScores = function() {
  var dateFormatter = new Intl.DateTimeFormat('en-AU', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric',
    hour12: true
  });

  function mount() {
    Api.loadScores(render);
    return `<div id="my-scores-root">Loading...</div>`;
  }

  function render(scores) {
    $("#my-scores-root").innerHTML = `
      <h2>Your Scores</h2>
      <table>
        <tr>
          <th>Score</th>
          <th class="visible-desktop">Streak</th>
          <th>When</th>
        </tr>
        ${renderScores(scores)}
      </table>`;
  }

  function renderScores(scores) {
    var output = [];
    for(var i = 0; i < scores.length; i++) output.push(renderScore(scores[i]));
    return output.join("");
  }

  function formatTimestamp(timestamp) {
    return dateFormatter.format(Date.parse(timestamp)).replace(",", "");
  }

  function renderScore(score) {
    return `
      <tr>
        <td>${e(score.value.toLocaleString())}</td>
        <td class="visible-desktop">${e(score.streak.toLocaleString())}</td>
        <td>${e(formatTimestamp(score.created_at))}</td>
      </tr>`;
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
