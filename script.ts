// @ts-ignore
terrFromString(rawTerr);
// @ts-ignore
levelFromJSON(rawLev);

// level[5][5] = new Block("tree2", true);
// level[5][6] = new Block("blank1", true, true, 5, 5);
// level[2][2] = new Block("tree3", false);
addBlock("tree3", 2, 2);

function gameLoop(): void {
	ctx.clearRect(0, 0, winWid, winHei);
	drawImage("bg1", 0, 0, winWid, winHei);

	if (heldDown["A"]) player.move(0, -1);
	if (heldDown["D"]) player.move(0, 1);
	if (heldDown["W"]) player.move(-1, 0);
	if (heldDown["S"]) player.move(1, 0);

	// level editing {
	if (heldDown["B"] && bd(round(player.i), round(player.j))) {
		if (which == 0) {
			terrain[round(player.i)][round(player.j)].imageId = cur;
		}
		else if (which == 1) {
			level[round(player.i)][round(player.j)].imageId = cur;
			level[round(player.i)][round(player.j)].passable = pass;

		}
	}
	// } level editing
	var numW: number = floor(winWid / scale / 2);
	var numH: number = floor(winHei / scale / 2);
	var top: number = player.i - numH;
	var left: number = player.j - numW;
	for (var i = 0; i < numH * 2; i++) {
		for (var j = 0; j < numW * 2; j++) {
			if (bd(i, j)) {
				var ter: Tile = terrain[floor(i)][floor(j)];
				var x: number = (j - left) * scale;
				var y: number = (i - top) * scale;
				drawImage(ter.imageId, x, y, scale, scale);
			}
		}
	}
	for (var i = 0; i < numH * 2; i++) {
		for (var j = 0; j < numW * 2; j++) {
			if (bd(i, j)) {
				var lev: Block = level[floor(i)][floor(j)];
				var x: number = (j - left) * scale;
				var y: number = (i - top) * scale;
				if (lev.isPt) {
					x = (lev.ptI - left) * scale;
					y = (lev.ptJ - top) * scale;
					lev = level[lev.ptI][lev.ptJ];
				}
				if (imgDat[lev.imageId] === undefined) {
					drawImage(lev.imageId, x, y, scale, scale);
				}
				else {
					var relWid: number = imgDat[lev.imageId].length;
					var relHei: number = imgDat[lev.imageId][0].length;
					drawImage(lev.imageId, x, y, relWid * scale, relHei * scale);
				}
			}
		}
	}

	player.paint();

	requestAnimationFrame(gameLoop);
}
gameLoop();

function debug(): void {
	console.log(player.i, player.j);
}
function edit(): void {
	editing = !editing;
	document.getElementById("editing").innerHTML = String(editing);
}