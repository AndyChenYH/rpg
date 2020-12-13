// @ts-ignore
gameFromJSON(rawGame);

player.inv[3][0] = new Axe("axe1", 1);

function gameLoop(): void {
	ctx.clearRect(0, 0, winWid, winHei);
	drawImage("bg1", 0, 0, winWid, winHei);

	// player controls {
	if (heldDown["A"]) player.move(0, -1);
	if (heldDown["D"]) player.move(0, 1);
	if (heldDown["W"]) player.move(-1, 0);
	if (heldDown["S"]) player.move(1, 0);

	// } player controls

	// level editing {
	var pi: number = round(player.i);
	var pj: number = round(player.j);
	if (heldDown["B"]) {
		if (which == 0) {
			terrain[pi][pj].imageId = cur;
		}
		else if (which == 1) {
			addBlock(cur, pi, pj);
		}
	}
	if (heldDown["C"]) {
		if (which == 0) {
			terrain[pi][pj] = new Tile("blank1");
		}
		else if (which == 1) {
			var ii: number = pi;
			var jj: number = pj;
			if (level[pi][pj].isPt) {
				var pt: Pointer = level[pi][pj] as Pointer;
				ii = pt.ptI;
				jj = pt.ptJ;
			}
			var wid: number = 1;
			var hei: number = 1;
			var img: boolean[][] = blockDat[level[ii][jj].imageId];
			if (img != undefined) {
				hei = img.length;
				wid = img[0].length;
			}
			for (var i = 0; i < hei; i ++) {
				for (var j = 0; j < wid; j ++) {
					level[ii + i][jj + j] = new Block("blank1", true, false);
				}
			}
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
	player.paint();
	for (var i = 0; i < numH * 2; i++) {
		for (var j = 0; j < numW * 2; j++) {
			if (bd(i, j)) {
				var lev: Block = level[floor(i)][floor(j)];
				var x: number = (j - left) * scale;
				var y: number = (i - top) * scale;
				if (lev.isPt) continue;
				if (blockDat[lev.imageId] === undefined) {
					drawImage(lev.imageId, x, y, scale, scale);
				}
				else {
					var relHei: number = blockDat[lev.imageId].length;
					var relWid: number = blockDat[lev.imageId][0].length;
					drawImage(lev.imageId, x, y, relWid * scale, relHei * scale);
				}
			}
		}
	}

	// draw inventory
	ctx.strokeStyle = "#000000";
	for (var i = 0; i < 4; i ++) {
		for (var j = 0; j < 9; j ++) {
			drawRect(j * scale + invOffJ, i * scale + invOffI, scale, scale, "#888888");
			if (player.inv[i][j] !== undefined) {
				drawImage(player.inv[i][j].imageId, j * scale + invOffJ, i * scale + invOffI, scale, scale);
			}
		}
	}
	// draw crafting table
	if (dispInv) {
		for (var i = 0; i < 3; i ++) {
			for (var j = 0; j < 3; j ++) {
				drawRect(j * scale + scale * 10 + craOffJ, i * scale + craOffI, scale, scale, "#888888");
			}
		}
	}
	// draw dragging
	if (isDrag && dispInv) {
		var invJ: number = floor((dragX - invOffJ) / scale);
		var invI: number = floor((dragY - invOffI) / scale);
		if (bd(invI, invJ) && player.inv[invI][invJ] !== undefined) {
			ctx.globalAlpha = 0.7;
			drawImage(player.inv[invI][invJ].imageId, mouseX - scale / 2, mouseY - scale / 2, scale, scale);
			ctx.globalAlpha = 1;
		}
	}
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