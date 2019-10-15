var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';
var GLUE_IMG = '<img src="img/glue.png">'

var gGamerPos;
var gBoard;
var gBallsInBoard = 0;
var gCountBalls = 0;
var gIsStuck = false;
var gCreateBallInterval;
var gCreateGlueInterval;


function buildBoard() {
	// Create Matrix of 10 rows 
	var board = new Array(10);

	for (var i = 0; i < board.length; i++) {
		//Matrix with 12 cols
		board[i] = new Array(12);
	}

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR everywhere
			board[i][j] = { type: 'FLOOR', gameElement: null }
			// 	Put Wall at edges
			if (i === 0 || j === 0 ||
				i === board.length - 1 ||
				j === board[0].length - 1) {
				board[i][j].type = WALL;
			}
			// Put Hols in specific cells
			if (checkHolCell(i, j)) {
				board[i][j] = { type: 'FLOOR', gameElement: null }
			}
		}
	}
	return board;
}

function checkHolCell(i, j) {
	if (i === 0 && j === 5 ||
		i === 5 && j === 0 ||
		i === 5 && j === 11 ||
		i === 9 && j === 5)
		return true;
	return false;
}



// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j }) // e.g. - cell-3-8

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gIsStuck) return;
	var isInTheHol = checkHolCell(gGamerPos.i, gGamerPos.j)
	if (isInTheHol) {
		if (j < 0) j = gBoard[0].length - 1;
		else if (j >= gBoard[0].length) j = 0;
		else if (i >= gBoard.length) i = 0;
		else if (i < 0) i = gBoard.length - 1;
	}


	var targetCell = gBoard[i][j];


	if (targetCell.type === WALL) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);



	// If the clicked Cell is one of the four allowed
	// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
	if (iAbsDiff + jAbsDiff === 1 || isInTheHol) {
		if (targetCell.gameElement === BALL) {
			gCountBalls++;
			renderBallCount();
			if (isVictory()) finishGame();
		}
		if (targetCell.gameElement === GLUE) stuckInGlue();

		// Update the MODEL and DOM
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;

		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);

	} else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

function stuckInGlue() {
	gIsStuck = true;
	setTimeout(function () {
		gIsStuck = false;
	}, 3000);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	if (gIsStuck) return;
	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function init() {
	gBoard = buildBoard();
	renderBoard(gBoard);
	renderGamer();
	renderBalls();
	gCreateBallInterval = setInterval(renderBalls, 2500);
	gCreateGlueInterval = setInterval(renderGlue, 5000);
}

function renderBallCount() {
	var elHead = document.querySelector('h1');
	elHead.innerText = `You collected ${gCountBalls} balls`;
}

function isVictory() {
	if (gCountBalls === gBallsInBoard) {
		clearInterval(gCreateGlueInterval);
		clearInterval(gCreateBallInterval);
		return true;
	}
}

function finishGame() {
	var elHead = document.querySelector('h1');
	elHead.innerText = 'Congratulation you collected all the balls!'
	var elRestart = document.querySelector('.restart');
	elRestart.style.display = 'block';
	gCountBalls = 0;
	gBallsInBoard = 0;
}

function restartGame(elRestart) {
	init();
	elRestart.style.display = 'none';
}


function renderBalls() {
	var ballInCell = getRandomCell();
	renderCell(ballInCell, BALL_IMG);
	gBoard[ballInCell.i][ballInCell.j].gameElement = BALL;
	gBallsInBoard++;
}



function renderGamer() {
	var gamerCell = getRandomCell();
	renderCell(gamerCell, GAMER_IMG);
	gGamerPos = { i: gamerCell.i, j: gamerCell.j };
}



function renderGlue() {
	var glueCell = getRandomCell();
	renderCell(glueCell, GLUE_IMG);
	gBoard[glueCell.i][glueCell.j].gameElement = GLUE;
	setTimeout(function () {
		if (!gIsStuck) {
			gBoard[glueCell.i][glueCell.j].gameElement = null;
			renderCell(glueCell, '');
		}
	}, 3000);

}


function getRandomCell() {
	var i = getRandomInt(1, gBoard.length - 2);
	var j = getRandomInt(1, gBoard[0].length - 2);
	while (gBoard[i][j].gameElement) {
		i = getRandomInt(1, gBoard.length - 2);
		j = getRandomInt(1, gBoard[0].length - 2);
	}
	var cell = { i: i, j: j };
	return cell;

}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}