// @ts-ignore
terrFromString(rawTerr);
// @ts-ignore
levelFromJSON(JSON.parse(rawLev));

var cur: string = "stone1";
function gameLoop(): void {
	ctx.clearRect(0, 0, winWid, winHei);
	drawImage("bg3", 0, 0, winWid, winHei);
	if (heldDown["A"]) player.move(0, -1);
	if (heldDown["D"]) player.move(0, 1);
	if (heldDown["W"]) player.move(-1, 0);
	if (heldDown["S"]) player.move(1, 0);

	if (heldDown["B"] && bd(round(player.i), round(player.j))) {
		terrain[round(player.i)][round(player.j)].imageId = cur;
	}
	if (heldDown["F"]) {
		fill(round(player.i), round(player.j), new Tile(cur));
		heldDown["F"] = false;
	}
	var numW: number = floor(winWid / scale / 2);
	var numH: number = floor(winHei / scale / 2); 
	var top: number = player.i - numH;
	var left: number = player.j - numW;
	for (var i = 0; i < numH * 2; i ++) {
		for (var j = 0; j < numW * 2; j ++) {
			if (bd(i, j)) {
				var x: number = (j - left) * scale;
				var y: number = (i - top) * scale;
				drawImage(terrain[floor(i)][floor(j)].imageId, x, y, scale, scale);
				drawImage(level[floor(i)][floor(j)].imageId, x, y, scale, scale);
			}
		}
	}
	player.paint();
	requestAnimationFrame(gameLoop);
}
gameLoop();

function debug() {
	console.log(player.i, player.j);
}
