class CookieUtility {
    static GetCookies() {
        if (document.cookie.length > 0 && document.cookie != "") {
            var c = document.cookie.split(";");

            var co = {};

            c.forEach(element => {
                let t = element.split("=");

                if (t[1].includes("[BASE64-FORMAT]")) {
                    co[t[0].trim()] = atob(t[1].substring(15)).trim();
                } else {
                    co[t[0].trim()] = t[1].trim();
                }
            });

            return co;
        }

        return undefined;
    }

    static SetCookie(key, value, expiry = "Fri, 01 Jan 2077 00:00:00 GMT", path = "/") {
        document.cookie = `${key}=${value}; expires=${expiry}; path=${path};`;
    }

    static SetCookieFromObject(key, object, expiry = "Fri, 01 Jan 2077 00:00:00 GMT", path = "/") {
        var k = Object.keys(object);

        k.forEach(element => {
            var objectJson = JSON.stringify(object[element]);
            var objectJson64 = btoa(objectJson);

            document.cookie = `${puzzleObject.bestTimesManager.bestTimesCookieString + element}=[BASE64-FORMAT]${objectJson64}; expires=${expiry}; path=${path};`;
        });
    }
}