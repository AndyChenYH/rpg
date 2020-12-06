class Tile {
	imageId: string;
	constructor(imageId: string) {
		this.imageId = imageId;
	}
}
class Entity {
	i: number;
	j: number;
	microI: number;
	microJ: number;
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
		this.microI = this.microJ = 0;
	}
}
class Player extends Entity {
}

const scale: number = 20;

var p: Player = new Player(10, 10);
const mapWid: number = 500;
const mapHei: number = 500;
var terrain: Tile[][] = [];
for (var i = 0; i < mapHei; i ++) {
	terrain.push(new Array(mapWid));
	for (var j = 0; j < mapWid; j ++) {
		terrain[i][j] = new Tile("dirt1");
	}
}
const bd = (i: number, j: number) => 0 <= i && i < mapHei && 0 <= j && j < mapWid;

var heldDown: string[] = [];
window.addEventListener("keydown",this.checkDown,false);
window.addEventListener("keyup",this.checkUp,false);

function checkDown(e: KeyboardEvent) : void {
	if (e.repeat) return;
	var ch: string = String.fromCharCode(e.keyCode);
	heldDown.push(ch);
}

function checkUp(e: KeyboardEvent) : void {
	for (var i = 0; i < heldDown.length; i ++) {
		var ch: string = String.fromCharCode(e.keyCode);
		if (heldDown[i] == ch) {
			heldDown.splice(i, 1);
			i --;
		}
	}
}


function gameLoop() : void {
	ctx.clearRect(0, 0, winWid, winHei);
	drawImage("dirt1", 20, 20, scale, scale);
	for (var k of heldDown) {
		if (k == "A") p.j -= 0.1;
		else if (k == "D") p.j += 0.1;
		else if (k == "W") p.i -= 0.1;
		else if (k == "S") p.i += 0.1;
	}
	// debug {
	// if (bd(p.i, p.j)) {
	// 	terrain[round(p.i)][round(p.j)].color = "#000000";
	// }
	
	const wide: number = round(winWid / scale);
	const long: number = round(winHei / scale);
	const halfW: number = round(wide / 2);
	const halfL: number = round(long / 2);
	for (var i = -1; i < long + 1; i ++) {
		for (var j = -1; j < wide + 1; j ++) {
			const ni: number = round(p.i) - halfL + i;
			const nj: number = round(p.j) - halfW + j;
			if (bd(ni, nj)) {
				const bitI: number = p.i - round(p.i);
				const bitJ: number = p.j - round(p.j);
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