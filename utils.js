var canvas = document.getElementById("canvas idk");
var ctx = canvas.getContext('2d');
var winWid = canvas.width;
var winHei = canvas.height;
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
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rd(low, high) {
    return Math.floor(Math.random() * high) + low;
}
