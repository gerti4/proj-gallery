'use strict'

// Pieces Types
var KING_WHITE = '♔';
var QUEEN_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var KING_BLACK = '♚';
var QUEEN_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

// build the board 8 * 8
function buildBoard() {
    var board = [];
    for (var i = 0; i < 8; i++) {
        board[i] = [];
        for (var j = 0; j < 8; j++) {
            board[i][j] = ''
            if (i === 1) board[i][j] = PAWN_BLACK;
            if (i === 6) board[i][j] = PAWN_WHITE;
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = QUEEN_BLACK;
    board[0][4] = KING_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = QUEEN_WHITE;
    board[7][4] = KING_WHITE;

    console.table(board);
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // Figure class name
            var className = ((i + j) % 2 === 0) ? 'bright' : 'dark';
            var tdId = `cell-${i}-${j}`;
            strHtml += `<td id="${tdId}" onclick="cellClicked(this)" class="${className}">
                            ${cell}
                        </td>`;
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard();
        return;
    }
    cleanBoard();

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    // console.log('elCell.id: ', elCell.id);
    var cellCoord = getCellCoord(elCell.id);
    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    var fromCoord = getCellCoord(elFromCell.id)
    var toCoord = getCellCoord(elToCell.id)
    // console.log('from', fromCoord, 'to', toCoord);
    // update the MODEl
    var piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j] = piece;

    //update the DOM
    elFromCell.innerText = '';
    elToCell.innerText = piece;
}

function markCells(coords) {

    // TODO: query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        // var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
        var elCell = document.querySelector(getSelector(coord));
        elCell.classList.add('mark')
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    coord.i = +parts[1]
    coord.j = +parts[2];
    // console.log('coord', coord);
    return coord;
}
function cleanBoard() {
    var tds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < tds.length; i++) {
        tds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];

    var diff = (isWhite) ? -1 : 1;
    var coord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    if (isEmptyCell(coord)) res.push(coord);
    else return;

    if (isWhite && pieceCoord.i === 6 || !isWhite && pieceCoord.i === 1) {
        coord = { i: pieceCoord.i + diff + diff, j: pieceCoord.j }
        if (isEmptyCell(coord)) res.push(coord);
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = []; //get possible postions for rook.
    //moving up
    var j = pieceCoord.j;
    for (var i = pieceCoord.i - 1; i >= 0; i--) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    //moving down
    var j = pieceCoord.j;
    for (var i = pieceCoord.i + 1; i < gBoard.length; i++) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    //moving left
    var i = pieceCoord.i;
    for (var j = pieceCoord.j - 1; j >= 0; j--) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    //moving right
    var i = pieceCoord.i;
    for (var j = pieceCoord.j + 1; j < gBoard.length; j++) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}



function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    //moving up right
    var i = pieceCoord.i - 1;
    for (var j = pieceCoord.j + 1; i >= 0 && j < 8; j++ , i--) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    //moving down right
    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j + 1; i < 8 && j < 8; j++ , i++) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    //moving up left
    var i = pieceCoord.i - 1;
    for (var j = pieceCoord.j - 1; i >= 0 && j >= 0; j-- , i--) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    //moving down left
    i = pieceCoord.i + 1;
    for (var j = pieceCoord.j - 1; i < 8 && j >= 0; j-- , i++) {
        var coord = { i: i, j: j };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}


function getAllPossibleCoordsKing(pieceCoord) {

    var res = []; //get possible postions for king
    var i = pieceCoord.i;
    var j = pieceCoord.j;
    var coord;

    // moving down
    if ((i + 1) < 8) {
        coord = { i: (i + 1), j: j };
        if (isEmptyCell(coord)) res.push(coord);
    }
    // moving right
    if (j + 1 < 8) {
        coord = { i: i, j: j + 1 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    // moving up
    if (i - 1 >= 0) {
        coord = { i: i - 1, j: j };
        if (isEmptyCell(coord)) res.push(coord);
    }
    //moving left
    if (j - 1 >= 0) {
        coord = { i: i, j: j - 1 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    return res;
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var res = [];
    var resRook = getAllPossibleCoordsRook(pieceCoord);
    var resBishop = getAllPossibleCoordsBishop(pieceCoord);
    res = resRook.concat(resBishop);
    return res;
}


function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];
    var opts1 = knightMoveOpt1(pieceCoord);
    var opts2 = knightMoveOpt2(pieceCoord);
    res = opts1.concat(opts2);
    return res;
}

function knightMoveOpt1(pieceCoord) {
    var res = [];
    var i = pieceCoord.i;
    var j = pieceCoord.j;
    var coord;
    // moving up right
    if (i - 2 >= 0 && j + 1 < 8) {
        coord = { i: i - 2, j: j + 1 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    //moving up left
    if (i - 2 >= 0 && j - 1 >= 0) {
        coord = { i: i - 2, j: j - 1 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    // moving down right
    if (i + 2 < 8 && j + 1 < 8) {
        coord = { i: i + 2, j: j + 1 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    // moving down left
    if (i + 2 < 8 && j - 1 >= 0) {
        coord = { i: i + 2, j: j - 1 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    return res;
}

function knightMoveOpt2(pieceCoord) {
    var res = [];
    var i = pieceCoord.i;
    var j = pieceCoord.j;
    var coord;
    // moving down left
    if (j - 2 >= 0 && i + 1 < 8) {
        coord = { i: i + 1, j: j - 2 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    //moving up left
    if (j - 2 >= 0 && i - 1 >= 0) {
        coord = { i: i - 1, j: j - 2 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    // moving down right
    if (j + 2 < 8 && i + 1 < 8) {
        coord = { i: i + 1, j: j + 2 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    // moving up right
    if (j + 2 < 8 && i - 1 >= 0) {
        coord = { i: i - 1, j: j + 2 };
        if (isEmptyCell(coord)) res.push(coord);
    }
    return res;
}