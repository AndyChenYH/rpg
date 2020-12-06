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
var Entity = /** @class */ (function () {
    function Entity(i, j) {
        this.i = i;
        this.j = j;
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
// } classes
// variables {
var scale = 20;
var edit = false;
var player = new Player(10, 10);
var mapWid = 20;
var mapHei = 20;
var terrain = [];
for (var i = 0; i < mapHei; i++) {
    terrain.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        terrain[i][j] = new Tile("dirt1");
    }
}
// } variables
// functions {
var bd = function (i, j) { return 0 <= i && i < mapHei && 0 <= j && j < mapWid; };
// } functions
// events {
//var heldDown: string[] = [];
var heldDown = {
    "A": false,
    "D": false,
    "W": false,
    "S": false
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
canvas.addEventListener('mousedown', function (evt) {
    console.log(evt.layerX, evt.layerY);
}, false);
// } events
function gameLoop() {
    ctx.clearRect(0, 0, winWid, winHei);
    if (heldDown["A"])
        player.j -= 0.1;
    if (heldDown["D"])
        player.j += 0.1;
    if (heldDown["W"])
        player.i -= 0.1;
    if (heldDown["S"])
        player.i += 0.1;
    if (bd(player.i, player.j)) {
        terrain[round(player.i)][round(player.j)].imageId = "wood1";
    }
    var wide = round(winWid / scale);
    var long = round(winHei / scale);
    var halfW = round(wide / 2);
    var halfL = round(long / 2);
    for (var i = -1; i < long + 1; i++) {
        for (var j = -1; j < wide + 1; j++) {
            var ni = round(player.i) - halfL + i;
            var nj = round(player.j) - halfW + j;
            if (bd(ni, nj)) {
                var bitI = player.i - round(player.i);
                var bitJ = player.j - round(player.j);
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
    console.log(JSON.stringify(player));
}
