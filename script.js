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
var Tile = /** @class */ (function () {
    function Tile(imageId) {
        this.imageId = imageId;
    }
    return Tile;
}());
var Entity = /** @class */ (function () {
    function Entity(i, j) {
        this.i = i;
        this.j = j;
        this.microI = this.microJ = 0;
    }
    return Entity;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Player;
}(Entity));
var scale = 20;
var p = new Player(10, 10);
var mapWid = 500;
var mapHei = 500;
var terrain = [];
for (var i = 0; i < mapHei; i++) {
    terrain.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        terrain[i][j] = new Tile("dirt1");
    }
}
var bd = function (i, j) { return 0 <= i && i < mapHei && 0 <= j && j < mapWid; };
var heldDown = [];
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e) {
    if (e.repeat)
        return;
    var ch = String.fromCharCode(e.keyCode);
    heldDown.push(ch);
}
function checkUp(e) {
    for (var i = 0; i < heldDown.length; i++) {
        var ch = String.fromCharCode(e.keyCode);
        if (heldDown[i] == ch) {
            heldDown.splice(i, 1);
            i--;
        }
    }
}
function gameLoop() {
    ctx.clearRect(0, 0, winWid, winHei);
    drawImage("dirt1", 20, 20, scale, scale);
    for (var _i = 0, heldDown_1 = heldDown; _i < heldDown_1.length; _i++) {
        var k = heldDown_1[_i];
        if (k == "A")
            p.j -= 0.1;
        else if (k == "D")
            p.j += 0.1;
        else if (k == "W")
            p.i -= 0.1;
        else if (k == "S")
            p.i += 0.1;
    }
    // debug {
    // if (bd(p.i, p.j)) {
    // 	terrain[round(p.i)][round(p.j)].color = "#000000";
    // }
    var wide = round(winWid / scale);
    var long = round(winHei / scale);
    var halfW = round(wide / 2);
    var halfL = round(long / 2);
    for (var i = -1; i < long + 1; i++) {
        for (var j = -1; j < wide + 1; j++) {
            var ni = round(p.i) - halfL + i;
            var nj = round(p.j) - halfW + j;
            if (bd(ni, nj)) {
                var bitI = p.i - round(p.i);
                var bitJ = p.j - round(p.j);
                // drawRect((j - bitJ) * scale, (i - bitI) * scale, scale, scale, terrain[ni][nj].color);
                drawImage(terrain[ni][nj].imageId, (j - bitJ) * scale, (i - bitI) * scale, scale, scale);
            }
        }
    }
    drawCircle(winWid / 2 + scale, winHei / 2 + scale, scale / 2, "#0000FF");
    requestAnimationFrame(gameLoop);
}
gameLoop();
function debug() {
    console.log(JSON.stringify(p));
}
