// loading the game from raw map data
gameFromJSON(rawGame);
// testing: this will not be in the final code
player.inv[3][0] = new Axe("axe1", 1);
player.inv[3][2] = new Axe("axe1", 1);
function gameLoop() {
    // clears the screen
    ctx.clearRect(0, 0, winWid, winHei);
    // draws background image
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
    // only allow the user to add and delete blocks if editing is toggled on	
    if (editing) {
        // too lazy to type out the whole thing, so saved then as constants
        var pi = round(player.i);
        var pj = round(player.j);
        // add in single block
        if (heldDown["B"]) {
            // ground/tiles
            if (whichEdit == 0) {
                // simply changing the image, since that's the only attribute of tiles	
                terrain[pi][pj].imageId = curEdit;
            }
            // above ground/blocks
            else if (whichEdit == 1) {
                // spawn in block, putting into considering its passability and dimensions
                addBlock(curEdit, pi, pj);
            }
        }
        // deleting block or block group
        if (heldDown["C"]) {
            // tile blocks
            if (whichEdit == 0) {
                // simply making it blank
                terrain[pi][pj] = new Tile("blank1");
            }
            // above ground blocks
            else if (whichEdit == 1) {
                // top left corner of the block/group to be deleted
                var ii = pi;
                var jj = pj;
                // if current block is pointer, set it to its original block instead
                if (level[pi][pj].isPt) {
                    ii = level[pi][pj].ptI;
                    jj = level[pi][pj].ptJ;
                }
                // dimensions of block
                var wid = 1;
                var hei = 1;
                var img = blockDat[level[ii][jj].imageId];
                // only set it if the dimensions are not 1*1, meaning that it's defined in blockDat
                if (img !== undefined) {
                    // width and height based on the dimensions of the passable matrix
                    hei = img.pass.length;
                    wid = img.pass[0].length;
                }
                // clearing the parent block and all of its pointers
                for (var i = 0; i < hei; i++) {
                    for (var j = 0; j < wid; j++) {
                        level[ii + i][jj + j] = new Block("blank1", true, false);
                    }
                }
            }
        }
    }
    // } level editing
    // drawing terrain
    /*
    +-----------------------------------------+
    | entire map                              |
    |                                         |
    |                                         |
    |        top left        numWid           |
    |              +---------------------+    |
    |              |                     |    |
    |              |                     |    |
    |              |      player         |    |
    |      numHei  |         @           |    |
    |              |                     |    |
    |              |     gridspace       |    |
    |              |                     |    |
    |              +---------------------+    |
    |                                         |
    +-----------------------------------------+
    */
    // size of the grid space that can be fit onto the screen
    var numW = floor(winWid / scale / 2);
    var numH = floor(winHei / scale / 2);
    // top left corner of the visible grid space
    var top = player.i - numH;
    var left = player.j - numW;
    // looping through the square grid space
    for (var i = 0; i < numH * 2; i++) {
        for (var j = 0; j < numW * 2; j++) {
            if (bd(i, j)) {
                var ter = terrain[floor(i)][floor(j)];
                // getting real coordinates of the tile
                var x = (j - left) * scale;
                var y = (i - top) * scale;
                drawImage(ter.imageId, x, y, scale, scale);
            }
        }
    }
    // paint the player on top of the tiles and below the blocks
    player.paint();
    // painting the blocks
    for (var i = 0; i < numH * 2; i++) {
        for (var j = 0; j < numW * 2; j++) {
            // if the map is smaller than the gridspace or if the player is near the border
            // some parts of the screen will be empty
            if (bd(i, j)) {
                var lev = level[floor(i)][floor(j)];
                var x = (j - left) * scale;
                var y = (i - top) * scale;
                if (lev.isPt)
                    continue;
                var relHei = 1;
                var relWid = 1;
                if (blockDat[lev.imageId] !== undefined) {
                    relHei = blockDat[lev.imageId].pass.length;
                    relWid = blockDat[lev.imageId].pass[0].length;
                }
                drawImage(lev.imageId, x, y, relWid * scale, relHei * scale);
            }
        }
    }
    // draw inventory
    for (var i = 0; i < 4; i++) {
        if (!dispInv && i != 3)
            continue;
        for (var j = 0; j < 9; j++) {
            ctx.strokeStyle = "#AAAAAA";
            if (i === 3 && j === player.hotJ)
                ctx.strokeStyle = "#000000";
            drawRect(j * scale + invOffJ, i * scale + invOffI, scale, scale, "#888888");
            if (player.inv[i][j] !== undefined) {
                drawImageSmaller(player.inv[i][j].imageId, j * scale + invOffJ, i * scale + invOffI, scale, scale);
            }
        }
    }
    // draw crafting table
    if (dispInv) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                ctx.strokeStyle = "#AAAAAA";
                drawRect(j * scale + craOffJ, i * scale + craOffI, scale, scale, "#888888");
                if (craftTable[i][j] !== undefined) {
                    drawImageSmaller(craftTable[i][j].imageId, j * scale + craOffJ, i * scale + craOffI, scale, scale);
                }
            }
        }
    }
    // draw dragging
    if (isDrag && dispInv) {
        var invJ = floor((dragX - invOffJ) / scale);
        var invI = floor((dragY - invOffI) / scale);
        if (bd(invI, invJ) && player.inv[invI][invJ] !== undefined) {
            ctx.globalAlpha = 0.7;
            drawImage(player.inv[invI][invJ].imageId, mouseX - scale / 2, mouseY - scale / 2, scale, scale);
            ctx.globalAlpha = 1;
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
