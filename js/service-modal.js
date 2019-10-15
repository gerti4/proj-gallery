'use strict'

const PROJ_KEY = 'proj';

var gProjs = createProjs();



function createProj(gameName, imgUrl , link) {
    var game = {
        name: gameName,
        details: "good game",
        date: Date.now(),
        img: imgUrl,
        link,
        reviews: [],
    }
    return game;
}


function createProjs() {
    var projs;
    if (localStorage.getItem(PROJ_KEY)) projs = loadProjsFromStorage(PROJ_KEY);
    else {
        projs = {
            games: createGames(),
            webs: createWebs()
        }
        saveProjsToLocalStorage(PROJ_KEY, projs);
    }
    return projs;
}


function createWebs() {
    var webs = [
        createProj('Live-page flex', 'img/web-page/page-flex.png','proj/live-page/index.html'),
        createProj('Live-page Grid', 'img/web-page/page-grid.png','proj/Site-no-grid/index.html')
    ];
    return webs;
}

function createGames() {
    var games = [createProj('collect-balls', 'img/board-games/collect-balls.png' ,'proj/ball-board-proj/index.html'),
    createProj('chess', 'img/board-games/chess.png','proj/chess-proj/index.html'),
    createProj('Pacman', 'img/board-games/pacmen.png','proj/pacman-starter/index.html')];
    return games;
}

function getCurrProj(type,currProj){    
    if (currProj >= gProjs[type].length) currProj = 0;
    else if (currProj < 0) currProj = gProjs[type].length - 1;
    return currProj;
}


function getProjToShow(type, currProj) {
    return gProjs[type][currProj]
}



function saveProjsToLocalStorage(PROJ_KEY, gProjs) {
    localStorage.setItem(PROJ_KEY, JSON.stringify(gProjs));
}

function loadProjsFromStorage(PROJ_KEY) {
    var str = localStorage.getItem(PROJ_KEY);
    var value = JSON.parse(str);
    return value;
}