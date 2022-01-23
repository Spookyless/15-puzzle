class CSSRecordOverlay {
    constructor(appendTo, puzzleObject) {
        this.parent = appendTo;
        this.puzzle = puzzleObject;

        this.HTMLHandle = document.createElement("div");
        this.HTMLHandle.id = "css-record-overlay";
        this.HTMLHandle.style.display = "none";
        this.parent.appendChild(this.HTMLHandle);
    }

    UpdateContent(size) {
        var sizeString = puzzleObject.solved == false ? `${size}x${size}` : `${selectedSize}x${selectedSize}`;
        var puzzleName = puzzleObject.solved == false ? puzzleObject.currentImageName : puzzleObject.slider.GetName();
        var recordTable = "<tr><th>Place</th><th>Name</th><th>Time</th></tr>";

        if (this.puzzle.bestTimesManager.bestTimes[puzzleName][sizeString] != undefined) {
            this.puzzle.bestTimesManager.bestTimes[puzzleName][sizeString].forEach((element, index) => {
                if (element.n != "" && element.t != "") {
                    recordTable += HTMLTemplates.cssRecordOverlayRow.replace("[%1]", index + 1).replace("[%2]", element.n).replace("[%3]", this.puzzle.counter.GetTimeString(element.t));
                }
            });
        }

        if (recordTable == "<tr><th>Place</th><th>Name</th><th>Time</th></tr>") {
            recordTable = "<p>Brak</p>"
        }

        this.HTMLHandle.innerHTML = HTMLTemplates.cssRecordOverlay.replace("[%1]", `${sizeString} - ${puzzleName.toUpperCase()}`).replace("[%2]", recordTable);
    }

    Show() {
        this.HTMLHandle.style.display = "block";
    }

    Hide() {
        this.HTMLHandle.style.display = "none";
    }
}