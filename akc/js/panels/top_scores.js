"use strict";

window.Panels.TopScores = function() {
  function clickHandler(e) {
    if(e.target.matches("#top-scores-root a")) {
      e.preventDefault();
      Panel.forward(new Panels.ShowResult(e.target.dataset.id));
    }
  }

  function mount() {
    document.body.addEventListener("click", clickHandler);
    Api.loadTopScores(render);
    return `<div id="top-scores-root">Loading...</div>`;
  }

  function render(scores) {
    $("#top-scores-root").innerHTML = `
      <h2>Top Scores</h2>
      <table>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Score</th>
          <th class="visible-desktop">Streak</th>
          <th>When</th>
        </tr>
        ${renderScores(scores)}
      </table>`;
  }

  function renderScores(scores) {
    var output = [];
    for(var i = 0; i < scores.length; i++) output.push(renderScore(scores[i], i + 1));
    return output.join("");
  }

  function renderScore(score, position) {
    return `
      <tr>
        <td>${ef(position)}</td>
        <td>${e(score.username)}</td>
        <td><a href="#" data-id="${e(score.id)}">${ef(score.value)}</a></td>
        <td class="visible-desktop">${ef(score.streak)}</td>
        <td>${ef(new Date(score.created_at))}</td>
      </tr>`;
  }

  function unmount() {
    document.body.removeEventListener("click", clickHandler);
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
