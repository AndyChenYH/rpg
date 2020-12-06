var heldDown: string[] = [];
window.addEventListener("keydown",this.checkDown,false);
window.addEventListener("keyup",this.checkUp,false);

function checkDown(e) : void {
	if (e.repeat) return;
	heldDown.push(String.fromCharCode(e.keyCode));
}

function checkUp(e) : void {
	for (var i = 0; i < heldDown.length; i ++) {
		if (heldDown[i] == String.fromCharCode(e.keyCode)) {
			heldDown.splice(i, 1);
			i --;
		}
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

// setup {
const scale: number = 20;

var p: Player = new Player(0, 0);
const mapWid: number = 500;
const mapHei: number = 500;
var map: string[][] = [];
for (var i = 0; i < mapHei; i ++) {
	map.push(new Array(mapWid));
	for (var j = 0; j < mapWid; j ++) {
		map[i][j] = rgbToHex(rd(0, 255), rd(0, 255), rd(0, 255));;
	}
}

// } setup

console.log(map);

function gameLoop() : void {
	ctx.clearRect(0, 0, winWid, winHei);
	for (var k of heldDown) {
		if (k == "A") p.j -= 0.1;
		else if (k == "D") p.j += 0.1;
		else if (k == "W") p.i -= 0.1;
		else if (k == "S") p.i += 0.1;
	}
	var bd = (i: number, j: number) => 0 <= i && i < mapHei && 0 <= j && j < mapWid;
	const wide: number = Math.floor(winWid / scale);
	const long: number = Math.floor(winHei / scale);
	for (var i = 0; i < long; i ++) {
		for (var j = 0; j < wide; j ++) {
			const ni: number = Math.floor(p.i + i);
			const nj: number = Math.floor(p.j + j);
			if (bd(ni, nj)) {
				const bitI: number = p.i - Math.floor(p.i);
				const bitJ: number = p.j - Math.floor(p.j);
				drawRect((j - bitJ) * scale, (i - bitI) * scale, scale, scale, map[ni][nj]);
			}

		}
	}
	var half: number = Math.floor(winHei / scale / 2);
	drawCircle(20, 20, scale / 2, "#0000FF");
	requestAnimationFrame(gameLoop);
}
gameLoop();

