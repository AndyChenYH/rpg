let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas idk");
let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
let winWid: number = canvas.width;
let winHei: number = canvas.height;

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
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) : string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rd(low: number, high: number) : number {
	return Math.floor(Math.random() * high) + low;  
}