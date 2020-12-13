// @ts-ignore
gameFromJSON(rawGame);
player.inv[3][0] = new Axe("axe1", 1);
function gameLoop() {
    ctx.clearRect(0, 0, winWid, winHei);
    drawImage("bg1", 0, 0, winWid, winHei);
    // player controls {
    if (heldDown["A"])
        player.move(0, -1);
    if (heldDown["D"])
        player.move(0, 1);
    if (heldDown["W"])
        player.move(-1, 0);
    if (heldDown["S"])
        player.move(1, 0);
    // } player controls
    // level editing {
    var pi = round(player.i);
    var pj = round(player.j);
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
            var ii = pi;
            var jj = pj;
            if (level[pi][pj].isPt) {
                var pt = level[pi][pj];
                ii = pt.ptI;
                jj = pt.ptJ;
            }
            var wid = 1;
            var hei = 1;
            var img = blockDat[level[ii][jj].imageId];
            if (img != undefined) {
                hei = img.length;
                wid = img[0].length;
            }
            for (var i = 0; i < hei; i++) {
                for (var j = 0; j < wid; j++) {
                    level[ii + i][jj + j] = new Block("blank1", true, false);
                }
            }
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
    player.paint();
    for (var i = 0; i < numH * 2; i++) {
        for (var j = 0; j < numW * 2; j++) {
            if (bd(i, j)) {
                var lev = level[floor(i)][floor(j)];
                var x = (j - left) * scale;
                var y = (i - top) * scale;
                if (lev.isPt)
                    continue;
                if (blockDat[lev.imageId] === undefined) {
                    drawImage(lev.imageId, x, y, scale, scale);
                }
                else {
                    var relHei = blockDat[lev.imageId].length;
                    var relWid = blockDat[lev.imageId][0].length;
                    drawImage(lev.imageId, x, y, relWid * scale, relHei * scale);
                }
            }
        }
    }
    // draw inventory
    ctx.strokeStyle = "#000000";
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 9; j++) {
            drawRect(j * scale + invOffJ, i * scale + invOffI, scale, scale, "#888888");
        }
    }
    // draw crafting table
    if (dispInv) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                drawRect(j * scale + scale * 10 + craOffJ, i * scale + craOffI, scale, scale, "#888888");
            }
        }
    }
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
