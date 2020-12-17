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
    Block.prototype.setPt = function (ptI, ptJ) {
        assert(this.isPt);
        this.ptI = ptI;
        this.ptJ = ptJ;
    };
    Block.prototype.orig = function () {
        assert(this.isPt);
        return level[this.ptI][this.ptJ];
    };
    Block.prototype.toJSON = function () {
        var res = _super.prototype.toJSON.call(this);
        res.passable = this.passable;
        res.isPt = this.isPt;
        if (this.isPt) {
            res.ptI = this.ptI;
            res.ptJ = this.ptJ;
        }
        return res;
    };
    Block.prototype.fromJSON = function (obj) {
        _super.prototype.fromJSON.call(this, obj);
        this.passable = obj.passable;
        this.isPt = obj.isPt;
        if (obj.isPt) {
            this.ptI = obj.ptI;
            this.ptJ = obj.ptJ;
        }
    };
    return Block;
}(Tile));
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
        _this.hotJ = 0;
        return _this;
    }
    Player.prototype.act = function () {
        var ni = round(this.i) + this.faceI;
        var nj = round(this.j) + this.faceJ;
        if (bd(ni, nj)) {
            var bl;
            if (level[ni][nj].isPt)
                bl = level[ni][nj].orig();
            if (bl.imageId.substring(0, 4) === "tree") {
            }
        }
    };
    Player.prototype.addItem = function (it) {
        for (var i = 3; 0 <= i; i--) {
            for (var j = 0; j < 9; j++) {
                if (this.inv[i][j] === undefined) {
                    this.inv[i][j] = it;
                    return;
                }
            }
        }
    };
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
