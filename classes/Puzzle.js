class Puzzle {
    constructor(DOMHandle, slider) {
        this.size = null;
        this.tileWidth = null;
        this.tileHeight = null;
        this.imageWidth = null;
        this.imageHeight = null;

        this.slider = slider;

        this.currentImageName = slider.imageArray[0].name;

        this.currentBlank = null;
        this.solved = null;

        this.DOMHandle = DOMHandle;
        this.tileList = [];

        this.counter = null;
        this.bestCounter = null;

        this.scrambling = false;

        this.previousScrambleImageX = null;
        this.previousScrambleImageY = null;

        this.animationTask = null;

        this.nowScrambling = false;

        this.bestTimesManager = new BestTimes(this);

        this.cssWinOverlay = new CSSWinOverlay(document.querySelector("#container"), this);
        this.cssRecordOverlay = new CSSRecordOverlay(document.querySelector("#container"), this);
    }

    ClearTiles() {
        this.DOMHandle.innerHTML = "";
        this.tileList = [];
    }

    UpdateParameters(imageWidth = this.imageHeight, imageHeight = this.imageWidth, size = this.size, currentImageName = this.currentImageName, DOMHandle = this.DOMHandle,) {
        this.size = size;
        this.tileWidth = imageWidth / size;
        this.tileHeight = imageHeight / size;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        this.currentImageName = currentImageName;

        this.DOMHandle = DOMHandle;

        this.solved = false;

        this.previousScrambleImageX = null;
        this.previousScrambleImageY = null;
    }

    CreateTiles() {
        this.previousScrambleImageX = null;
        this.previousScrambleImageY = null;

        if (this.tileList.length > 0) {
            this.tileList.forEach(el => {
                el.parentNode.removeChild(el);
            });
        }

        this.tileList = [];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                var tile = document.createElement("div");

                tile.classList.add("tile");
                tile.classList.add("image");

                tile.style.backgroundImage = `url(${this.slider.GetPathToImage()})`;

                this.DOMHandle.appendChild(tile);

                var ob = new Tile(x, y, this.tileWidth, this.tileHeight, this.imageWidth, this.imageHeight, tile, this);

                if (y == this.size - 1 && x == this.size - 1) {
                    tile.classList.add("blank");
                    this.currentBlank = ob;
                }

                this.tileList.push(ob);
            }
        }

        this.tileList.forEach(el => {
            el.UpdateDOMSize();
            el.SetDOMPosition();
            el.UpdateDOMBackgroundSize();
            el.UpdateDOMBackgroundPosition()
            el.UpdateDOMDataset(this.size);
        })
    }

    SwapTiles(tileImage, scrambling = false, animate = false) {
        if (animate && this.animationTask != null) {
            return;
        }

        var posArray = [];
        posArray.push(tileImage.imageX, tileImage.imageY, this.currentBlank.imageX, this.currentBlank.imageY);

        if (animate) {
            this.currentBlank.SetDOMPosition(posArray[0], posArray[1]);
            tileImage.SetDOMPositionAnimate(posArray[2], posArray[3]);
        } else {
            this.currentBlank.SetDOMPosition(posArray[0], posArray[1]);
            tileImage.SetDOMPosition(posArray[2], posArray[3]);
        }

        this.currentBlank.UpdateDOMDataset(this.size);
        tileImage.UpdateDOMDataset(this.size);

        if (scrambling == false) {
            this.SetTilePriority();

            if (animate == false && this.CheckIfSolved()) {
                this.PuzzleSolved();
            }
        }
    }

    RegisterDOMClickEvent() {
        this.tileList.forEach(el => {
            el.DOMHandle.addEventListener("click", (event) => {
                if (this.solved == false) {
                    var index = this.FindTileIndexByDOMHandle(event.target);

                    var targetTile = this.tileList[index];

                    if (Math.abs(this.currentBlank.imageX - targetTile.imageX) + Math.abs(this.currentBlank.imageY - targetTile.imageY) == 1) {
                        this.SwapTiles(targetTile, false, true);
                    }
                }
            });
        });
    }

    FindTileIndexByDOMHandle(DOMHandle) {
        for (let i = 0; i < this.tileList.length; i++) {
            if (this.tileList[i].DOMHandle == DOMHandle) {
                return i;
            }
        }

        return -1;
    }

    FindAdjacentTiles(tile) {
        var output = [];

        for (let i = 0; i < this.tileList.length; i++) {
            if (Math.abs(this.tileList[i].imageX - tile.imageX) + Math.abs(this.tileList[i].imageY - tile.imageY) == 1) {
                output.push(this.tileList[i]);
            }
        }

        return output;
    }

    Scramble(iterationCount = this.size * this.size * (this.size / (this.size + 2) * 10), interval = 10) {
        if (this.nowScrambling == false) {
            this.nowScrambling = true;
        }

        iterationCount = Math.ceil(iterationCount);

        var tilesAdjacentToBlank = this.FindAdjacentTiles(this.currentBlank);

        if (this.previousScrambleImageX != null && this.previousScrambleImageY != null) {
            for (let i = 0; i < tilesAdjacentToBlank.length; i++) {
                if (tilesAdjacentToBlank[i].imageX == this.previousScrambleImageX && tilesAdjacentToBlank[i].imageY == this.previousScrambleImageY) {
                    tilesAdjacentToBlank.splice(i, 1);
                    break;
                }
            }
        }

        let tileToSwap = tilesAdjacentToBlank[Math.floor(tilesAdjacentToBlank.length * Math.random())];

        this.previousScrambleImageX = this.currentBlank.imageX;
        this.previousScrambleImageY = this.currentBlank.imageY;

        this.SwapTiles(tileToSwap, true);

        if (--iterationCount > 0) {
            setTimeout(() => {
                this.Scramble(iterationCount, interval);
            }, interval);
        } else {
            this.nowScrambling = false;
            this.SetTilePriority();
            this.counter.StartClockUpdateTask();
        }
    }

    CheckIfSolved(scrambling = false) {
        if (this.currentBlank.imageX == this.size - 1 && this.currentBlank.imageY == this.size - 1 && scrambling == false) {
            for (let i = 0; i < this.tileList.length; i++) {
                if (this.tileList[i].imageY * this.size + this.tileList[i].imageX != i && this.tileList[i].targetY * this.size + this.tileList[i].targetX != i) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    PuzzleSolved() {
        this.solved = true;
        this.counter.StopClockUpdateTask();

        this.currentBlank.DOMHandle.classList.remove("blank");

        this.ManageCounters();

        this.RemoveBorderFromTiles();

        this.cssWinOverlay.UpdateContent(this.size, this.counter.GetTimeString());
        this.cssWinOverlay.Show();

        this.counter.Flash([0, 150], 1000, 0);
    }

    ManageCounters() {
        if (this.bestTimesManager.GetBestTime(this.currentImageName, `${this.size}x${this.size}`, 0) == undefined) {
            this.bestCounter.UpdateClock(this.counter.GetTimeString());
            return;
        } else if (this.counter.GetTimeInMilis() < this.bestTimesManager.GetBestTime(this.currentImageName, `${this.size}x${this.size}`, 0).t || this.bestTimesManager.GetBestTime(this.currentImageName, `${this.size}x${this.size}`, 0).t == "") {
            this.bestCounter.UpdateClock(this.counter.GetTimeString());
        }
    }

    SaveTime(nick) {
        this.bestTimesManager.TrySetBestTime(this.currentImageName, `${this.size}x${this.size}`, nick, this.counter.GetTimeInMilis());
        this.cssWinOverlay.Hide();
        this.bestTimesManager.SaveBestTimes();
    }

    RemoveBorderFromTiles() {
        this.tileList.forEach(element => {
            element.DOMHandle.classList.add("no-border");
        });
    }

    SetTilePriority() {
        setTimeout(() => {
            for (let tile in this.tileList) {
                if ((this.tileList[tile].x == this.tileList[tile].imageX && this.tileList[tile].y == this.tileList[tile].imageY) || (this.tileList[tile].x == this.tileList[tile].targetX && this.tileList[tile].y == this.tileList[tile].targetY)) {
                    //do nothing
                } else {
                    this.tileList.forEach(element => {
                        element.DOMHandle.classList.remove("priority-one");
                    });

                    this.tileList[tile].DOMHandle.classList.add("priority-one");

                    break;
                }
            }
        }, 1);
    }
}