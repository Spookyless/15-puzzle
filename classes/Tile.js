class Tile {
    constructor(x, y, tileWidth, tileHeight, imageWidth, imageHeight, DOMHandle, puzzle) {
        this.x = x;
        this.y = y;
        this.imageX = x;
        this.imageY = y;
        this.targetX = null;
        this.targetY = null;
        this.animationTime = null;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;

        this.DOMHandle = DOMHandle;

        this.puzzle = puzzle;
    }

    UpdateDOMSize() {
        this.DOMHandle.style.width = `${this.tileWidth}px`;
        this.DOMHandle.style.height = `${this.tileHeight}px`;
        this.DOMHandle.dragable = false;
    }

    SetDOMPosition(x = this.imageX, y = this.imageY) {
        this.imageX = x;
        this.imageY = y;

        this.targetX = null;
        this.targetY = null;

        this.DOMHandle.style.top = `${this.tileHeight * this.imageY}px`;
        this.DOMHandle.style.left = `${this.tileWidth * this.imageX}px`;
    }

    SetDOMPositionAnimate(x = this.imageX, y = this.imageY, animationTime = 100) {
        if (this.puzzle.animationTask != null && this.puzzle.animationTask != undefined) {
            return;
        }

        this.targetX = x;
        this.targetY = y;
        this.animationTime = animationTime;

        let stime = Date.now();
        let etime = Date.now() + animationTime;

        function Slide(stime, etime, thiss) {
            if (Date.now() >= etime) {
                clearTimeout(thiss.puzzle.animationTask);
                thiss.puzzle.animationTask = null;

                thiss.SetDOMPosition(thiss.targetX, thiss.targetY);

                if (thiss.puzzle.CheckIfSolved()) {
                    thiss.puzzle.PuzzleSolved();
                }
            } else {
                clearTimeout(thiss.puzzle.animationTask);
                thiss.puzzle.animationTask = null;

                let animTime = etime - stime;
                let delta = (Date.now() - stime) / animTime;

                let diffX = (thiss.targetX - thiss.imageX) * thiss.tileWidth;
                let diffY = (thiss.targetY - thiss.imageY) * thiss.tileHeight;

                thiss.DOMHandle.style.top = `${diffY * delta + thiss.imageY * thiss.tileHeight}px`;
                thiss.DOMHandle.style.left = `${diffX * delta + thiss.imageX * thiss.tileWidth}px`;

                thiss.puzzle.animationTask = setTimeout(Slide, animTime / 11, stime, etime, thiss);
            }
        }

        Slide(stime, etime, this);
    }

    UpdateDOMBackgroundSize() {
        this.DOMHandle.style.backgroundSize = `${this.imageWidth}px ${this.imageHeight}px`;
    }

    UpdateDOMBackgroundPosition() {
        this.DOMHandle.style.backgroundPosition = `-${this.tileHeight * this.x}px -${this.tileHeight * this.y}px`;
    }

    UpdateDOMDataset(size) {
        this.DOMHandle.dataset.number = `${this.y * size + this.x}`;
    }
}