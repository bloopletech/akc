"use strict";

window.Panels.BackgroundImage = function() {
  function clickHandler(e) {
    if(e.target.matches("#background-image-list a")) {
      e.preventDefault();
      var index = e.target.getAttribute("href").substring(1);
      Backgrounds.setIndex(index);
      render();
    }
  }

  function mount() {
    document.body.addEventListener("click", clickHandler);
    setTimeout(render, 0);

    return `<div id="background-image-root">Loading...</div>`;
  }
  
  function render() {
    $("#background-image-root").innerHTML = `
      <h2>Background Image</h2>
      <ul id="background-image-list" class="choose-list">
        ${renderImages()}
      </ul>`;
  }

  function renderImages() {
    var output = [];
    var images = Backgrounds.images();
    for(var i = 0; i < images.length; i++) output.push(renderImage(images[i], i));
    return output.join("");
  }

  function renderImage(image, index) {
    var klass = (index == Backgrounds.getIndex()) ? "active" : "";
    return `
      <li>
        <a href="#${index}" class="${klass}">${e(image.title)}</a>
      </li>`;
  }

  function unmount() {
    document.body.removeEventListener("click", clickHandler);
  }

  return {
    mount: mount,
    unmount: unmount
  };
};