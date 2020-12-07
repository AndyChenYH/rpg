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
        this.imageId = imageId;
    }
    return Tile;
}());
var Block = /** @class */ (function () {
    /*
    if you are adding instance fields, make sure to change:
    constructor parameter
    constructor initialization
    fromJSON
    */
    function Block(imageId, passable) {
        if (imageId === void 0) { imageId = ""; }
        if (passable === void 0) { passable = true; }
        this.imageId = imageId;
        this.passable = passable;
    }
    Block.prototype.fromJSON = function (obj) {
        this.imageId = obj.imageId;
        this.passable = obj.passable;
    };
    return Block;
}());
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
        this.faceI = di;
        this.faceJ = dj;
        var ni = this.i + di * this.speed;
        var nj = this.j + dj * this.speed;
        if (bd(round(ni), round(nj)) && level[round(ni)][round(nj)].passable) {
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
var edit = false;
var player = new Player(1, 1);
var mapWid = 5;
var mapHei = 5;
var terrain = [];
var level = [];
for (var i = 0; i < mapHei; i++) {
    terrain.push(new Array(mapWid));
    level.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        terrain[i][j] = new Tile("dirt1");
        level[i][j] = rd(0, 10) == 0 ? new Block("grass2", false) : new Block("blank1", true);
    }
}
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
function fill(i, j, tile) {
    if (!bd(i, j))
        return;
    var q = new list();
    q.push_back([i, j]);
    terrain[i][j] = tile;
    while (q.size != 0) {
        var fr = q.front();
        q.pop_front();
        for (var _i = 0, drs_1 = drs; _i < drs_1.length; _i++) {
            var dr = drs_1[_i];
            var ni = fr[0] + dr[0];
            var nj = fr[1] + dr[1];
            if (bd(ni, nj) && terrain[ni][nj].imageId != tile.imageId) {
                terrain[ni][nj] = tile;
                q.push_back([ni, nj]);
            }
        }
    }
}
function terrToString() {
    var res = "";
    for (var i = 0; i < mapHei; i++) {
        for (var j = 0; j < mapWid; j++) {
            res += terrain[i][j].imageId;
            if (j != mapWid - 1)
                res += " ";
        }
        if (i != mapHei - 1) {
            res += "/";
        }
    }
    return res;
}
function terrFromString(raw) {
    var rows = raw.split("/");
    for (var i = 0; i < min(mapHei, rows.length); i++) {
        var tiles = rows[i].split(" ");
        for (var j = 0; j < min(mapWid, tiles.length); j++) {
            terrain[i][j].imageId = tiles[j];
        }
    }
}
function levelFromJSON(obj) {
    console.log(obj);
    for (var i = 0; i < min(mapHei, obj.length); i++) {
        for (var j = 0; j < min(mapWid, obj[i].length); j++) {
            level[i][j] = new Block();
            level[i][j].fromJSON(obj[i][j]);
        }
    }
}
// } functions
// events {
var heldDown = {
    "A": false,
    "D": false,
    "W": false,
    "S": false,
    "B": false,
    "F": false,
    "O": false
};
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e) {
    if (e.repeat)
        return;
    var ch = String.fromCharCode(e.keyCode);
    if (heldDown[ch] != undefined) {
        heldDown[ch] = true;
    }
}
function checkUp(e) {
    var ch = String.fromCharCode(e.keyCode);
    if (heldDown[ch] != undefined) {
        heldDown[ch] = false;
    }
}
/*
canvas.addEventListener('mousedown', function (evt: any) {
    console.log(evt.layerX, evt.layerY);
}, false);
*/
// } events
