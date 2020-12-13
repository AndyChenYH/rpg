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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// classes {
var Tile = /** @class */ (function () {
    function Tile(imageId) {
        this.imageId = imageId;
    }
    Tile.prototype.toJSON = function () {
        return { imageId: this.imageId };
    };
    Tile.prototype.fromJSON = function (obj) {
        this.imageId = obj.imageId;
    };
    return Tile;
}());
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(imageId, passable, isPt) {
        var _this = _super.call(this, imageId) || this;
        _this.passable = passable;
        _this.isPt = isPt;
        return _this;
    }
    Block.prototype.toJSON = function () {
        var res = _super.prototype.toJSON.call(this);
        res.passable = this.passable;
        res.isPt = this.isPt;
    };
    Block.prototype.fromJSON = function (obj) {
        _super.prototype.fromJSON.call(this, obj);
        this.passable = obj.passable;
        this.isPt = obj.isPt;
    };
    return Block;
}(Tile));
var Pointer = /** @class */ (function (_super) {
    __extends(Pointer, _super);
    function Pointer(passable, ptI, ptJ) {
        var _this = _super.call(this, "", passable, true) || this;
        _this.ptI = ptI;
        _this.ptJ = ptJ;
        return _this;
    }
    Pointer.prototype.toJSON = function () {
        return {
            passable: this.passable,
            ptI: this.ptI,
            ptJ: this.ptJ
        };
    };
    Pointer.prototype.fromJSON = function (obj) {
        this.passable = obj.passable,
            this.ptI = obj.ptI;
        this.ptJ = obj.ptJ;
    };
    return Pointer;
}(Block));
var Item = /** @class */ (function () {
    function Item(imageId) {
        this.imageId = imageId;
    }
    return Item;
}());
var Tool = /** @class */ (function (_super) {
    __extends(Tool, _super);
    function Tool(imageId, damage) {
        var _this = _super.call(this, imageId) || this;
        _this.damage = damage;
        return _this;
    }
    return Tool;
}(Item));
var Axe = /** @class */ (function (_super) {
    __extends(Axe, _super);
    function Axe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Axe;
}(Tool));
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
        _this.inv = __spreadArrays(Array(4)).map(function (e) { return Array(9); });
        _this.invI = 3;
        _this.invJ = 0;
        return _this;
    }
    Player.prototype.move = function (di, dj) {
        this.faceI = di;
        this.faceJ = dj;
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
var craOffJ = invOffJ;
var player = new Player(1, 1);
var mapWid = 20;
var mapHei = 20;
var terrain = [];
var level = [];
for (var i = 0; i < mapHei; i++) {
    terrain.push(new Array(mapWid));
    level.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        terrain[i][j] = new Tile("blank1");
        level[i][j] = new Block("blank1", true, false);
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
            terrain[i][j] = new Tile(undefined);
            terrain[i][j].fromJSON(obj[i][j]);
        }
    }
}
function levelFromJSON(obj) {
    for (var i = 0; i < min(mapHei, obj.length); i++) {
        for (var j = 0; j < min(mapWid, obj[i].length); j++) {
            if (obj[i][j].isPt) {
                level[i][j] = new Pointer(undefined, undefined, undefined);
            }
            else {
                level[i][j] = new Block(undefined, undefined, undefined);
            }
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
    if (ch == "E") {
        dispInv = !dispInv;
    }
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
    if (dispInv) {
        isDrag = true;
        dragX = mX;
        dragY = mY;
    }
}, false);
canvas.addEventListener('mouseup', function (evt) {
    var mX = evt.layerX;
    var mY = evt.layerY;
}, false);
// #endregion
// } events
