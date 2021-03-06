var loaded: boolean = false;
let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas idk");
let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
let winWid: number = canvas.width;
let winHei: number = canvas.height;

const drs: number[][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const round = (x: number) => Math.round(x);
const floor = (x: number) => Math.floor(x);
const max = (a: number, b: number) => Math.max(a, b);
const min = (a: number, b: number) => Math.min(a, b);
const ceil = (x: number) => Math.ceil(x);

function drawCircle(x: number, y: number, r: number, color: string) : void {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawLine(x: number, y: number, x1: number, y1: number, wid: number = 1) : void {
	ctx.lineWidth = wid;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

function drawRect(x: number, y: number, wid: number, hei: number, color: string) : void {
	ctx.beginPath();
	ctx.rect(x, y, wid, hei);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
}

function componentToHex(c: number) : string{
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) : string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rd(low: number, high: number) : number {
		low = Math.ceil(low);
		high = Math.floor(high);
		return Math.floor(Math.random() * (high - low + 1)) + low;
}

function drawImage(id: string, x: number, y: number, width: number, height: number) : void {
	if (loaded) {
		var img: any = document.getElementById(id);
		ctx.drawImage(img, x, y, width, height);
	}
}
function drawImageSmaller(id: string, x: number, y: number, width: number, height: number) : void { 
	drawImage(id, x + scale / 10, y + scale / 10, width - scale / 5, height - scale / 5);
}
canvas.addEventListener("mousemove", function (evt: any) {
	mouseX = evt.layerX;
	mouseY = evt.layerY;
}, false);
function assert(condition: boolean) : void {
    if (!condition) {
		throw "Assertion failed";
    }
}
function ord(ch: string) : number {
	return ch.charCodeAt(0);
}
function chr(n: number) : string {
	return String.fromCharCode(n);
}
