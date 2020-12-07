// classes {
class Tile {
	imageId: string;
	constructor(imageId: string) {
		this.imageId = imageId;
	}
}
class Block {
	imageId: string;
	passable: boolean;
	/*
	if you are adding instance fields, make sure to change:
	constructor parameter
	constructor initialization
	fromJSON
	*/
	constructor(imageId: string="", passable: boolean=true) {
		this.imageId = imageId;
		this.passable = passable;
	}
	fromJSON(obj: any) : void {
		this.imageId = obj.imageId;
		this.passable = obj.passable;
	}
}
class Entity {
	i: number;
	j: number;
	faceI: number;
	faceJ: number;
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
		this.faceI = 1;
		this.faceJ = 0;
	}
}
class Player extends Entity {
	speed: number = 0.1;
	images: string[];
	constructor(i: number, j: number) {
		super(i, j);
		this.images = ["player1", "player2", "player3", "player4"];
	}
	move(di: number, dj: number) : void {
		this.faceI = di;
		this.faceJ = dj;
		var ni: number = this.i + di * this.speed;
		var nj: number = this.j + dj * this.speed;
		if (bd(round(ni), round(nj)) && level[round(ni)][round(nj)].passable) {
			this.i = ni;
			this.j = nj;
		}
		this.i = max(0, min(mapHei, this.i));
		this.j = max(0, min(mapWid, this.j));

		this.i = round(this.i * 1e5) / 1e5;
		this.j = round(this.j * 1e5) / 1e5;
	}
	paint() : void {
		var image: string;
		if (this.faceI === 1) image = this.images[0];
		else if (this.faceJ === -1) image = this.images[1];
		else if (this.faceJ === 1) image = this.images[2];
		else if (this.faceI === -1) image = this.images[3];
		drawImage(image, winWid / 2, winHei / 2, scale, scale);
	}
}
// } classes

// variables {
// should be divisible by canvas width and height
const scale: number = 30;

var edit: boolean = false;
var player: Player = new Player(1, 1);
const mapWid: number = 5;
const mapHei: number = 5;
var terrain: Tile[][] = [];
var level: Block[][] = [];
for (var i = 0; i < mapHei; i++) {
	terrain.push(new Array(mapWid));
	level.push(new Array(mapWid));
	for (var j = 0; j < mapWid; j ++) {
		terrain[i][j] = new Tile("dirt1");
		level[i][j] = rd(0, 10) == 0 ? new Block("grass2", false) : new Block("blank1", true);
	}
}
// } variables

// functions {
function dist(i1: number, j1: number, i2: number, j2: number) : number {
	var di: number = i1 - i2;
	var dj: number = j1 - j2;
	return Math.sqrt(di * di + dj * dj);
}
function bd(i: number, j: number): boolean {
	return 0 <= i && i < mapHei && 0 <= j && j < mapWid;
}

function fill(i: number, j: number, tile: Tile): void {
	if (!bd(i, j)) return;
	var q: list<number[]> = new list<number[]>();
	q.push_back([i, j]);
	terrain[i][j] = tile;
	while (q.size != 0) {
		var fr: number[] = q.front();
		q.pop_front();
		for (var dr of drs) {
			var ni: number = fr[0] + dr[0];
			var nj: number = fr[1] + dr[1];
			if (bd(ni, nj) && terrain[ni][nj].imageId != tile.imageId) {
				terrain[ni][nj] = tile;
				q.push_back([ni, nj]);
			}
		}
	}
}
function terrToString() : string {
	var res = "";
	for (var i = 0; i < mapHei; i ++) {
		for (var j = 0; j < mapWid; j ++) {
			res += terrain[i][j].imageId;
			if (j != mapWid - 1) res += " ";
		}
		if (i != mapHei - 1) {
			res += "/";
		}
	}
	return res;
}
function terrFromString(raw: string) : void {
	var rows: string[] = raw.split("/");
	for (var i = 0; i < min(mapHei, rows.length); i ++) {
		var tiles: string[] = rows[i].split(" ");
		for (var j = 0; j < min(mapWid, tiles.length); j ++) {
			terrain[i][j].imageId = tiles[j];
		}
	}
}
function levelFromJSON(obj: any) : void {
	for (var i = 0; i < min(mapHei, obj.length); i ++) {
		for (var j = 0; j < min(mapWid, obj[i].length); j ++) {
			level[i][j] = new Block();
			level[i][j].fromJSON(obj[i][j]);
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
	"O": false,
};
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e: KeyboardEvent): void {
	if (e.repeat) return;
	var ch: string = String.fromCharCode(e.keyCode);
	if (heldDown[ch] != undefined) {
		heldDown[ch] = true;
	}
}

function checkUp(e: KeyboardEvent): void {
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
