"use strict";

window.Panels.MyScores = function() {
  function clickHandler(e) {
    if(e.target.matches("#my-scores-root a")) {
      e.preventDefault();
      Panel.forward(new Panels.ShowResult(e.target.dataset.id));
    }
  }

  function mount() {
    document.body.addEventListener("click", clickHandler);
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

  function renderScore(score) {
    return `
      <tr>
        <td><a href="#ShowResult" data-id="${e(score.id)}">${ef(score.value)}</a></td>
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
