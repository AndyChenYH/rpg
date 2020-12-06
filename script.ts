// classes {
class Tile {
	imageId: string;
	constructor(imageId: string) {
		this.imageId = imageId;
	}
}
class Entity {
	i: number;
	j: number;
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
	}
}
class Player extends Entity {
}
// } classes

// variables {
const scale: number = 20;

var edit: boolean = false;
var player: Player = new Player(10, 10);
const mapWid: number = 20;
const mapHei: number = 20;
var terrain: Tile[][] = [];
for (var i = 0; i < mapHei; i ++) {
	terrain.push(new Array(mapWid));
	for (var j = 0; j < mapWid; j ++) {
		terrain[i][j] = new Tile("dirt1");
	}
}
// } variables

// functions {
const bd = (i: number, j: number) => 0 <= i && i < mapHei && 0 <= j && j < mapWid;
// } functions

// events {
//var heldDown: string[] = [];
var heldDown: {"A": boolean, "D": boolean, "W": boolean, "S": boolean} = {
	"A": false,
	"D": false,
	"W": false,
	"S": false,
};
window.addEventListener("keydown",this.checkDown,false);
window.addEventListener("keyup",this.checkUp,false);
function checkDown(e: KeyboardEvent) : void {
	if (e.repeat) return;
	var ch: string = String.fromCharCode(e.keyCode);
	if (heldDown[ch] != undefined) {
		heldDown[ch] = true;
	}
}

function checkUp(e: KeyboardEvent) : void {
	var ch: string = String.fromCharCode(e.keyCode);
	if (heldDown[ch] != undefined) {
		heldDown[ch] = false;
	}
}
canvas.addEventListener('mousedown', function (evt: any) {
	console.log(evt.layerX, evt.layerY);
}, false);
// } events


function gameLoop() : void {
	ctx.clearRect(0, 0, winWid, winHei);
	if (heldDown["A"]) player.j -= 0.1;
	if (heldDown["D"]) player.j += 0.1;
	if (heldDown["W"]) player.i -= 0.1;
	if (heldDown["S"]) player.i += 0.1;
	if (bd(player.i, player.j)) {
		terrain[round(player.i)][round(player.j)].imageId = "wood1";
	}
	
	const wide: number = round(winWid / scale);
	const long: number = round(winHei / scale);
	const halfW: number = round(wide / 2);
	const halfL: number = round(long / 2);
	for (var i = -1; i < long + 1; i ++) {
		for (var j = -1; j < wide + 1; j ++) {
			const ni: number = round(player.i) - halfL + i;
			const nj: number = round(player.j) - halfW + j;
			if (bd(ni, nj)) {
				const bitI: number = player.i - round(player.i);
				const bitJ: number = player.j - round(player.j);
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