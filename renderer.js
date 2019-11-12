// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { remote, BrowserView } = require("electron");

window.currentWindow = remote.getCurrentWindow();
let views = currentWindow.getBrowserViews();
let isMoving = false;
let offsetX = 0;
let container = document.querySelector(".container");
document.addEventListener("mousedown", e => {
  if (e.target.className === "container") {
    isMoving = true;
    offsetX = e.offsetX;
  }
});

document.addEventListener("mousemove", e => {
  //
  if (isMoving) {
    console.log(e);
    container.style.transform = `translateX(${e.clientX - offsetX}px)`;
    views[0].setBounds({
      x: e.clientX - 800 - offsetX,
      y: 0,
      width: 800,
      height: 600
    });
    views[1].setBounds({
      x: e.clientX + 800 - offsetX,
      y: 0,
      width: 800,
      height: 600
    });
  }
});
document.addEventListener("mouseup", e => {
  if (isMoving) {
    if (e.clientX - offsetX > 100) {
        start(0,1);
    }
  }
  isMoving = false;
});

function start(position, direction) {
  let startX = views[0].getBounds().x;
  const duration = 200;
  const ms = 16;
  const times = duration / ms;
  let done = false;
  const speed =
    Math.floor(
      (direction > 0 ? position - startX : startX - position) / times
    ) + direction;
  move(startX, speed, position);
  function move(startX, speed, position) {
    if (done) {
      return;
    }
    let movex = startX + speed;
    if ((speed > 0 && movex > position) || (speed < 0 && movex < position)) {
      done = true;
      movex = position;
    }
    container.style.transform = `translateX(${movex + 800}px)`;
    views[0].setBounds({
      x: movex,
      y: 0,
      width: 800,
      height: 600
    });
    views[1].setBounds({
      x: movex + 1600,
      y: 0,
      width: 800,
      height: 600
    });
    requestAnimationFrame(() => {
      move(movex, speed, position);
    });
  }
}
