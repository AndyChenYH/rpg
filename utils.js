var loaded = false;
var canvas = document.getElementById("canvas idk");
var ctx = canvas.getContext('2d');
var winWid = canvas.width;
var winHei = canvas.height;
var drs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
var round = function (x) { return Math.round(x); };
var floor = function (x) { return Math.floor(x); };
var max = function (a, b) { return Math.max(a, b); };
var min = function (a, b) { return Math.min(a, b); };
var ceil = function (x) { return Math.ceil(x); };
function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}
function drawLine(x, y, x1, y1, wid) {
    if (wid === void 0) { wid = 1; }
    ctx.lineWidth = wid;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}
function drawRect(x, y, wid, hei, color) {
    ctx.beginPath();
    ctx.rect(x, y, wid, hei);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rd(low, high) {
    low = Math.ceil(low);
    high = Math.floor(high);
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
function drawImage(id, x, y, width, height) {
    if (loaded) {
        var img = document.getElementById(id);
        ctx.drawImage(img, x, y, width, height);
    }
}
function drawImageSmaller(id, x, y, width, height) {
    drawImage(id, x + scale / 10, y + scale / 10, width - scale / 5, height - scale / 5);
}
canvas.addEventListener("mousemove", function (evt) {
    mouseX = evt.layerX;
    mouseY = evt.layerY;
}, false);
function assert(condition) {
    if (!condition) {
        throw "Assertion failed";
    }
}
function ord(ch) {
    return ch.charCodeAt(0);
}
function chr(n) {
    return String.fromCharCode(n);
}
