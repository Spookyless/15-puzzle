class Slider {
    constructor(DOMHandle, displayWidth, displayHeight) {
        this.DOMHandle = DOMHandle;

        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;

        this.commonPath = null;
        this.imageArray = [];

        this.selectedIndex = 0;

        this.animationTime = 500;
        this.animationTask = null;

        this.DOMHandle.style.height = `${displayHeight}px`;
    }

    SetCommonPath(commonPath) {
        this.commonPath = commonPath;
    }

    RegisterNewImage(name, path, redraw = false) {
        name = name.toLowerCase();

        for (let i = 0; i < 0; i++) {
            if (this.imageArray[i].name == name || this.imageArray[i].path == path) {
                return;
            }
        }

        if (this.imageArray.length == 0) {
            for (let i = 0; i < 2; i++) {
                this.imageArray.push(new Image(name, path));
            }
        } else {
            this.imageArray.splice(this.imageArray.length - 1, 0, new Image(name, path));
        }

        if (redraw) {
            this.DrawImages();
        }
    }

    DrawImages() {
        this.DOMHandle.innerHTML = "";

        this.imageArray.forEach(element => {
            let a = document.createElement("img");

            a.style.width = `${this.displayWidth}px`;
            a.style.height = `${this.displayHeight}px`;

            a.classList.add("slider-image");

            a.src = this.commonPath + element.path;

            this.DOMHandle.appendChild(a);
        });

        this.DOMHandle.style.width = `${this.imageArray.length * this.displayWidth}px`;
    }

    Swipe(dir = 0) {
        if (this.animationTask != null) {
            return;
        }

        if (dir == 0 || (dir != 1 && dir != -1)) {
            return;
        }

        let destX = null;
        let curX = this.selectedIndex * this.displayWidth;

        this.selectedIndex += dir;

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.imageArray.length - 2;
            this.DOMHandle.style.left = `-${(this.imageArray.length - 1) * this.displayWidth}px`;
            curX = (this.imageArray.length - 1) * this.displayWidth;
        } else if (this.selectedIndex > this.imageArray.length - 1) {
            this.selectedIndex = 1;
            this.DOMHandle.style.left = `0px`;
            curX = 0;
        }

        destX = this.selectedIndex * this.displayWidth;

        this.StartSwipeAnimation(curX, destX, this.animationTime);
    }

    StartSwipeAnimation(startX, endX, dur) {
        let startTime = Date.now();
        let endTime = startTime + dur;

        this.animationTask = setInterval((sx, ex, st, et) => {
            let nt = Date.now();

            if (nt >= et) {
                this.DOMHandle.style.left = `-${ex}px`;
                clearInterval(this.animationTask);
                this.animationTask = null;
            } else {
                let t = (nt - st) / (et - st);
                this.DOMHandle.style.left = `-${sx + Math.sin((Math.PI / 2) * Math.pow(t, 0.55)) * (ex - sx)}px`;
            }
        }, 5, startX, endX, startTime, endTime);
    }

    GetPathToImage(index = this.selectedIndex) {
        return this.commonPath + this.imageArray[index].path;
    }

    GetName(index = this.selectedIndex) {
        return this.imageArray[index].name;
    }

    GetAllNames() {
        let out = [];

        this.imageArray.forEach(element => {
            out.push(element.name);
        });

        return out;
    }
}