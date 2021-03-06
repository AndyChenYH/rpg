// variables {
// #region
// should be divisible by canvas width and height
const scale: number = 30;
// allows the user to add and delete blocks and pass through blocks
var editing: boolean = false;
// whether the player is in their inventory
var dispInv: boolean = false;
// current mouse positions
var mouseX: number = 0;
var mouseY: number = 0;
// offset of inventory
const invOffI: number = winHei - scale * 4;
const invOffJ: number = 0;
// oofset of crafting table
const craOffI: number = invOffI;
const craOffJ: number = scale * 10 + invOffJ;
// player stands at (1, 1)
var player: Player = new Player(1, 1);
// dimensions of game map
const mapWid: number = 5;
const mapHei: number = 5;
// tiles player's feet
var terrain: Tile[][] = [];
// above ground blocks
var level: Block[][] = [];
var craftTable: Item[][] = [];
// initializing crafting table
for (var i = 0; i < 3; i ++) {
	craftTable.push([]);
	for (var j = 0; j < 3; j ++) {
		craftTable[i].push(undefined);
	}
}
// initializing terrain and level
for (var i = 0; i < mapHei; i++) {
	terrain.push(new Array(mapWid));
	level.push(new Array(mapWid));
	for (var j = 0; j < mapWid; j++) {
		terrain[i][j] = new Tile("blank1");
		level[i][j] = new Block("blank1", true, false);
	}
}

// cur setting {
// editing terrain(0) or level(1)?
var whichEdit: number = 0;
// which tile/block should be put in
var curEdit: string = "dirt1";
// } cur setting

// definition for blocks in blockDat
interface IDat {
	health: number;
	pass: boolean[][];
}
// health and passability and dimensions of blocks that are not 1*1
// TODO: even 1*1s have to be put in
const blockDat: {[key: string]: IDat} = {
	"wall1": {
		health: Infinity,
		pass: [[false]],
	},
	"tree1": {
		health: 10,
		pass: [[false], [false]],
	},
	"tree2": {
		health: 10,
		pass: [[false], [false]],
	},
	"tree3": {
		health: 10,
		pass: [[false, false], [false, false]],
	},
	"tree4": {
		health: 10,
		pass: [[false, false], [false, false], [false, false]],
	},
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
	curEdit = document.getElementById("curSet").value;
	// @ts-ignore	
	whichEdit = Number(document.getElementById("whichSet").value);
}

function addBlock(imageId: string, i: number, j: number): void {
	const img: boolean[][] = blockDat[imageId].pass;
	// check if any part is out of bounds or collides with another block
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
				level[i + ii][j + jj] = new Block("", img[ii][jj], true);
				level[i + ii][j + jj].setPt(i, j);
			}
		}
	}
}

function fill(): void {
	var i: number = round(player.i);
	var j: number = round(player.j);
	var tile: Tile = new Tile(curEdit);
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
function terrToJSON() : ITile[][] {
	var res: ITile[][] = [];
	for (var i = 0; i < mapHei; i ++) {
		res.push([]);
		for (var j = 0; j < mapWid; j ++) {
			res[i].push(terrain[i][j].toJSON());
		}
	}
	return res;
}
function levelToJSON() : IBlock[][] {
	var res: IBlock[][] = [];
	for (var i = 0; i < mapHei; i ++) {
		res.push([]);
		for (var j = 0; j < mapWid; j ++) {
			res[i].push(level[i][j].toJSON());
		}
	}
	return res;
}
function terrFromJSON(obj: ITile[][]): void {
	for (var i = 0; i < min(mapHei, obj.length); i++) {
		for (var j = 0; j < min(mapWid, obj[i].length); j++) {
			terrain[i][j].fromJSON(obj[i][j]);
		}
	}
}
function levelFromJSON(obj: IBlock[][]): void {
	for (var i = 0; i < min(mapHei, obj.length); i++) {
		for (var j = 0; j < min(mapWid, obj[i].length); j++) {
			level[i][j].fromJSON(obj[i][j]);
		}
	}
}
function gameToJSON(): [ITile[][], IBlock[][]] {
	return [terrToJSON(), levelToJSON()];
}
function gameFromJSON(obj: [ITile[][], IBlock[][]]): void {
	terrFromJSON(obj[0]);
	levelFromJSON(obj[1]);
}
// #endregion
// } functions

// events {
// #region
var heldDown: { [key: string]: boolean } = {
	// movements
	"A": false, "D": false, "W": false, "S": false, 
	"B": false,  // editing single tile/block
	"C": false,  // deleting single tile/block 
};
window.addEventListener("keydown", this.checkDown, false);
window.addEventListener("keyup", this.checkUp, false);
function checkDown(e: KeyboardEvent): void {
	if (e.repeat) return;
	var ch: string = chr(e.keyCode);
	if (49 <= e.keyCode && e.keyCode <= 53) {
		player.hotJ = e.keyCode - 48 - 1;
	}
	if (ch == "E") {
		if (dispInv) {
			for (var i = 0; i < 3; i ++) {
				for (var j = 0; j < 3; j ++) {
					if (craftTable[i][j] !== undefined) {
						player.addItem(craftTable[i][j]);
						craftTable[i][j] = undefined;
					}
				}
			}
		}
		dispInv = !dispInv;
	}
	if (heldDown[ch] !== undefined) {
		heldDown[ch] = true;
	}
}

function checkUp(e: KeyboardEvent): void {
	var ch: string = chr(e.keyCode);
	if (heldDown[ch] !== undefined) {
		heldDown[ch] = false;
	}
}
var isDrag: boolean = false;
var dragX: number;
var dragY: number;
canvas.addEventListener('mousedown', function (evt: any) {
	var mX: number = evt.layerX;
	var mY: number = evt.layerY;
	isDrag = true;
	dragX = mX;
	dragY = mY;
}, false);
canvas.addEventListener('mouseup', function (evt: any) {
	var mX: number = evt.layerX;
	var mY: number = evt.layerY;
	isDrag = false;
	if (dispInv) {
		var j: number = floor((mX - craOffJ) / scale);
		var i: number = floor((mY - craOffI) / scale);
		var invJ: number = floor((dragX - invOffJ) / scale);
		var invI: number = floor((dragY - invOffI) / scale);
		if (bd(invI, invJ) && bd(i, j)) {
			craftTable[i][j] = player.inv[invI][invJ];
			player.inv[invI][invJ] = undefined;
		}
	}
}, false);

// #endregion

// } events