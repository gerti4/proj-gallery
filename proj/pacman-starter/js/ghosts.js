var GHOST = '&#9781;';

var gIntervalGhosts;
var gGhosts;

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor(),
        weak: '#FFFFFF',
        isWeak: false
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}


function createGhosts(board) {
    gGhosts = [];

    // empty the gGhosts array, create some ghosts
    createGhost(board)
    createGhost(board)
    createGhost(board)

    // moveGhosts();
    //  and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1800)
}

function moveGhosts() {

    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation = { i: ghost.location.i + moveDiff.i, j: ghost.location.j + moveDiff.j }

        // if WALL return
        if (SIZE[nextLocation.i][nextLocation.j] === WALL) return

        if (SIZE[nextLocation.i][nextLocation.j] === PACMAN && gPacman.isSuper) {
            removeGhosts(ghost.location);
            return;
        }

        // if PACMAN - gameOver, return
        if (SIZE[nextLocation.i][nextLocation.j] === PACMAN) {            
            collision(ghost.location)
            gameOver()
            return
        }
        // if GHOST - give up
        if (SIZE[nextLocation.i][nextLocation.j] === GHOST) {
            return
        }

        // set back what we stepped on: update Model, DOM
        SIZE[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)

        // move the ghost
        ghost.location = nextLocation

        // keep the contnet of the cell we are going to
        ghost.currCellContent = SIZE[nextLocation.i][nextLocation.j]

        // move the ghost and update model and dom
        SIZE[ghost.location.i][ghost.location.j] = GHOST
        if (gPacman.isSuper) renderCell(ghost.location, getGhostHTML(ghost, ghost.weak))
        else renderCell(ghost.location, getGhostHTML(ghost, ghost.color));
    }
}
function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghost, color) {
    return `<span style="color: ${color};">${GHOST}</span>`
}

function changeGhostsColor(isPacmanSuper) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (isPacmanSuper) {
            renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i], gGhosts[i].weak));
        }
        else {
            renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i], gGhosts[i].color));
        }
    }
}

function removeGhosts(ghostCell) {
    var ghostIdx;    
    
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === ghostCell.i &&
            gGhosts[i].location.j === ghostCell.j)
            ghostIdx = i;
    }
    updateScoreFromGohst(gGhosts[ghostIdx]);
    SIZE[gGhosts[ghostIdx].location.i][gGhosts[ghostIdx].location.j] = gGhosts[ghostIdx].currCellContent;
    renderCell(gGhosts[ghostIdx].location,gGhosts[ghostIdx].currCellContent);
    gGhosts.splice(ghostIdx, 1);

    moveGhosts();
}


function updateScoreFromGohst(ghost){
    if(ghost.currCellContent === FOOD) updateScore(1);
    else if(ghost.currCellContent === CHERRY) updateScore(11);
}






