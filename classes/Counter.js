class Counter {
    constructor(DOMHandle, title, visible, timeString = "00:00:00.000") {
        this.path = {
            main: "./media/cyferki+/",
            "0": "c0.png",
            "1": "c1.png",
            "2": "c2.png",
            "3": "c3.png",
            "4": "c4.png",
            "5": "c5.png",
            "6": "c6.png",
            "7": "c7.png",
            "8": "c8.png",
            "9": "c9.png",
            "colon": "colon.png",
            "dot": "dot.png",
            "null": "null.png"
        };

        this.DOMHandle = DOMHandle;
        this.visible = visible;
        this.title = title;

        this.start = null;
        this.currentTime = null;

        this.clockUpdateTask = null;
        this.clockUpdateDelay = 1000 / 60;

        this.flashTask = null;

        this.UpdateClock(timeString);
        this.DOMUpdateTitle();
        this.DOMChangeState();
    }

    ParseCharacter(char) {
        if (char == ":") { return this.path["colon"]; }
        else if (char == ".") { return this.path["dot"]; }
        else if (char == "-") { return this.path["null"]; }
        else { return this.path[char]; }
    }

    UpdateClock(timeString = "00:00:00.000") {
        this.DOMHandle.children[1].innerHTML = "";

        for (let i = 0; i < timeString.length; i++) {
            var clockElement = document.createElement("img");
            clockElement.src = this.path.main + this.ParseCharacter(timeString[i]);

            this.DOMHandle.children[1].appendChild(clockElement);
        }
    }

    DOMChangeState(visible = this.visible) {
        var display = "none";

        if (visible) { display = "block"; }

        this.DOMHandle.style.display = display;
    }

    DOMUpdateTitle(title = this.title) {
        this.DOMHandle.children[0].innerHTML = title;
    }

    Start(timeInMilis = new Date().getTime()) {
        this.start = timeInMilis;
        this.currentTime = timeInMilis;
    }

    Tick(timeInMilis = new Date().getTime()) {
        this.currentTime = timeInMilis;
    }

    GetTimeInMilis() {
        return this.currentTime - this.start;
    }

    GetTimeString(value = this.GetTimeInMilis()) {
        if (value == null || value == undefined || value == "" || typeof (value) != "number") {
            return '--:--:--.---';
        }

        var output = "";

        var hours = Math.floor(value / (1000 * 60 * 60));
        value -= hours * 1000 * 60 * 60;

        var minutes = Math.floor(value / (1000 * 60));
        value -= minutes * 1000 * 60;

        var seconds = Math.floor(value / 1000);
        value -= seconds * 1000;

        var milis = value;

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        if (milis < 10) { milis = "00" + milis; }
        else if (milis < 100) { milis = "0" + milis; }

        output = `${hours}:${minutes}:${seconds}.${milis}`;

        return output;
    }

    StartClockUpdateTask() {
        this.Start();

        this.clockUpdateTask = setInterval(() => {
            this.Tick();
            this.UpdateClock(this.GetTimeString());
        }, this.clockUpdateDelay);
    }

    StopClockUpdateTask() {
        clearInterval(this.clockUpdateTask);

        this.clockUpdateTask = null;
    }

    Reset() {
        this.StopClockUpdateTask();

        this.UpdateClock();

        this.StopFlash();
        this.HueShift(0);

        this.start = null;
        this.currentTime = null;
    }

    // normal
    // Flash(hueShift = [0], delay = 1000, iterator = 0) {
    //     this.flashTask = setTimeout((h, d, i) => {
    //         if (i >= h.length) { i = 0; }

    //         this.HueShift(h[i]);

    //         this.Flash(h, d, i);
    //     }, delay, hueShift, delay, iterator + 1);
    // }

    //gay mode on 
    Flash(hueShift, delay, iterator) {
        this.flashTask = setTimeout((h, d, i) => {
            this.HueShift(i);
            this.Flash(h, d, i);
        }, delay - 990, hueShift, delay - 990, iterator + 1);
    }

    StopFlash() {
        clearTimeout(this.flashTask);

        this.flashTask = null;
    }

    HueShift(shift) {
        this.DOMHandle.children[1].style.filter = `hue-rotate(${shift}deg)`;
    }
}