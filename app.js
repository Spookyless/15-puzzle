"use strict";

//#region SETTINGS
var imageWidth = 900;
var imageHeight = 900;
var minatureImageWidth = 200;
var minatureImageHeight = 200;
var puzzleWidth = 600;
var puzzleHeight = 600;

var puzzleSizes = [3, 4, 5, 6];

var selectedSize = 3;
//#endregion

//#region CREATE BASIC PAGE LAYOUT
var bodyContainer = document.createElement("div");
bodyContainer.id = "container";
document.body.appendChild(bodyContainer);

var bodyGameSettingsContainer = document.createElement("div");
bodyGameSettingsContainer.id = "game-settings-container";
bodyContainer.appendChild(bodyGameSettingsContainer);

var bodySizeSelection = document.createElement("div");
bodySizeSelection.id = "size-image-select";
bodyGameSettingsContainer.appendChild(bodySizeSelection);

var bodySizeButtonContainer = document.createElement("div");
bodySizeButtonContainer.id = "size-button-container"
bodySizeSelection.appendChild(bodySizeButtonContainer);

puzzleSizes.forEach(element => {
    var bodySizeButton = document.createElement("button");
    bodySizeButton.classList.add("size-button");
    if (element == 3) { bodySizeButton.classList.add("selected"); }
    bodySizeButton.textContent = `${element} x ${element}`;
    bodySizeButton.dataset.size = element;

    bodySizeButton.addEventListener("click", (event) => {
        selectedSize = parseInt(event.target.dataset.size);

        document.querySelectorAll("button.size-button").forEach(element => {
            element.classList.remove("selected");
        });
        event.target.classList.add("selected");

        let s = `${puzzleObject.solved == false ? puzzleObject.size : selectedSize}`;
        let i = (puzzleObject.solved == false ? puzzleObject.currentImageName.toUpperCase() : puzzleObject.slider.GetName().toUpperCase());
        puzzleObject.bestCounter.DOMUpdateTitle(`Best time (${s}x${s} - ${i}):`);
        if (puzzleObject.bestTimesManager.GetBestTime(i.toLowerCase(), `${s}x${s}`, 0) != undefined) {
            puzzleObject.bestCounter.UpdateClock(puzzleObject.bestCounter.GetTimeString(puzzleObject.bestTimesManager.GetBestTime(i.toLowerCase(), `${s}x${s}`, 0).t));
        } else {
            puzzleObject.bestCounter.UpdateClock(puzzleObject.bestCounter.GetTimeString(null));
        }

        bodyStartGameButton.innerHTML = `Start (${selectedSize}x${selectedSize} - ${puzzleObject.slider.GetName().toUpperCase()})`;
    });

    bodySizeButtonContainer.appendChild(bodySizeButton);
});

var bodyImageControl = document.createElement("div");
bodyImageControl.id = "image-control";
bodySizeSelection.appendChild(bodyImageControl);

[-1, 1].forEach(element => {
    var bodyImageButton = document.createElement("div");
    bodyImageButton.classList.add("image-button", `arrow-${element == -1 ? "left" : "right"}`);
    bodyImageButton.innerHTML = `&#${8679 + element};`; //! 200IQ

    bodyImageButton.addEventListener("click", (event) => {
        puzzleObject.slider.Swipe(element);

        let s = `${puzzleObject.solved == false ? puzzleObject.size : selectedSize}`;
        let i = (puzzleObject.solved == false ? puzzleObject.currentImageName.toUpperCase() : puzzleObject.slider.GetName().toUpperCase());
        puzzleObject.bestCounter.DOMUpdateTitle(`Best time (${s}x${s} - ${i}):`);
        if (puzzleObject.bestTimesManager.GetBestTime(i.toLowerCase(), `${s}x${s}`, 0) != undefined) {
            puzzleObject.bestCounter.UpdateClock(puzzleObject.bestCounter.GetTimeString(puzzleObject.bestTimesManager.GetBestTime(i.toLowerCase(), `${s}x${s}`, 0).t));
        } else {
            puzzleObject.bestCounter.UpdateClock(puzzleObject.bestCounter.GetTimeString(null));
        }

        bodyStartGameButton.innerHTML = `Start (${selectedSize}x${selectedSize} - ${puzzleObject.slider.GetName().toUpperCase()})`;
    });

    bodyImageControl.appendChild(bodyImageButton);
});

var bodyShowNumbers = document.createElement("div");
bodyShowNumbers.id = "show-numbers";
bodyShowNumbers.innerHTML = "Show numbers";
bodyShowNumbers.classList.add("off");
bodyShowNumbers.addEventListener("click", (event) => {
    let o = document.getElementById("puzzle-container");

    if (o.classList.contains("show-numbers")) {
        bodyShowNumbers.classList.add("off");
        bodyShowNumbers.classList.remove("on");
        o.classList.remove("show-numbers");
    } else {
        bodyShowNumbers.classList.add("on");
        bodyShowNumbers.classList.remove("off");
        o.classList.add("show-numbers");
    }
});
bodyImageControl.appendChild(bodyShowNumbers);

var bodyStartGameButton = document.createElement("div");
bodyStartGameButton.id = "start-game";
bodyStartGameButton.innerHTML = "Start (3x3 - KACZOR)";
bodyStartGameButton.addEventListener("click", (event) => {
    if (puzzleObject.nowScrambling == false) {
        CreatePuzzleLayout(puzzleWidth, puzzleHeight, selectedSize, puzzleObject.slider.GetName());
    }
});
bodySizeSelection.appendChild(bodyStartGameButton);

var bodyMinatureImagesContainer = document.createElement("div");
bodyMinatureImagesContainer.id = "minature-image-container";
bodyMinatureImagesContainer.style.width = `${minatureImageWidth}px`;
bodyMinatureImagesContainer.style.height = `${minatureImageHeight}px`;
bodyGameSettingsContainer.appendChild(bodyMinatureImagesContainer);

var bodyMinatureImagesSlider = document.createElement("div");
bodyMinatureImagesSlider.id = "minature-image-slider";
bodyMinatureImagesContainer.appendChild(bodyMinatureImagesSlider);

var minutureImageSlider = new Slider(bodyMinatureImagesSlider, minatureImageWidth - 4, minatureImageHeight - 4);

minutureImageSlider.SetCommonPath("./media/images/");
minutureImageSlider.RegisterNewImage("Kaczor", "kaczor.png");
minutureImageSlider.RegisterNewImage("Duda", "duda.png");
minutureImageSlider.RegisterNewImage("Sasin", "sasin.png");
minutureImageSlider.RegisterNewImage("Korwin", "korwin.png");
minutureImageSlider.RegisterNewImage("Morawiecki", "morawiecki.png");
minutureImageSlider.RegisterNewImage("Bosak", "bosak.png", true);

var bodyGameTimerContainer = document.createElement("div");
bodyGameTimerContainer.id = "game-timer-container";
bodyGameSettingsContainer.appendChild(bodyGameTimerContainer);

var bodyCurrentTime = document.createElement("div");
var bodyCurrentTimeTitle = document.createElement("div");
var bodyCurrentTimeCounter = document.createElement("div");
bodyCurrentTime.id = "current-time";
bodyCurrentTimeTitle.classList.add("title");
bodyCurrentTimeCounter.classList.add("counter");

bodyCurrentTime.appendChild(bodyCurrentTimeTitle);
bodyCurrentTime.appendChild(bodyCurrentTimeCounter);
bodyGameTimerContainer.appendChild(bodyCurrentTime);

var bodyBestTime = document.createElement("div");
var bodyBestTimeTitle = document.createElement("div");
var bodyBestTimeCounter = document.createElement("div");
bodyBestTime.id = "best-time";
bodyBestTimeTitle.classList.add("title");
bodyBestTimeCounter.classList.add("counter");

bodyBestTime.appendChild(bodyBestTimeTitle);
bodyBestTime.appendChild(bodyBestTimeCounter);
bodyGameTimerContainer.appendChild(bodyBestTime);

var bodyShowRecords = document.createElement("div");
bodyShowRecords.id = "show-records";
bodyShowRecords.innerHTML = "Show Best Times";
bodyShowRecords.addEventListener("click", () => {
    puzzleObject.cssRecordOverlay.UpdateContent(puzzleObject.size);
    puzzleObject.cssRecordOverlay.Show();
});

bodyGameTimerContainer.appendChild(bodyShowRecords);

var currentTimeCounter = new Counter(bodyCurrentTime, "Current time:", true);
var bestTimeCounter = new Counter(bodyBestTime, "Best time:", true, "--:--:--.---");

var bodyPuzzleContainer = document.createElement("div");
bodyPuzzleContainer.id = "puzzle-container";
bodyPuzzleContainer.style.width = `${puzzleWidth}px`;
bodyPuzzleContainer.style.height = `${puzzleHeight}px`;
bodyContainer.appendChild(bodyPuzzleContainer);

var puzzleObject = new Puzzle(bodyPuzzleContainer, minutureImageSlider);
puzzleObject.counter = currentTimeCounter;
puzzleObject.bestCounter = bestTimeCounter;
puzzleObject.slider = minutureImageSlider;

currentTimeCounter.UpdateClock(currentTimeCounter.GetTimeString(null));
currentTimeCounter.DOMUpdateTitle("Current time (nothing):");
bestTimeCounter.DOMUpdateTitle(`Best time (3x3 - ${puzzleObject.slider.GetName().toUpperCase()}):`);
if (puzzleObject.bestTimesManager.GetBestTime(puzzleObject.slider.GetName(), "3x3", 0) != undefined) {
    bestTimeCounter.UpdateClock(bestTimeCounter.GetTimeString(puzzleObject.bestTimesManager.GetBestTime(puzzleObject.slider.GetName(), "3x3", 0).t));
} else {
    bestTimeCounter.UpdateClock(bestTimeCounter.GetTimeString(null));
}

//#endregion

//#region PRELOAD COUNTER IMAGES
var imageTab = [];
var k = Object.keys(puzzleObject.counter.path);

k.forEach(element => {
    if (element != "main") {
        let a = document.createElement("img");
        a.src = puzzleObject.counter.path.main + puzzleObject.counter.path[element];
        k.push(a);
    }
});
//#endregion

//#region CREATE PUZZLE LAYOUT
function CreatePuzzleLayout(imageWidth, imageHeight, partCount, imageName) {
    let s = `${puzzleObject.solved == false ? puzzleObject.size : selectedSize}`;
    let i = (puzzleObject.solved == false ? puzzleObject.currentImageName.toUpperCase() : puzzleObject.slider.GetName().toUpperCase());

    bodyShowRecords.style.display = "block";

    currentTimeCounter.Reset();
    currentTimeCounter.DOMUpdateTitle(`Current time (${s}x${s} - ${i}):`);
    currentTimeCounter.DOMChangeState(true);

    bestTimeCounter.DOMUpdateTitle(`Best time (${s}x${s} - ${i}):`);
    bestTimeCounter.DOMChangeState(true);

    if (puzzleObject.bestTimesManager.GetBestTime(puzzleObject.currentImageName, `${partCount}x${partCount}`, 0) != undefined) {
        bestTimeCounter.UpdateClock(bestTimeCounter.GetTimeString(puzzleObject.bestTimesManager.GetBestTime(puzzleObject.currentImageName, `${partCount}x${partCount}`, 0).t));
    } else {
        bestTimeCounter.UpdateClock(bestTimeCounter.GetTimeString(null));
    }


    puzzleObject.ClearTiles();
    puzzleObject.UpdateParameters(imageWidth, imageHeight, partCount, imageName);
    puzzleObject.CreateTiles();

    puzzleObject.RegisterDOMClickEvent();

    puzzleObject.Scramble();
}
//#endregion