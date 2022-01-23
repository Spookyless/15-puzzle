class CSSWinOverlay {
    constructor(appendTo, puzzleObject) {
        this.parent = appendTo;
        this.puzzle = puzzleObject;

        this.HTMLHandle = document.createElement("div");
        this.HTMLHandle.id = "css-win-overlay";
        this.HTMLHandle.style.display = "none";
        this.parent.appendChild(this.HTMLHandle);
    }

    UpdateContent(size, time) {
        var sizeString = puzzleObject.solved == false ? `${size}x${size}` : `${selectedSize}x${selectedSize}`;
        var puzzleName = puzzleObject.solved == false ? puzzleObject.currentImageName : puzzleObject.slider.GetName();

        this.HTMLHandle.innerHTML = HTMLTemplates.cssWinOverlay.replace("[%1]", `"${sizeString} - ${puzzleName.toUpperCase()}"`).replace("[%2]", time);
    }

    Show() {
        this.HTMLHandle.style.display = "block";
    }

    Hide() {
        this.HTMLHandle.style.display = "none";
    }
}