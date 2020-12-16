// variables {
// #region
// should be divisible by canvas width and height
var scale = 30;
var editing = false;
var dispInv = false;
var mouseX = 0;
var mouseY = 0;
var invOffI = winHei - scale * 4;
var invOffJ = 0;
var craOffI = invOffI;
var craOffJ = scale * 10 + invOffJ;
var player = new Player(1, 1);
var mapWid = 5;
var mapHei = 5;
var terrain = [];
var level = [];
var craftTable = [];
for (var i = 0; i < 3; i++) {
    craftTable.push([]);
    for (var j = 0; j < 3; j++) {
        craftTable[i].push(undefined);
    }
}
for (var i = 0; i < mapHei; i++) {
    terrain.push(new Array(mapWid));
    level.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        terrain[i][j] = new Tile("blank1");
        level[i][j] = new Block("blank1", true, false);
    }
}
// cur setting {
var curEdit = "dirt1";
var whichEdit = 0;
// } cur setting
var blockDat = {
    "wall1": {
        health: Infinity,
        pass: [[false]]
    },
    "tree1": {
        health: 10,
        pass: [[false], [false]]
    },
    "tree2": {
        health: 10,
        pass: [[false], [false]]
    },
    "tree3": {
        health: 10,
        pass: [[false, false], [false, false]]
    },
    "tree4": {
        health: 10,
        pass: [[false, false], [false, false], [false, false]]
    }
};
// #endregion
// } variables
// functions {
// #region
function dist(i1, j1, i2, j2) {
    var di = i1 - i2;
    var dj = j1 - j2;
    return Math.sqrt(di * di + dj * dj);
}
function bd(i, j) {
    return 0 <= i && i < mapHei && 0 <= j && j < mapWid;
}
function setEdit() {
    // @ts-ignore	
    curEdit = document.getElementById("curSet").value;
    // @ts-ignore	
    whichEdit = Number(document.getElementById("whichSet").value);
}
function addBlock(imageId, i, j) {
    var img = blockDat[imageId].pass;
    for (var ii = 0; ii < img.length; ii++) {
        for (var jj = 0; jj < img[0].length; jj++) {
            if (!bd(i + ii, j + jj) || level[i + ii][j + jj].imageId !== "blank1") {
                return;
            }
        }
    }
    for (var ii = 0; ii < img.length; ii++) {
        for (var jj = 0; jj < img[0].length; jj++) {
            if (ii == 0 && jj == 0) {
                level[i + ii][j + jj] = new Block(imageId, img[ii][jj], false);
            }
            else {
                level[i + ii][j + jj] = new Pointer(img[ii][jj], i, j);
            }
        }
    }
}
function fill() {
    var i = round(player.i);
    var j = round(player.j);
    var tile = new Tile(curEdit);
    if (!bd(i, j))
        return;
    var q = new list();
    q.push_back([i, j]);
    terrain[i][j] = tile;
    while (q.size !== 0) {
        var fr = q.front();
        q.pop_front();
        for (var _i = 0, drs_1 = drs; _i < drs_1.length; _i++) {
            var dr = drs_1[_i];
            var ni = fr[0] + dr[0];
            var nj = fr[1] + dr[1];
            if (bd(ni, nj) && terrain[ni][nj].imageId !== tile.imageId) {
                terrain[ni][nj] = tile;
                q.push_back([ni, nj]);
            }
        }
    }
}
function terrToJSON() {
    var res = [];
    for (var i = 0; i < mapHei; i++) {
        res.push([]);
        for (var j = 0; j < mapWid; j++) {
            res[i].push(terrain[i][j].toJSON());
        }
    }
    return res;
}
function levelToJSON() {
    var res = [];
    for (var i = 0; i < mapHei; i++) {
        res.push([]);
        for (var j = 0; j < mapWid; j++) {
            res[i].push(level[i][j].toJSON());
        }
    }
    return res;
}
function terrFromJSON(obj) {
    for (var i = 0; i < min(mapHei, obj.length); i++) {
        for (var j = 0; j < min(mapWid, obj[i].length); j++) {
            terrain[i][j].fromJSON(obj[i][j]);
        }
    }
}
function levelFromJSON(obj) {
    for (var i = 0; i < min(mapHei, obj.length); i++) {
        for (var j = 0; j < min(mapWid, obj[i].length); j++) {
            level[i][j].fromJSON(obj[i][j]);
        }
    }
}
function gameToJSON() {
    return [terrToJSON(), levelToJSON()];
}
function gameFromJSON(obj) {
    terrFromJSON(obj[0]);
    levelFromJSON(obj[1]);
}
// #endregion
// } functions
// events {
// #region
var heldDown = {
    // movements
    "A": false, "D": false, "W": false, "S": false,
    "B": false,
    "C": false
};
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e) {
    if (e.repeat)
        return;
    var ch = chr(e.keyCode);
    if (49 <= e.keyCode && e.keyCode <= 53) {
        player.hotJ = e.keyCode - 48 - 1;
    }
    if (ch == "E") {
        if (dispInv) {
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (craftTable[i][j] !== undefined) {
                        player.addItem(craftTable[i][j]);
                        craftTable[i][j] = undefined;
                    }
                }
            }
        }
        dispInv = !dispInv;
    }
    if (heldDown[ch] !== undefined) {
        heldDown[ch] = true;
    }
}
function checkUp(e) {
    var ch = chr(e.keyCode);
    if (heldDown[ch] !== undefined) {
        heldDown[ch] = false;
    }
}
var isDrag = false;
var dragX;
var dragY;
canvas.addEventListener('mousedown', function (evt) {
    var mX = evt.layerX;
    var mY = evt.layerY;
    isDrag = true;
    dragX = mX;
    dragY = mY;
}, false);
canvas.addEventListener('mouseup', function (evt) {
    var mX = evt.layerX;
    var mY = evt.layerY;
    isDrag = false;
    if (dispInv) {
        var j = floor((mX - craOffJ) / scale);
        var i = floor((mY - craOffI) / scale);
        var invJ = floor((dragX - invOffJ) / scale);
        var invI = floor((dragY - invOffI) / scale);
        if (bd(invI, invJ) && bd(i, j)) {
            craftTable[i][j] = player.inv[invI][invJ];
            player.inv[invI][invJ] = undefined;
        }
    }
}, false);
// #endregion
// } events
