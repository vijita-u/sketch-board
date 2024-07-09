const drawTool = document.querySelector(".header__tools-draw");
const drawToolContainer = document.querySelector(".icon__container");
const eraserTool = document.querySelector(".header__tools-erase");
const eraserToolContainer = document.querySelector(".icon__container2")
let drawToolOpen = false;
let eraserToolOpen = false;

drawTool.addEventListener("click", (e) => {
    drawToolOpen = !drawToolOpen;
    if (drawToolOpen) {
        drawToolContainer.style.display = "flex";
    } else {
        drawToolContainer.style.display = "none";
    }
})

eraserTool.addEventListener("click", (e) => {
    eraserToolOpen = !eraserToolOpen;
    if (eraserToolOpen) {
        eraserToolContainer.style.display = "flex";
    } else {
        eraserToolContainer.style.display = "none";
    }
})