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
// setup {
var scale = 20;
var p = new Player(10, 10);
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
var bd = function (i, j) { return 0 <= i && i < mapHei && 0 <= j && j < mapWid; };
function gameLoop() {
    ctx.clearRect(0, 0, winWid, winHei);
    for (var _i = 0, heldDown_1 = heldDown; _i < heldDown_1.length; _i++) {
        var k = heldDown_1[_i];
        if (k == "A")
            p.microJ -= 0.1;
        else if (k == "D")
            p.microJ += 0.1;
        else if (k == "W")
            p.microI -= 0.1;
        else if (k == "S")
            p.microI += 0.1;
    }
    if (p.microI >= 1) {
        p.i++;
        p.microI = 0;
    }
    if (p.microI <= -1) {
        p.i--;
        p.microI = 0;
    }
    if (p.microJ >= 1) {
        p.j++;
        p.microJ = 0;
    }
    if (p.microJ <= -1) {
        p.j--;
        p.microJ = 0;
    }
    // debug {
    if (bd(p.i, p.j)) {
        map[p.i][p.j] = "#000000";
    }
    // } debug
    var wide = Math.round(winWid / scale);
    var long = Math.round(winHei / scale);
    var halfW = Math.round(wide / 2);
    var halfL = Math.round(long / 2);
    for (var i = -1; i < long + 1; i++) {
        for (var j = -1; j < wide + 1; j++) {
            var ni = p.i - halfL + i;
            var nj = p.j - halfW + j;
            if (bd(ni, nj)) {
                drawRect((j - p.microJ) * scale, (i - p.microI) * scale, scale, scale, map[ni][nj]);
            }
        }
    }
    drawCircle(winWid / 2 + scale, winHei / 2 + scale, scale / 2, "#0000FF");
    requestAnimationFrame(gameLoop);
}
gameLoop();
function debug() {
    console.log(p.i, p.j, p.microI, p.microJ);
}
