"use strict";

window.Panels.MyProfile = function() {
  function submitHandler(e) {
    if(e.target.matches("#my-profile-form form")) {
      e.preventDefault();
      $("#my-profile-form .btn").classList.add("disabled");
      update();
    }
  }

  function clickHandler(e) {
    if(e.target.matches("#my-profile-form .btn.disabled")) e.preventDefault();
  }

  function update() {
    var alert = $("#my-profile-message");
    alert.innerHTML = "";
    alert.classList.remove("success", "error");

    Profile.username($("#profile-username").value);
    Profile.save(function() {
      alert.innerHTML = "User profile updated successfully.";
      alert.classList.add("success");
      renderForm();
    }, function(data) {
      alert.innerHTML = renderErrors(data.errors);
      alert.classList.add("error");
      $("#my-profile-form .btn").classList.remove("disabled");
    });
  }

  function mount() {
    document.body.addEventListener("submit", submitHandler);
    document.body.addEventListener("click", clickHandler);

    setTimeout(function() {
      Profile.load(render);
    }, 0);

    return `<div id="my-profile-root">Loading...</div>`;
  }

  function render() {
    $("#my-profile-root").innerHTML = `
      <h2>Your Profile</h2>
      <div id="my-profile-message" class="alert"></div>
      <div id="my-profile-form"></div>`;
    renderForm();
  }

  function renderForm() {
    $("#my-profile-form").innerHTML = `
      <form>
        <div>
          <label for="profile-username">Username</label>
          <input type="text" id="profile-username" value="${e(Profile.username())}">
        </div>
        <div>
          <label for="user-token">Token</label>
          <p>${e(Profile.token())}</p>
        </div>
        <div>
          <button type="submit" class="btn">Save</button>
        </div>
      </form>`;
  }

  function renderErrors(errors) {
    var output = [];
    for(var i = 0; i < errors.length; i++) output.push(`<li>${errors[i]}</li>`);
    return `
      <p>Sorry, these errors prevented your profile from being updated:</p>
      <ul>${output.join("")}</ul>`;
  }

  function unmount() {
    document.body.removeEventListener("submit", submitHandler);
    document.body.removeEventListener("click", clickHandler);
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
