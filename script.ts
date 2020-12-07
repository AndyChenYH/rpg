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
function bd (i: number, j: number) : boolean {
	return 0 <= i && i < mapHei && 0 <= j && j < mapWid;
}

function fill(i: number, j: number, tile: Tile) : void {
	var dir: number[][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	var q: list<number[]> = new list<number[]>();
	q.push_back([i, j]);
	terrain[i][j] = JSON.parse(JSON.stringify(tile));
	L1: while (q.size != 0) {
		var fr: number[] = q.front();
		q.pop_front();
		for (var dr of dir) {
			var ni: number = fr[0] + dr[0];
			var nj: number = fr[1] + dr[1];
			if (bd(ni, nj) && terrain[ni][nj].imageId != tile.imageId) {
				terrain[ni][nj] = JSON.parse(JSON.stringify(tile));
				q.push_back([ni, nj]);
			}
		}
	}
}
// } functions

// events {
var heldDown: any = {
	"A": false,
	"D": false,
	"W": false,
	"S": false,
	"B": false,
	"F": false,
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
/*
canvas.addEventListener('mousedown', function (evt: any) {
	console.log(evt.layerX, evt.layerY);
}, false);
*/

// } events


function gameLoop() : void {
	ctx.clearRect(0, 0, winWid, winHei);
	if (heldDown["A"]) player.j -= 0.1;
	if (heldDown["D"]) player.j += 0.1;
	if (heldDown["W"]) player.i -= 0.1;
	if (heldDown["S"]) player.i += 0.1;
	if (heldDown["B"] && bd(round(player.i), round(player.j))) {
		terrain[round(player.i)][round(player.j)].imageId = "wood1";
	}
	if (heldDown["F"]) {
		fill(round(player.i), round(player.j), new Tile("wood1"));
		heldDown["F"] = false;
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

// var a: Tile = new Tile("wood1");
// // var b: Tile = new Tile("dirt1");

// console.log(terrain[10][10].equals(a));