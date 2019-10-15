'use strict';
var WALL = '#';
var FOOD = '.';
var EMPTY = ' ';
var POWER_FOOD = '<img src="img/strawberry.png">';
var CHERRY = '<img class="cherry" src="img/candy.png">';



var gFoodCountBoard = 0;

var SIZE;
var gGame = {
  score: 0,
  isOn: false,
};

function init() {
  SIZE = buildBoard();
  createPacman(SIZE);
  createGhosts(SIZE);
  putsCherry(SIZE);
  printMat(SIZE, '.board-container');
  gGame.isOn = true;
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;
      // curr cel is store food
      gFoodCountBoard++;
      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {
        board[i][j] = WALL;
        // curr cell is a wall and not food
        gFoodCountBoard--;
      }
      if (i === 1 && j === SIZE - 2 ||
        i === 1 && j === 1 ||
        i === SIZE - 2 && j === 1 ||
        i === SIZE - 2 && j === SIZE - 2) {
        board[i][j] = POWER_FOOD;
      }
    }
  }
  // One cell tooken for pacman.
  gFoodCountBoard -= 1;
  return board;
}

function updateScore(value) {
  // Update the model and the Dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}


function gameOver() {
  gGame.isOn = false;
  var elEndGameBut = document.querySelector('.end-game');
  elEndGameBut.style.display = 'block';
  clearInterval(gIntervalGhosts);
  clearInterval(gIntervalCherry);
  gIntervalGhosts = null;
}

function printMsg(showMsg, isWon = false) {
  var elHead = document.querySelector('.msg');
  if (!showMsg) elHead.style.display = 'none';
  else {
    var headMsg = (isWon) ? 'You Win!' : 'You lose!';
    elHead.innerText = headMsg;
    elHead.style.display = 'block';
  }
}

function restartGame(elRestart) {
  gGame.score = 0;
  gFoodCountBoard = 0;
  printMsg(false);
  updateScore(gGame.score);
  elRestart.style.display = 'none';
  init();
}





