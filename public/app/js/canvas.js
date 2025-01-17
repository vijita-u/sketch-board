let socket = io.connect("https://sketch-board-9djl.onrender.com/");

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pencilColors = document.querySelectorAll(".icon__colors");
const drawWidthEl = document.querySelector(".draw-width");
const eraseWidthEl = document.querySelector(".erase-width");
const undoTool = document.querySelector(".header__tools-undo");
const redoTool = document.querySelector(".header__tools-redo");

// undo-redo
let undoRedoTracker = [];
let currentTrack = 0; // Represents the current action

let mouseDown = false;

let pencilColor = "black";
let drawWidth = drawWidthEl.value;
let eraseWidth = eraseWidthEl.value;

let ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// change pencil color
ctx.strokeStyle = pencilColor;
// change pencil width
ctx.lineWidth = drawWidth;

// mousedown -> start new path
// mousemove -> keep filling the path to make it visible
// mouseup -> end path

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;

  let data = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop,
  };

  // Send data to server
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop,
    };

    socket.emit("drawStroke", data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;

  let canvasURL = canvas.toDataURL();
  undoRedoTracker.push(canvasURL);
  currentTrack = undoRedoTracker.length - 1;
});

// Changing colours
drawTool.addEventListener("click", (e) => {
  ctx.strokeStyle = pencilColor;
  ctx.lineWidth = drawWidth;
  pencilColors.forEach((colourEl) => {
    colourEl.addEventListener("click", (e) => {
      pencilColor = colourEl.classList[1];
      ctx.strokeStyle = pencilColor;
    });
  });
  drawWidthEl.addEventListener("change", (e) => {
    drawWidth = drawWidthEl.value;
    ctx.lineWidth = drawWidth;
  });
});

// Changing pencil colour to white when eraserTool is being used
eraserTool.addEventListener("click", (e) => {
  ctx.strokeStyle = "white";
  ctx.lineWidth = eraseWidth;
  eraseWidthEl.addEventListener("change", (e) => {
    eraseWidth = eraseWidthEl.value;
    ctx.lineWidth = eraseWidth;
  });
});

let trackObj = {
  track: currentTrack,
  trackerData: undoRedoTracker,
};

// undo tool
undoTool.addEventListener("click", (e) => {
  if (currentTrack > 0) currentTrack--;
  socket.emit("undoRedoAction", trackObj);
});

// redo tool
redoTool.addEventListener("click", (e) => {
  if (currentTrack < undoRedoTracker.length - 1) currentTrack++;
  socket.emit("undoRedoAction", trackObj);
});

/*
 *
 *
 *
 *
 *
 *
 *
 */

function beginPath(coordinates) {
  ctx.beginPath();
  ctx.moveTo(coordinates.x, coordinates.y);
}

function drawStroke(coordinates) {
  ctx.lineTo(coordinates.x, coordinates.y);
  ctx.stroke();
}

function undoRedoAction(trackObj) {
  let trackURL = trackObj.trackerData[currentTrack];
  let image = new Image();
  image.src = trackURL;
  image.onload = (e) => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}


// Data from server
socket.on("beginPath", (data) => {
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  drawStroke(data);
});

socket.on("undoRedoAction", (data) => {
  undoRedoAction(data);
})