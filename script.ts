// @ts-ignore
terrFromString(terr);

var cur: string = "stone1";
function gameLoop(): void {
	ctx.clearRect(0, 0, winWid, winHei);
	drawImage("bg3", 0, 0, winWid, winHei);
	player.preI = player.i;
	player.preJ = player.j;
	if (heldDown["A"]) player.move(0, -1);
	if (heldDown["D"]) player.move(0, 1);
	if (heldDown["W"]) player.move(-1, 0);
	if (heldDown["S"]) player.move(1, 0);
	player.i = max(0, min(mapHei, player.i));
	player.j = max(0, min(mapWid, player.j));

	if (heldDown["B"] && bd(round(player.i), round(player.j))) {
		terrain[round(player.i)][round(player.j)].imageId = cur;
	}
	if (heldDown["F"]) {
		fill(round(player.i), round(player.j), new Tile(cur));
		heldDown["F"] = false;
	}
	//TODO make it rectangle compatible
	var num: number = floor(winWid / scale / 2);
	var top: number = player.i - num;
	var left: number = player.j - num;
	for (var i = 0; i < num * 2; i ++) {
		for (var j = 0; j < num * 2; j ++) {
			if (bd(i, j)) {
				var x: number = (j - left) * scale;
				var y: number = (i - top) * scale;
				drawImage(terrain[floor(i)][floor(j)].imageId, x, y, scale, scale);
				drawImage(level[floor(i)][floor(j)].imageId, x, y, scale, scale);
			}
		}
	}
	drawCircle(winWid / 2 + scale / 2, winHei / 2 + scale / 2, scale / 2, "#0000FF");
	requestAnimationFrame(gameLoop);
}
gameLoop();

function debug() {
	console.log(round(player.i * 100) / 100, round(player.j * 100) / 100);
}
