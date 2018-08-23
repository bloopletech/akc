"use strict";

window.Panels.MyScores = (function() {
  var $root;
  var dateFormatter = new Intl.DateTimeFormat('en-AU', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true
  });

  function mount() {
    Panel.show(`<div id="my-scores-root"></div>`);
    $root = $("#my-scores-root");

    Api.myScores(render);
  }

  function render(scores) {
    $root.innerHTML = `
      <h2>Your Scores</h2>
      <table>
        <tr>
          <th>Score</th>
          <th>Streak</th>
          <th>Rank</th>
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
        <td>${e(score.value)}</td>
        <td>${e(score.streak)}</td>
        <td>${e(score.rank)}</td>
        <td>${e(formatTimestamp(score.created_at))}</td>
      </tr>`;
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
})();
