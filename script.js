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
var heldDown = [];
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e) {
    if (e.repeat)
        return;
    heldDown.push(String.fromCharCode(e.keyCode));
}
function checkUp(e) {
    for (var i = 0; i < heldDown.length; i++) {
        if (heldDown[i] == String.fromCharCode(e.keyCode)) {
            heldDown.splice(i, 1);
            i--;
        }
    }
}
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
// setup {
var scale = 20;
var p = new Player(0, 0);
var mapWid = 500;
var mapHei = 500;
var map = [];
for (var i = 0; i < mapHei; i++) {
    map.push(new Array(mapWid));
    for (var j = 0; j < mapWid; j++) {
        map[i][j] = rgbToHex(rd(0, 255), rd(0, 255), rd(0, 255));
        ;
    }
}
// } setup
console.log(map);
function gameLoop() {
    ctx.clearRect(0, 0, winWid, winHei);
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
    var bd = function (i, j) { return 0 <= i && i < mapHei && 0 <= j && j < mapWid; };
    var wide = Math.floor(winWid / scale);
    var long = Math.floor(winHei / scale);
    for (var i = 0; i < long; i++) {
        for (var j = 0; j < wide; j++) {
            var ni = Math.floor(p.i + i);
            var nj = Math.floor(p.j + j);
            if (bd(ni, nj)) {
                var bitI = p.i - Math.floor(p.i);
                var bitJ = p.j - Math.floor(p.j);
                drawRect((j - bitJ) * scale, (i - bitI) * scale, scale, scale, map[ni][nj]);
            }
        }
    }
    var half = Math.floor(winHei / scale / 2);
    drawCircle(20, 20, scale / 2, "#0000FF");
    requestAnimationFrame(gameLoop);
}
gameLoop();
