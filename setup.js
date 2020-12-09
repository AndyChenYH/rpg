var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// classes {
var Tile = /** @class */ (function () {
    function Tile(imageId) {
        if (imageId === void 0) { imageId = "blank1"; }
        this.imageId = imageId;
    }
    Tile.prototype.fromJSON = function (obj) {
        this.imageId = obj.imageId;
    };
    return Tile;
}());
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(imageId, passable, isPt, ptI, ptJ) {
        if (imageId === void 0) { imageId = "blank1"; }
        if (passable === void 0) { passable = true; }
        if (isPt === void 0) { isPt = false; }
        if (ptI === void 0) { ptI = -1; }
        if (ptJ === void 0) { ptJ = -1; }
        var _this = _super.call(this, imageId) || this;
        _this.passable = passable;
        _this.isPt = isPt;
        _this.ptI = ptI;
        _this.ptJ = ptJ;
        return _this;
    }
    Block.prototype.fromJSON = function (obj) {
        _super.prototype.fromJSON.call(this, obj);
        this.passable = obj.passable;
        this.isPt = obj.isPt;
        this.ptI = obj.ptI;
        this.ptJ = obj.ptJ;
    };
    return Block;
}(Tile));
var Entity = /** @class */ (function () {
    function Entity(i, j) {
        this.i = i;
        this.j = j;
        this.faceI = 1;
        this.faceJ = 0;
    }
    return Entity;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(i, j) {
        var _this = _super.call(this, i, j) || this;
        _this.speed = 0.1;
        _this.images = ["player1", "player2", "player3", "player4"];
        return _this;
    }
    Player.prototype.move = function (di, dj) {
        var ni = this.i + di * this.speed;
        var nj = this.j + dj * this.speed;
        if (bd(round(ni), round(nj)) && (editing || level[round(ni)][round(nj)].passable)) {
            this.i = ni;
            this.j = nj;
        }
        this.i = max(0, min(mapHei, this.i));
        this.j = max(0, min(mapWid, this.j));
        this.i = round(this.i * 1e5) / 1e5;
        this.j = round(this.j * 1e5) / 1e5;
    };
    Player.prototype.paint = function () {
        var image;
        if (this.faceI === 1)
            image = this.images[0];
        else if (this.faceJ === -1)
            image = this.images[1];
        else if (this.faceJ === 1)
            image = this.images[2];
        else if (this.faceI === -1)
            image = this.images[3];
        drawImage(image, winWid / 2, winHei / 2, scale, scale);
    };
    return Player;
}(Entity));
// } classes
// variables {
// should be divisible by canvas width and height
var scale = 30;
var editing = false;
var player = new Player(1, 1);
var mapWid = 20;
var mapHei = 20;
var terrain = [];
var level = [];
for (var i = 0; i < mapHei; i++) {
    terrain.push(new Array(mapWid));
    level.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        terrain[i][j] = new Tile();
        level[i][j] = new Block();
    }
}
// cur setting {
var cur = "dirt1";
var which = 0;
// } cur setting
var blockDat = {
    "wall1": [[false]],
    "table1": [[false]],
    "barrel1": [[false], [false]],
    "tree1": [[false], [false]],
    "tree2": [[false], [false]],
    "tree3": [[false, false], [false, false]],
    "tree4": [[false, false], [false, false], [false, false]],
    "fireplace1": [[false]],
    "box1": [[false]],
    "clock1": [[false], [false]]
};
// } variables
// functions {
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
    cur = document.getElementById("curSet").value;
    // @ts-ignore	
    which = Number(document.getElementById("whichSet").value);
}
function addBlock(imageId, i, j) {
    var img = blockDat[imageId];
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
                level[i + ii][j + jj] = new Block(imageId, img[ii][jj]);
            }
            else {
                level[i + ii][j + jj] = new Block(imageId, img[ii][jj], true, i, j);
            }
        }
    }
}
function fill() {
    var i = round(player.i);
    var j = round(player.j);
    var tile = new Tile(cur);
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
    return [JSON.parse(JSON.stringify(terrain)), JSON.parse(JSON.stringify(level))];
}
function gameFromJSON(obj) {
    terrFromJSON(obj[0]);
    levelFromJSON(obj[1]);
}
// } functions
// events {
var heldDown = {
    // movements
    "A": false,
    "D": false,
    "W": false,
    "S": false,
    "B": false,
    "C": false,
    // facings
    "J": false,
    "L": false,
    "I": false,
    "K": false
};
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e) {
    if (e.repeat)
        return;
    var ch = String.fromCharCode(e.keyCode);
    if (heldDown[ch] !== undefined) {
        heldDown[ch] = true;
    }
}
function checkUp(e) {
    var ch = String.fromCharCode(e.keyCode);
    if (heldDown[ch] !== undefined) {
        heldDown[ch] = false;
    }
}
/*
canvas.addEventListener('mousedown', function (evt: any) {
    console.log(evt.layerX, evt.layerY);
}, false);
*/
// } events
