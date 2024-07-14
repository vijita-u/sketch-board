const drawTool = document.querySelector(".header__tools-draw");
const drawToolContainer = document.querySelector(".icon__container");
const eraserTool = document.querySelector(".header__tools-erase");
const eraserToolContainer = document.querySelector(".icon__container2");
const notesTool = document.querySelector(".header__tools-note");
const uploadTool = document.querySelector(".header__tools-upload");
const downloadTool = document.querySelector(".header__tools-download");

let drawToolOpen = false;
let eraserToolOpen = false;

// Draw Tool
drawTool.addEventListener("click", (e) => {
  drawToolOpen = !drawToolOpen;
  if (drawToolOpen) {
    drawToolContainer.style.display = "flex";
  } else {
    drawToolContainer.style.display = "none";
  }
});

// Erase Tool
eraserTool.addEventListener("click", (e) => {
  eraserToolOpen = !eraserToolOpen;
  if (eraserToolOpen) {
    eraserToolContainer.style.display = "flex";
  } else {
    eraserToolContainer.style.display = "none";
  }
});

// Notes Tool
notesTool.addEventListener("click", (e) => {
  generateNote("textarea");
});

// Upload Tool
uploadTool.addEventListener("click", (e) => {
  // Open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", ".png, .jpeg, .jpg, .svg");
  input.click();

  input.addEventListener("change", (e) => {
    let selectedFile = input.files[0];
    // create a url out of the object
    let selectedFileURL = URL.createObjectURL(selectedFile);
    generateNote("img", selectedFileURL);
  });
});

// download tool
downloadTool.addEventListener("click", (e) => {
    // Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
    // default PNG format
    let canvasURL = canvas.toDataURL();

    // create an anchor el
    let a = document.createElement("a");
    a.href = canvasURL;
    a.download = "board.jpg";
    a.click();

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

function generateNote(inputType = "textarea" || "img", image) {
  let note = document.createElement("div");
  note.setAttribute("class", "note");
  note.innerHTML = `
    <div class="note__nav">
        <div class="note__nav--minimize"><i class="fa-solid fa-minus fa-2xs"></i></div>
        <div class="note__nav--close"><i class="fa-solid fa-xmark fa-2xs"></i></div>
      </div>
      <div class="note__text">
      ${
        inputType == "textarea"
          ? `<textarea spellcheck="false"></textarea>`
          : `<img src=${image} alt="Image" />`
      }
      </div>
    `;

    note.style.position = "absolute";
    note.style.zIndex = 1000;

  document.body.appendChild(note);

  note.ondragstart = function () {
    return false;
  };

  dragAndDrop(note);

  const noteMinimize = note.querySelector(".note__nav--minimize");
  const noteClose = note.querySelector(".note__nav--close");

  noteClose.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    note.remove();
  });

  noteMinimize.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    let noteContainer = note.querySelector(".note__text");
    let displayProp =
      getComputedStyle(noteContainer).getPropertyValue("display");
    displayProp === "block"
      ? (noteContainer.style.display = "none")
      : (noteContainer.style.display = "block");
  });
}

function dragAndDrop(element) {
  element.onmousedown = function (event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = "absolute";
    element.style.zIndex = 1000;

    document.body.append(element);

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + "px";
      element.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      element.onmouseup = null;
    };
  };
}

function noteActions(minimize, remove, note) {
  remove.addEventListener("click", (e) => {
    // note.remove();
    console.log("remove");
  });

  minimize.addEventListener("click", (e) => {
    // let noteContainer = document.querySelector(".note__text");
    // let displayProp =
    //   getComputedStyle(noteContainer).getPropertyValue("display");
    // displayProp === "block"
    //   ? (noteContainer.style.display = "none")
    //   : (noteContainer.style.display = "block");
    console.log("minimize");
  });
}