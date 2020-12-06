var heldDown: string[] = [];
window.addEventListener("keydown",this.checkDown,false);
window.addEventListener("keyup",this.checkUp,false);

function checkDown(e) : void {
	if (e.repeat) return;
	var ch: string = String.fromCharCode(e.keyCode);
	heldDown.push(ch);
}

function checkUp(e) : void {
	for (var i = 0; i < heldDown.length; i ++) {
		var ch: string = String.fromCharCode(e.keyCode);
		if (heldDown[i] == ch) {
			heldDown.splice(i, 1);
			i --;
		}
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

// setup {
const scale: number = 20;

var p: Player = new Player(10, 10);
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

const bd = (i: number, j: number) => 0 <= i && i < mapHei && 0 <= j && j < mapWid;

function gameLoop() : void {
	ctx.clearRect(0, 0, winWid, winHei);
	for (var k of heldDown) {
		if (k == "A") p.microJ -= 0.1;
		else if (k == "D") p.microJ += 0.1;
		else if (k == "W") p.microI -= 0.1;
		else if (k == "S") p.microI += 0.1;
	}
	if (p.microI >= 1) {
		p.i ++;
		p.microI = 0;
	}
	if (p.microI <= -1) {
		p.i --;
		p.microI = 0;
	}
	if (p.microJ >= 1) {
		p.j ++;
		p.microJ = 0;
	}
	if (p.microJ <= -1) {
		p.j --;
		p.microJ = 0;
	}
	// debug {
	if (bd(p.i, p.j)) {
		map[p.i][p.j] = "#000000";
	}
	// } debug

	const wide: number = Math.round(winWid / scale);
	const long: number = Math.round(winHei / scale);
	const halfW: number = Math.round(wide / 2);
	const halfL: number = Math.round(long / 2);
	for (var i = -1; i < long + 1; i ++) {
		for (var j = -1; j < wide + 1; j ++) {
			const ni: number = p.i - halfL + i;
			const nj: number = p.j - halfW + j;
			if (bd(ni, nj)) {
				drawRect((j - p.microJ) * scale, (i - p.microI) * scale, scale, scale, map[ni][nj]);
			}
		}
	}
	drawCircle(winWid / 2 + scale, winHei / 2 + scale, scale / 2, "#0000FF");
	requestAnimationFrame(gameLoop);
}
gameLoop();


function debug() {
	console.log(p.i, p.j, p.microI, p.microJ);
}