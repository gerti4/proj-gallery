'use strict'
var PLACE_FOR_CHERRY = true;


var gIntervalCherry;

function createCherry(board) {
    if (PLACE_FOR_CHERRY) {
        var cherryCell = searchEmptyPos(board);
        if (!cherryCell) {
            clearInterval(gIntervalCherry);
            PLACE_FOR_CHERRY = false;
            return;
        }
        board[cherryCell.i][cherryCell.j] = CHERRY;
        renderCell(cherryCell, CHERRY);
        gFoodCountBoard += 10;
    }
}

function putsCherry(board) {
    gIntervalCherry = setInterval(createCherry, 5000, board);
}

function searchEmptyPos(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = i; j < board.length; j++) {
            if (board[i][j] === FOOD) emptyCells.push({ i: i, j: j })
        }
    }
    shuffle(emptyCells);
    return emptyCells[0];
}