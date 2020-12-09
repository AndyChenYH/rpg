// @ts-ignore
gameFromJSON(rawGame);
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
    // facing
    if (heldDown["J"]) {
        player.faceI = 0;
        player.faceJ = -1;
    }
    if (heldDown["L"]) {
        player.faceI = 0;
        player.faceJ = 1;
    }
    if (heldDown["I"]) {
        player.faceI = -1;
        player.faceJ = 0;
    }
    if (heldDown["K"]) {
        player.faceI = 1;
        player.faceJ = 0;
    }
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
            terrain[pi][pj] = new Tile();
        }
        else if (which == 1) {
            var ii = pi;
            var jj = pj;
            if (level[pi][pj].isPt) {
                ii = level[pi][pj].ptI;
                jj = level[pi][pj].ptJ;
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
                    level[ii + i][jj + j] = new Block();
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
