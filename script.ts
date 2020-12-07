// @ts-ignore
terrFromString(terr);

var cur: string = "stone1";
function gameLoop(): void {
	ctx.clearRect(0, 0, winWid, winHei);
	if (heldDown["A"]) player.j -= 0.1;
	if (heldDown["D"]) player.j += 0.1;
	if (heldDown["W"]) player.i -= 0.1;
	if (heldDown["S"]) player.i += 0.1;
	player.i = max(0, min(mapHei, player.i));
	player.j = max(0, min(mapWid, player.j));

	if (heldDown["B"] && bd(round(player.i), round(player.j))) {
		terrain[round(player.i)][round(player.j)].imageId = cur;
	}
	if (heldDown["F"]) {
		fill(round(player.i), round(player.j), new Tile(cur));
		heldDown["F"] = false;
	}

	const wide: number = round(winWid / scale);
	const long: number = round(winHei / scale);
	const halfW: number = round(wide / 2);
	const halfL: number = round(long / 2);
	for (var i = -1; i < long + 1; i++) {
		for (var j = -1; j < wide + 1; j++) {
			const ni: number = round(player.i) - halfL + i;
			const nj: number = round(player.j) - halfW + j;
			if (bd(ni, nj)) {
				const bitI: number = player.i - round(player.i);
				const bitJ: number = player.j - round(player.j);
				drawImage(terrain[ni][nj].imageId, (j - bitJ) * scale, (i - bitI) * scale, scale, scale);
				drawImage(level[ni][nj].imageId, (j - bitJ) * scale, (i - bitI) * scale, scale, scale);

			}
		}
	}
	drawCircle(winWid / 2 + scale, winHei / 2 + scale, scale / 2, "#0000FF");
	requestAnimationFrame(gameLoop);
}
gameLoop();

function debug() {
	console.log(JSON.stringify(player));
}