var gPacman;
var PACMAN_IMG = "img/pacman.png";
var PACMAN = `<img class="pacman" src=${PACMAN_IMG}>`;



function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false,
    direction: 'goRight'
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  console.log('Score is:',gGame.score,'food on board;',gFoodCountBoard);
  
  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = SIZE[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;


  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    updateScore(1);


  }
  else if (nextCell === POWER_FOOD) {
    updateScore(1);
    gPacman.isSuper = true;
    superPower();
    changeGhostsColor(gPacman.isSuper);
    setTimeout(function () {
      gPacman.isSuper = false;
      superPower();
      changeGhostsColor(gPacman.isSuper);
    }, 5000)
  }
  else if (nextCell === CHERRY) {
    updateScore(11);
  }
  else if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      removeGhosts(nextLocation);
    }
    else {
      collision(nextLocation);
      printMsg(true,false);
      gameOver();
      return;
    }
  }
  if (checkVictorious()) {
    printMsg(true,true);
    gameOver();
  }


  // Update the model
  SIZE[gPacman.location.i][gPacman.location.j] = EMPTY;

  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // change pacman direction
  pacmanSetDirection(nextLocation);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  SIZE[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);

}




function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      break;
    default: return null;
  }

  return nextLocation;
}


function checkVictorious() {
  return gGame.score === gFoodCountBoard;
}




function pacmanSetDirection(pos) {

  if (pos.i < gPacman.location.i) gPacman.direction='goUp';
  if (pos.i > gPacman.location.i) gPacman.direction='goDown';
  if (pos.j > gPacman.location.j) gPacman.direction='goRight';
  if (pos.j < gPacman.location.j) gPacman.direction="goLeft";

  if(gPacman.isSuper) 
  PACMAN = `<img class="pacman ${gPacman.direction} super" src=${PACMAN_IMG}>`;
  else 
    PACMAN = `<img class="pacman ${gPacman.direction}" src=${PACMAN_IMG}>`;
}


function collision(posColl) {
  var elPacman = document.querySelector(`.pacman`);
  var elGhost = document.querySelector(`.cell${posColl.i}-${posColl.j}`);
  elPacman.classList.add('collision');
  elGhost.classList.add('collision');
}


function superPower() {
  if (gPacman.isSuper)
    PACMAN = `<img class="pacman ${gPacman.direction} super" src=${PACMAN_IMG}>`
  else 
    PACMAN = `<img class="pacman ${gPacman.direction}" src=${PACMAN_IMG}>`
  renderCell(gPacman.location,PACMAN);
}
