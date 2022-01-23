class Sort {
    static bestTimeSort = (a, b) => {
        if (a.t == "") {
            return 1;
        } else if (b.t == "") {
            return -1;
        } else if (a.t != b.t) {
            return a.t - b.t;
        } else {
            return a.n > b.n ? 1 : -1;
        }
    }
}