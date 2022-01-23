class BestTimes {
    constructor(puzzleObject) {
        this.puzzleObject = puzzleObject;

        this.bestTimesLimit = 10;

        this.bestTimes = {};
        this.puzzleNames = puzzleObject.slider.GetAllNames();

        this.puzzleNames.forEach(element => {
            this.bestTimes[element] = {
                "3x3": [],
                "4x4": [],
                "5x5": [],
                "6x6": []
            }
        });

        this.bestTimesCookieString = "fk-cas-best-times-";

        this.LoadBestTimes();
    }

    TrySetBestTime(image, time, nick, value) {
        let toReturn = false;

        if (this.bestTimes[image][time].length < 10) {
            this.bestTimes[image][time].push(new Record(nick, value));
            toReturn = true;
        } else if (this.bestTimes[image][time][this.bestTimesLimit - 1].t > value) {
            this.bestTimes[image][time][this.bestTimesLimit - 1].n = nick;
            this.bestTimes[image][time][this.bestTimesLimit - 1].t = value;
            toReturn = true;
        }

        this.bestTimes[image][time].sort(Sort.bestTimeSort);

        return toReturn;
    }

    GetBestTime(image, time, index = null) {
        if (index != null) {
            return this.bestTimes[image][time][index];
        } else {
            return this.bestTimes[image][time];
        }

    }

    SaveBestTimes() {
        CookieUtility.SetCookieFromObject(this.bestTimesCookieString, this.bestTimes);
    }

    LoadBestTimes() {
        var r = CookieUtility.GetCookies();

        if (r) {
            var k = Object.keys(r);

            k.forEach(element => {
                if (element.includes(this.bestTimesCookieString)) {
                    var a = element.replace(this.bestTimesCookieString, "");
                    this.bestTimes[a] = JSON.parse(r[element]);
                }
            });
        }
    }
}