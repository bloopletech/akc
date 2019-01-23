"use strict";

window.Panels.BackgroundImage = function() {
  function clickHandler(e) {
    if(e.target.matches("#background-image-root a")) {
      e.preventDefault();
      var index = e.target.getAttribute("href").substring(1);
      BackgroundImages.currentId = index;
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
      ${renderImages()}`;
  }

  function renderImages() {
    var output = [];
    var images = BackgroundImages.images();
    for(var i = 0; i < images.length; i++) output.push(renderImage(images[i], i));
    return output.join("");
  }

  function renderImage(image, index) {
    var klass = index == BackgroundImages.currentId ? "active" : "";
    return `<a href="#${index}" class="list-item ${klass}">${e(image.title)}</a>`;
  }

  function unmount() {
    document.body.removeEventListener("click", clickHandler);
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
