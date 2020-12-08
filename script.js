// @ts-ignore
terrFromString(rawTerr);
// @ts-ignore
levelFromJSON(rawLev);
level[5][5] = new Block("tree2", true);
function gameLoop() {
    ctx.clearRect(0, 0, winWid, winHei);
    drawImage("bg1", 0, 0, winWid, winHei);
    if (heldDown["A"])
        player.move(0, -1);
    if (heldDown["D"])
        player.move(0, 1);
    if (heldDown["W"])
        player.move(-1, 0);
    if (heldDown["S"])
        player.move(1, 0);
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
    var numW = floor(winWid / scale / 2);
    var numH = floor(winHei / scale / 2);
    var top = player.i - numH;
    var left = player.j - numW;
    for (var i = 0; i < numH * 2; i++) {
        for (var j = 0; j < numW * 2; j++) {
            if (bd(i, j)) {
                var ter = terrain[floor(i)][floor(j)];
                var x = (j - left) * scale;
                var y = (i - top) * scale;
                drawImage(ter.imageId, x, y, scale, scale);
            }
        }
    }
    for (var i = 0; i < numH * 2; i++) {
        for (var j = 0; j < numW * 2; j++) {
            if (bd(i, j)) {
                var lev = level[floor(i)][floor(j)];
                var x = (j - left) * scale;
                var y = (i - top) * scale;
                if (lev.isPt) {
                    lev = level[lev.ptI][lev.ptJ];
                    x = (lev.ptJ - left) * scale;
                    y = (lev.ptI - top) * scale;
                }
                var relWid = relDim[lev.imageId] !== undefined ? relDim[lev.imageId][0] : 1;
                var relHei = relDim[lev.imageId] !== undefined ? relDim[lev.imageId][1] : 1;
                if (lev.imageId == "tree2") {
                    console.log(relWid, relHei);
                }
                drawImage(lev.imageId, x, y, relWid * scale, relHei * scale);
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
function edit() {
    editing = !editing;
    document.getElementById("editing").innerHTML = String(editing);
}
