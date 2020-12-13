// classes {
class Tile {
	/*
	if you are adding instance fields, make sure to change:
	constructor parameter
	constructor initialization
	fromJSON
	*/
	imageId: string;
	constructor(imageId: string) {
		this.imageId = imageId;
	}
	toJSON() : any {
		return { imageId: this.imageId };
	}
	fromJSON(obj: any): void {
		this.imageId = obj.imageId;
	}
}
class Block extends Tile {
	passable: boolean;
	isPt: boolean;
	constructor(imageId: string, passable: boolean, isPt: boolean) {
		super(imageId);
		this.passable = passable;
		this.isPt = isPt;
	}
	toJSON() : any {
		var res: any = super.toJSON();
		res.passable = this.passable;
		res.isPt = this.isPt;
	}
	fromJSON(obj: any): void {
		super.fromJSON(obj);
		this.passable = obj.passable;
		this.isPt = obj.isPt;
	}
}
class Pointer extends Block {
	ptI: number;
	ptJ: number;
	constructor(passable: boolean, ptI: number, ptJ: number) {
		super("", passable, true);
		this.ptI = ptI;
		this.ptJ = ptJ;
	}
	toJSON() : any {
		return {
			passable: this.passable,
			ptI: this.ptI,
			ptJ: this.ptJ,
		};
	}
	fromJSON(obj: any) : void {
		this.passable = obj.passable,
		this.ptI = obj.ptI;
		this.ptJ = obj.ptJ;
	}

}
class Item {
	imageId: string;
	constructor(imageId: string) {
		this.imageId = imageId;
	}
}
class Tool extends Item {
	damage: number;
	constructor(imageId: string, damage: number) {
		super(imageId);
		this.damage = damage;
	}
}
class Axe extends Tool {
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
	inv: Item[][];
	invI: number;
	invJ: number;
	constructor(i: number, j: number) {
		super(i, j);
		this.images = ["player1", "player2", "player3", "player4"];
		this.inv = [...Array(4)].map(e => Array(9));
		
		this.invI = 3;
		this.invJ = 0;
	}
	move(di: number, dj: number): void {
		this.faceI = di;
		this.faceJ = dj;
		var ni: number = this.i + di * this.speed;
		var nj: number = this.j + dj * this.speed;
		if (bd(round(ni), round(nj)) && (editing || level[round(ni)][round(nj)].passable)) {
			this.i = ni;
			this.j = nj;
		}
		this.i = max(0, min(mapHei, this.i));
		this.j = max(0, min(mapWid, this.j));

		this.i = round(this.i * 1e5) / 1e5;
		this.j = round(this.j * 1e5) / 1e5;
	}
	paint(): void {
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
// #region
// should be divisible by canvas width and height
const scale: number = 30;
var editing: boolean = false;
var dispInv: boolean = false;
const invOffI: number = winHei - scale * 4;
const invOffJ: number = 0;
const craOffI: number = invOffI;
const craOffJ: number = invOffJ;
var player: Player = new Player(1, 1);
const mapWid: number = 20;
const mapHei: number = 20;
var terrain: Tile[][] = [];
var level: Block[][] = [];
for (var i = 0; i < mapHei; i++) {
	terrain.push(new Array(mapWid));
	level.push(new Array(mapWid));
	for (var j = 0; j < mapWid; j++) {
		terrain[i][j] = new Tile("blank1");
		level[i][j] = new Block("blank1", true, false);
	}
}

// cur setting {
var cur: string = "dirt1";
var which: number = 0;
// } cur setting

const blockDat: { [key: string]: boolean[][] } = {
	"wall1": [[false]],
	"table1": [[false]],
	"barrel1": [[false], [false]],
	"tree1": [[false], [false]],
	"tree2": [[false], [false]],
	"tree3": [[false, false], [false, false]],
	"tree4": [[false, false], [false, false], [false, false]],
	"fireplace1": [[false]],
	"box1": [[false]],
	"clock1": [[false], [false]],
};
// #endregion

// } variables

// functions {
// #region
function dist(i1: number, j1: number, i2: number, j2: number): number {
	var di: number = i1 - i2;
	var dj: number = j1 - j2;
	return Math.sqrt(di * di + dj * dj);
}
function bd(i: number, j: number): boolean {
	return 0 <= i && i < mapHei && 0 <= j && j < mapWid;
}

function setEdit() {
	// @ts-ignore	
	cur = document.getElementById("curSet").value;
	// @ts-ignore	
	which = Number(document.getElementById("whichSet").value);
}

function addBlock(imageId: string, i: number, j: number): void {
	const img: boolean[][] = blockDat[imageId];
	for (var ii = 0; ii < img.length; ii++) {
		for (var jj = 0; jj < img[0].length; jj++) {
			if (!bd(i + ii, j + jj) || level[i + ii][j + jj].imageId !== "blank1") {
				return;
			}
		}
	}
	for (var ii = 0; ii < img.length; ii++) {
		for (var jj = 0; jj < img[0].length; jj++) {
			if (ii == 0 && jj == 0) {
				level[i + ii][j + jj] = new Block(imageId, img[ii][jj], false);
			}
			else {
				level[i + ii][j + jj] = new Pointer(img[ii][jj], i, j);
			}
		}
	}
}

function fill(): void {
	var i: number = round(player.i);
	var j: number = round(player.j);
	var tile: Tile = new Tile(cur);
	if (!bd(i, j)) return;
	var q: list<number[]> = new list<number[]>();
	q.push_back([i, j]);
	terrain[i][j] = tile;
	while (q.size !== 0) {
		var fr: number[] = q.front();
		q.pop_front();
		for (var dr of drs) {
			var ni: number = fr[0] + dr[0];
			var nj: number = fr[1] + dr[1];
			if (bd(ni, nj) && terrain[ni][nj].imageId !== tile.imageId) {
				terrain[ni][nj] = tile;
				q.push_back([ni, nj]);
			}
		}
	}
}
function terrToJSON() : any[][] {
	var res: any[][] = [];
	for (var i = 0; i < mapHei; i ++) {
		res.push([]);
		for (var j = 0; j < mapWid; j ++) {
			res[i].push(terrain[i][j].toJSON());
		}
	}
	return res;
}
function levelToJSON() : any[][] {
	var res: any[][] = [];
	for (var i = 0; i < mapHei; i ++) {
		res.push([]);
		for (var j = 0; j < mapWid; j ++) {
			res[i].push(level[i][j].toJSON());
		}
	}
	return res;
}
function terrFromJSON(obj: any): void {
	for (var i = 0; i < min(mapHei, obj.length); i++) {
		for (var j = 0; j < min(mapWid, obj[i].length); j++) {
			terrain[i][j] = new Tile(undefined);
			terrain[i][j].fromJSON(obj[i][j]);
		}
	}
}
function levelFromJSON(obj: any): void {
	for (var i = 0; i < min(mapHei, obj.length); i++) {
		for (var j = 0; j < min(mapWid, obj[i].length); j++) {
			if (obj[i][j].isPt) {
				level[i][j] = new Pointer(undefined, undefined, undefined);
			}
			else {
				level[i][j] = new Block(undefined, undefined, undefined);
			}
			level[i][j].fromJSON(obj[i][j]);
		}
	}
}
function gameToJSON(): any {
	return [terrToJSON(), levelToJSON()];
}
function gameFromJSON(obj: any): void {
	terrFromJSON(obj[0]);
	levelFromJSON(obj[1]);
}
// #endregion
// } functions

// events {
// #region
var heldDown: { [key: string]: boolean } = {
	// movements
	"A": false,
	"D": false,
	"W": false,
	"S": false,

	"B": false,  // editing single tile/block
	"C": false,  // deleting single tile/block 
	// facings
	"J": false,
	"L": false,
	"I": false,
	"K": false,
};
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e: KeyboardEvent): void {
	if (e.repeat) return;
	var ch: string = String.fromCharCode(e.keyCode);
	if (heldDown[ch] !== undefined) {
		heldDown[ch] = true;
	}
}

function checkUp(e: KeyboardEvent): void {
	var ch: string = String.fromCharCode(e.keyCode);
	if (ch == "E") {
		dispInv = !dispInv;
	}
	if (heldDown[ch] !== undefined) {
		heldDown[ch] = false;
	}
}
/*
canvas.addEventListener('mousedown', function (evt: any) {
	console.log(evt.layerX, evt.layerY);
}, false);
*/
// #endregion

// } events