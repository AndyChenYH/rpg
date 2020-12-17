// classes {
class Tile {
	/*
	if you are adding instance fields, make sure to change:
	constructor parameter
	constructor initialization
	toJSON
	fromJSON
	interface
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
interface ITile {
	imageId: string;
}
class Block extends Tile {
	passable: boolean;
	isPt: boolean;
	ptI: number;
	ptJ: number;
	constructor(imageId: string, passable: boolean, isPt: boolean) {
		super(imageId);
		this.passable = passable;
		this.isPt = isPt;
	}
	setPt(ptI: number, ptJ: number) : void {
		assert(this.isPt);
		this.ptI = ptI;
		this.ptJ = ptJ;
	}
	orig() : Block {
		assert(this.isPt);
		return level[this.ptI][this.ptJ];
	}
	toJSON() : any {
		var res: any = super.toJSON();
		res.passable = this.passable;
		res.isPt = this.isPt;
		if (this.isPt) {
			res.ptI = this.ptI;
			res.ptJ = this.ptJ;
		}
		return res;
	}
	fromJSON(obj: any): void {
		super.fromJSON(obj);
		this.passable = obj.passable;
		this.isPt = obj.isPt;
		if (obj.isPt) {
			this.ptI = obj.ptI;
			this.ptJ = obj.ptJ;
		}
	}
}
interface IBlock extends ITile {
	passable: boolean;
	isPt: boolean;
}
interface IPointer extends IBlock {
	ptI: number;
	ptJ: number;
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
	hotJ: number;
	constructor(i: number, j: number) {
		super(i, j);
		this.images = ["player1", "player2", "player3", "player4"];
		this.inv = [...Array(4)].map(e => Array(9));
		this.hotJ = 0;
	}
	act() : void {
		var ni: number = round(this.i) + this.faceI;
		var nj: number = round(this.j) + this.faceJ;
		if (bd(ni, nj)) {
			var bl: Block;
			if (level[ni][nj].isPt) bl = level[ni][nj].orig();
			if (bl.imageId.substring(0, 4) === "tree") {
			}
		}
	}
	addItem(it: Item) : void {
		for (var i = 3; 0 <= i; i --) {
			for (var j = 0; j < 9; j ++) {
				if (this.inv[i][j] === undefined) {
					this.inv[i][j] = it;
					return;
				}
			}
		}
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

