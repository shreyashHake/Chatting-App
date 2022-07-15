'use strict';

var uWindow = document.querySelector(".users-window");
function show_hid() {
  if (uWindow.style.display == "block") {
    uWindow.style.display = "none";
  } else {
    uWindow.style.display = "block";
  }
}

document.querySelector('.more').addEventListener('click', show_hid);