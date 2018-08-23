"use strict";

function dom() {
  window.$ = document.querySelector.bind(document);
}

document.addEventListener("DOMContentLoaded", dom);