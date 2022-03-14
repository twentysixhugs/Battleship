/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/dom/battlefield.js":
/*!****************************************!*\
  !*** ./src/modules/dom/battlefield.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearBattlefields": () => (/* binding */ clearBattlefields),
/* harmony export */   "fillBattlefieldsWithCells": () => (/* binding */ fillBattlefieldsWithCells),
/* harmony export */   "showHitAtShip": () => (/* binding */ showHitAtShip),
/* harmony export */   "showMissedAttack": () => (/* binding */ showMissedAttack),
/* harmony export */   "showPlayerShips": () => (/* binding */ showPlayerShips),
/* harmony export */   "showShip": () => (/* binding */ showShip),
/* harmony export */   "showSunkShip": () => (/* binding */ showSunkShip)
/* harmony export */ });
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../input */ "./src/modules/input.js");

/* Cells generation and clearing */

function fillBattlefieldsWithCells() {
  const playerBattlefield = document.querySelector('.js-player-battlefield');
  const computerBattlefield = document.querySelector('.js-computer-battlefield');

  fillWithCells(playerBattlefield, 'js-cell--player', 'js-cell');
  fillWithCells(computerBattlefield, 'js-cell--computer', 'js-cell');
}

function fillWithCells(battlefield, ...jsClassNames) {
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      battlefield.appendChild(_createCell([j, i], jsClassNames));
    }
  }

  function _createCell(coordinate, jsClassNames) {
    const cell = document.createElement('div');
    cell.classList.add('gameboard__cell', ...jsClassNames);
    cell.dataset.coordinate = coordinate;

    return cell;
  }
}

function clearBattlefields() {
  const playerBattlefield = document.querySelector('.js-player-battlefield');
  const computerBattlefield = document.querySelector('.js-computer-battlefield');

  playerBattlefield.textContent = "";
  computerBattlefield.textContent = "";
}

/* Response to attack */

function showMissedAttack(coordinate, enemy) {
  const missedAttackDiv = _createAttack('missed');
  const attackedCell = document.querySelector(`.js-cell--${enemy}[data-coordinate="${coordinate}"]`);

  if (!attackedCell) return;

  attackedCell.appendChild(missedAttackDiv);
}

function showHitAtShip(coordinate, enemy) {
  const shipAttackDiv = _createAttack('hit');
  const attackedCell = document.querySelector(`.js-cell--${enemy}[data-coordinate="${coordinate}"]`);

  attackedCell.appendChild(shipAttackDiv);
}

function showSunkShip(coordinate) {

}

function _createAttack(attackResult) {
  const div = document.createElement('div');
  div.classList.add(`gameboard__${attackResult}`);

  return div;
}

/* Ships highlighting */

function showPlayerShips() {
  const playerShipsCoordinates =
    _input__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerShips()
      .map(ship => ship.getCoordinates());

  playerShipsCoordinates.forEach(showShip);
}

function showShip(coordinates) {
  const firstCoordinate = coordinates[0];
  const cell = document.querySelector(`.js-cell[data-coordinate="${firstCoordinate}"]`);

  const ship = document.createElement('div');
  ship.classList.add('ship', `ship--${coordinates.length}`);
  cell.appendChild(ship);
}



/***/ }),

/***/ "./src/modules/dom/current_player.js":
/*!*******************************************!*\
  !*** ./src/modules/dom/current_player.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "computerTurn": () => (/* binding */ computerTurn),
/* harmony export */   "playerTurn": () => (/* binding */ playerTurn)
/* harmony export */ });
function playerTurn() {

}

function computerTurn() {

}



/***/ }),

/***/ "./src/modules/dom/game_state.js":
/*!***************************************!*\
  !*** ./src/modules/dom/game_state.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _current_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./current_player */ "./src/modules/dom/current_player.js");
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../player_manager */ "./src/modules/player_manager.js");



const UIGameState = (() => {
  let _currentPlayer;
  let _isStartGame = true;

  /* Game start */

  function startGame() {
    _currentPlayer = 'player';
    _toggleStartGameInterfaceVisibility();
    _disableStartGameInterface();
    _toggleBoardDescriptions();
    (0,_current_player__WEBPACK_IMPORTED_MODULE_0__.playerTurn)();
  }

  function stopGame() {
    removeAllMoveListeners();
  }

  function showGameResult(isPlayerWinner) {
    if (isPlayerWinner) {
      _showPlayerVictory();
    } else {
      _showPlayerDefeat();
    }
  }

  function _showPlayerVictory() {
    toggleResult();
    const result = document.querySelector('.js-result');
    result.textContent = 'Victory!';
  }

  function _showPlayerDefeat() {
    toggleResult();
    const result = document.querySelector('.js-result');
    result.textContent = 'Defeat!';
  }

  function toggleResult() {
    const resultContainer = document.querySelector('.js-container--result');
    resultContainer.classList.toggle('is-visible');
  }

  /* Game restart */

  function showRestart() {
    _toggleStartGameInterfaceVisibility();
    _toggleBoardDescriptions();
  }

  /* Player and computer move */

  /* The promises are resolved once the cell is clicked */
  /* The outer module, game, will await for the promise to resolve, */
  /* And the move captured in this module will be handled */

  function playerMove(player) {
    removeAllMoveListeners();

    return new Promise((resolve, reject) => {
      _addMoveListenerForEnemyCells(resolve, '.js-cell--computer');
    });
  }

  function computerMove(computer) {
    removeAllMoveListeners();

    return new Promise((resolve, reject) => {
      _addMoveListenerForEnemyCells(resolve, '.js-cell--player');
      setTimeout(() => {
        computer.makeMove();
      }, 500);
    });
  }

  function _addMoveListenerForEnemyCells(promiseResolveCallback, enemyCellsHTMLClass) {
    const enemyCells = document.querySelectorAll(enemyCellsHTMLClass);

    enemyCells.forEach(cell => cell.addEventListener('click', (e) => {
      if (!e.target.dataset.coordinate) return;
      _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].handleGameboardAttack(e.target.dataset.coordinate);
      promiseResolveCallback();
    }));
  }

  function removeAllMoveListeners() {
    const cellsWithListeners = document.querySelectorAll(`.js-cell--player, .js-cell--computer`);

    cellsWithListeners.forEach(cell => {
      let cellWithoutListener = cell.cloneNode(true);
      cell.parentNode.replaceChild(cellWithoutListener, cell);
    });
  }


  function toggleCurrentPlayer() {
    if (_currentPlayer === 'player') {
      _currentPlayer = 'computer';
      (0,_current_player__WEBPACK_IMPORTED_MODULE_0__.computerTurn)();
    } else {
      _currentPlayer = 'player';
      (0,_current_player__WEBPACK_IMPORTED_MODULE_0__.playerTurn)();
    }
  }

  function _disableStartGameInterface() {
    const buttonsWithListeners = document.querySelectorAll('.js-random, .js-start');

    buttonsWithListeners.forEach(button => {
      let buttonWithoutListener = button.cloneNode(true);
      button.parentNode.replaceChild(buttonWithoutListener, button);
    });
  }

  function _toggleStartGameInterfaceVisibility() {
    const computerGameboard = document.querySelector('.js-computer-gameboard');
    const gameboardButtons = document.querySelectorAll('.js-random, .js-start');

    computerGameboard.classList.toggle('is-visible');
    gameboardButtons.forEach(button => button.classList.toggle('is-visible'));
  }

  function _toggleBoardDescriptions() {
    const descriptions = document.querySelectorAll('.js-description');
    descriptions.forEach(node => node.classList.toggle('is-visible'));
  }

  return {
    startGame,
    stopGame,
    showGameResult,
    toggleResult,
    toggleCurrentPlayer,
    playerMove,
    computerMove,
    showRestart,
    removeAllMoveListeners,
  }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UIGameState);

/***/ }),

/***/ "./src/modules/dom/restart.js":
/*!************************************!*\
  !*** ./src/modules/dom/restart.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addRestartEvent": () => (/* binding */ addRestartEvent)
/* harmony export */ });
function addRestartEvent(callback) {
  const restartBtn = document.querySelector('.js-restart');
  restartBtn.addEventListener('click', callback);
}



/***/ }),

/***/ "./src/modules/dom/start_menu.js":
/*!***************************************!*\
  !*** ./src/modules/dom/start_menu.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addEventsToStartMenuButtons": () => (/* binding */ addEventsToStartMenuButtons)
/* harmony export */ });
function addEventsToStartMenuButtons(startCallback, randomCallback) {
  const start = document.querySelector('.js-start');
  const random = document.querySelector('.js-random')
  start.addEventListener('click', startCallback);
  random.addEventListener('click', randomCallback);
}



/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player_manager */ "./src/modules/player_manager.js");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./input */ "./src/modules/input.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");
/* harmony import */ var _dom_game_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/game_state */ "./src/modules/dom/game_state.js");
/* harmony import */ var _random_ships__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./random_ships */ "./src/modules/random_ships.js");
/* harmony import */ var _dom_battlefield__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom/battlefield */ "./src/modules/dom/battlefield.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helper */ "./src/modules/helper.js");









const Game = (() => {
  let _gameGoing = false;
  let _winner = null;
  let player = null;
  let computer = null;

  function start() {
    _initPlayers();
    _placeShips(player, computer);
    _initUI();

    _gameGoing = true;
    _gameloop();
  }

  function _stop() {
    _gameGoing = false;
    _input__WEBPACK_IMPORTED_MODULE_1__["default"].clear();
  }

  function _initPlayers() {
    player = new _player__WEBPACK_IMPORTED_MODULE_6__.Player('player');
    computer = new _player__WEBPACK_IMPORTED_MODULE_6__.Computer('computer');

    _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].addPlayer(player);
    _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].addPlayer(computer);
    _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].setCurrent(player);
  }

  function _initUI() {
    _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].startGame();
  }

  async function _gameloop() {
    while (_gameGoing) {
      await nextMove();

      const attacker = _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrent();
      const attacked = _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getNotCurrent();

      if (!attacked.gameboard.checkLastAttackSuccessful()) {
        continue;
      }

      if (!attacked.gameboard.checkLastAttackHitShip()) {
        /* If the last attack did not hit a ship */
        _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].toggleCurrent();
        _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].toggleCurrentPlayer();
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showMissedAttack)(attacked.gameboard.getLastAttack(), attacked.name);
      } else {
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showHitAtShip)(attacked.gameboard.getLastAttack(), attacked.name);
      }

      if (attacked.gameboard.checkLastAttackSankShip()) {
        _attackCellsAroundSunkShip(attacked);
      }

      if (attacked.isGameOver()) {
        _stop();
        _winner = attacker;

        _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].stopGame();
        _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].showGameResult(_winner === player ? true : false);
        break;
      }
    }

    async function nextMove() {
      if (_player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrent() === player) {
        await _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].playerMove(player);
      }
      else if (_player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrent() === computer) {
        await _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].computerMove(computer);
      }
    }
  }

  function _placeShips(player, computer) {
    const playerShips = _input__WEBPACK_IMPORTED_MODULE_1__["default"].getPlayerShips();
    const computerShips = _input__WEBPACK_IMPORTED_MODULE_1__["default"].getComputerShips();

    playerShips.forEach(ship => player.gameboard.placeShip(ship));
    computerShips.forEach(ship => computer.gameboard.placeShip(ship));
  }

  function _attackCellsAroundSunkShip(attacked) {
    const sunkShip = attacked.gameboard.getLastAttackedShip();

    const cellsToAttack = (0,_helper__WEBPACK_IMPORTED_MODULE_7__.getCellsSurroundingShip)(sunkShip.getCoordinates());
    cellsToAttack.forEach(cell => {
      attacked.gameboard.receiveAttack(cell);

      if (attacked.gameboard.checkLastAttackSuccessful()) {
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showMissedAttack)(cell, _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerName(attacked));
      }
    });

    _dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].removeAllMoveListeners();
  }

  return {
    start,
  }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./manager */ "./src/modules/manager.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src/modules/helper.js");




function Gameboard() {
  const _length = 10; // 10 x 10 board
  const _ships = [];
  const _missedAttacks = [];
  const _attacks = [];

  this.getLength = function () {
    return _length;
  }

  this.getShips = function () {
    return [..._ships];
  }

  this.getMissedAttacks = function () {
    return [..._missedAttacks];
  }

  this.getAllAttacks = function () {
    return [..._attacks];
  }

  this.getPossibleAttacks = function () {
    return this.getAllCells().filter(cell => !(0,_helper__WEBPACK_IMPORTED_MODULE_1__.stringifyElements)(_attacks).includes(cell.toString()));
  }

  this.getLastAttack = function () {
    return _attacks[_attacks.length - 1];
  }

  this.getLastAttackedShip = function () {
    const lastAttack = this.getLastAttack();

    const lastAttackedShip =
      _ships
        .find(
          ship => ship
            .getCoordinates()
            .some(coordinate => coordinate.toString() === lastAttack.toString())
        );

    return lastAttackedShip;
  }

  this.checkLastAttackHitShip = function () {
    const lastAttack = this.getLastAttack();
    const checkResult = _ships.find(ship => (0,_helper__WEBPACK_IMPORTED_MODULE_1__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString()));

    return (checkResult) ? true : false;
  }

  this.checkLastAttackSankShip = function () {
    const lastAttack = this.getLastAttack();
    const lastShipHit = _ships.find(ship => (0,_helper__WEBPACK_IMPORTED_MODULE_1__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString()));

    return lastShipHit ? lastShipHit.isSunk() : false;
  }

  this.getAllCells = function () {
    const allCells = [];

    for (let i = 1; i <= _length; i++) {
      for (let j = 1; j <= _length; j++) {
        allCells.push([i, j]);
      }
    }

    return [...allCells];
  }


  function _placeMissedAttack(attackCoordinate) {
    _missedAttacks.push(attackCoordinate);
  }

  function _placeAttack(attackCoordinate) {
    _attacks.push(attackCoordinate);
  }

  function _isAttackingAlreadyAttackedCell(attackCoordinateStr) {
    for (const attack of _attacks) {
      if (attack.toString() === attackCoordinateStr) {
        return true;
      }
    }
  }

  this.placeShip = function (ship) {
    _ships.push(ship);
  }

  this.areAllShipsSunk = function () {
    return _ships.every(ship => ship.isSunk());
  }

  let _lastAttackSuccessful;

  this.checkLastAttackSuccessful = function () {
    return _lastAttackSuccessful;
  }

  this.receiveAttack = function (attackCoordinate) {
    /* Check if it does not attack an already attacked coordinate */
    const attackCoordinateStr = attackCoordinate.toString();

    if (_isAttackingAlreadyAttackedCell(attackCoordinateStr)) {
      _lastAttackSuccessful = false;
      return;
    }

    _placeAttack(attackCoordinate);

    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate.toString() === attackCoordinateStr) {
          (0,_manager__WEBPACK_IMPORTED_MODULE_0__.hitShip)(ship, ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
          _lastAttackSuccessful = true;
          return;
        }
      }
    }

    _placeMissedAttack(attackCoordinate);
    _lastAttackSuccessful = true;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/modules/helper.js":
/*!*******************************!*\
  !*** ./src/modules/helper.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "convertElementsToNumbers": () => (/* binding */ convertElementsToNumbers),
/* harmony export */   "getCellsSurroundingCell": () => (/* binding */ getCellsSurroundingCell),
/* harmony export */   "getCellsSurroundingShip": () => (/* binding */ getCellsSurroundingShip),
/* harmony export */   "getPerpendicularCells": () => (/* binding */ getPerpendicularCells),
/* harmony export */   "stringifyElements": () => (/* binding */ stringifyElements)
/* harmony export */ });
function getCellsSurroundingCell(cell) {
  // It may return negative cells that are not on board,
  // but it doesn't matter since they are not used at all
  // All we need to check is whether we can place a ship on
  // an existing cell or not
  return [
    // return everything around this cell

    // above
    [cell[0] - 1, cell[1] - 1],
    [cell[0], cell[1] - 1],
    [cell[0] + 1, cell[1] - 1],

    // right
    [cell[0] + 1, cell[1]],
    //left
    [cell[0] - 1, cell[1]],

    // below
    [cell[0] - 1, cell[1] + 1],
    [cell[0], cell[1] + 1],
    [cell[0] + 1, cell[1] + 1],
  ]
}

function getPerpendicularCells(cell) {
  let cellAbove;
  let cellBelow;
  let cellToTheLeft;
  let cellToTheRight;
  let perpendicularCells = [];

  if (cell[1] > 1) {
    cellAbove = [Number(cell[0]), Number(cell[1]) - 1];
    perpendicularCells.push(cellAbove);
  }

  if (cell[1] < 10) {
    cellBelow = [Number(cell[0]), Number(cell[1]) + 1];
    perpendicularCells.push(cellBelow);
  }

  if (cell[0] < 10) {
    cellToTheRight = [Number(cell[0]) + 1, Number(cell[1])];
    perpendicularCells.push(cellToTheRight);
  }

  if (cell[0] > 1) {
    cellToTheLeft = [Number(cell[0]) - 1, Number(cell[1])];
    perpendicularCells.push(cellToTheLeft);
  }

  return [...perpendicularCells];
}

function stringifyElements(arr) {
  return arr.map(el => el.toString());
}

function convertElementsToNumbers(arr) {
  return arr.map(el => Number(el));
}

function getCellsSurroundingShip(shipCoordinates) {
  const cellsSurroundingShip = shipCoordinates
    .map(getCellsSurroundingCell)
    .flat()

  return cellsSurroundingShip;
}



/***/ }),

/***/ "./src/modules/input.js":
/*!******************************!*\
  !*** ./src/modules/input.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/modules/helper.js");


const Input = (() => {
  let _lastMove;
  let _ships = []; //two-dimensional.

  function setLastMove(coordinate) {
    _lastMove = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.convertElementsToNumbers)(coordinate);
    console.log(_lastMove);
  }

  function getLastMove() {
    return _lastMove;
  }

  function placeShips(ships) {
    _ships.push(ships);
  }

  function getPlayerShips() {
    return _ships[0];
  }

  function getComputerShips() {
    return _ships[1];
  }

  function clear() {
    _lastMove = null;
    _ships = [];
  }

  return {
    setLastMove,
    getLastMove,
    getPlayerShips,
    getComputerShips,
    placeShips,
    clear
  }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Input);

/***/ }),

/***/ "./src/modules/manager.js":
/*!********************************!*\
  !*** ./src/modules/manager.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hitShip": () => (/* binding */ hitShip)
/* harmony export */ });
function hitShip(ship, position) {
  ship.hit(position);
  // TODO: hit in DOM
}



/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Computer": () => (/* binding */ Computer),
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player_manager */ "./src/modules/player_manager.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helper */ "./src/modules/helper.js");





class Player {
  #gameboard;
  #name;

  constructor(name) {
    this.#name = name;
    this.#gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].addPlayer(this);
  }

  get gameboard() {
    return this.#gameboard;
  }

  get name() {
    return this.#name;
  }

  isGameOver() {
    return this.#gameboard.areAllShipsSunk();
  }
}

class Computer extends Player {
  #lastHitAtShip = null;

  #tryingToSinkShip = false; // It will try to sink a ship if it hit it

  #firstHitAtShip = null; // The very first ship's coordinate attacked

  // If the ship is attacked twice, it will determine whether the ship is horizontal or vertical
  #attackDirection = null;

  #hitsAtShip = []; // All hits at the current ship that it is trying to attack and sink
  #guessedShipPositions = []; // It will guess where the ship may be

  constructor(name) {
    super(name);
  }

  /* Getters and setters are for testing purposes only */

  get lastHitAtShip() {
    return this.#lastHitAtShip;
  }

  get tryingToSinkShip() {
    return this.#tryingToSinkShip;
  }

  set lastHitAtShip(value) {
    this.#lastHitAtShip = value;
  }

  set tryingToSinkShip(value) {
    this.#tryingToSinkShip = value;
  }


  makeMove() {
    const possibleAttacks = _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].getPlayerPossibleAttacks(this);

    if (this.#tryingToSinkShip) {
      this.currentAttack = this.#getPotentialAttackToSinkShip(possibleAttacks);
    } else {
      this.currentAttack = this.#getRandomCoordinates(possibleAttacks);
    }

    this.#attackInDOM(this.currentAttack);
    this.defineNextMove();
  }

  #getRandomCoordinates(possibleAttacks) {
    return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
  }

  #getPotentialAttackToSinkShip(allValidAttacks) {
    if (this.#firstHitAtShip.toString() !== this.#lastHitAtShip.toString()) {
      // if computer has already attacked a ship twice or more times,
      // define the direction in which to attack next
      this.#setAttackDirection();
      this.#guessShipPositions();

      const attacksToValidate = [
        ...this.#guessedShipPositions,
      ];

      allValidAttacks = (0,_helper__WEBPACK_IMPORTED_MODULE_2__.stringifyElements)(allValidAttacks);

      const validGuessedAttacks = attacksToValidate.filter(
        attack => allValidAttacks.includes(attack.toString())
      );

      const nextAttack = validGuessedAttacks[Math.floor(Math.random() * validGuessedAttacks.length)];

      return nextAttack;
    } else {
      const cellsWhereMayBeShip = (0,_helper__WEBPACK_IMPORTED_MODULE_2__.getPerpendicularCells)(this.#lastHitAtShip); // Where there might be a ship

      allValidAttacks = (0,_helper__WEBPACK_IMPORTED_MODULE_2__.stringifyElements)(allValidAttacks);

      const validCellsWhereMayBeShip = cellsWhereMayBeShip.filter(
        cell => allValidAttacks.includes(cell.toString())
      );

      return validCellsWhereMayBeShip[Math.floor(Math.random() * validCellsWhereMayBeShip.length)];
    }
  }

  #setAttackDirection() {
    if (this.#firstHitAtShip[0] - this.#lastHitAtShip[0] === 0) {
      this.#attackDirection = 'vertical';
    }

    if (this.#firstHitAtShip[1] - this.#lastHitAtShip[1] === 0) {
      this.#attackDirection = 'horizontal';
    }
  }

  #guessShipPositions() {
    this.#hitsAtShip.forEach(hit => {
      if (this.#attackDirection === 'vertical') {
        this.#guessedShipPositions.push(
          [Number(hit[0]), Number(hit[1]) - 1],
          [Number(hit[0]), Number(hit[1]) + 1],
        )
      }

      if (this.#attackDirection === 'horizontal') {
        this.#guessedShipPositions.push(
          [Number(hit[0]) - 1, Number(hit[1])],
          [Number(hit[0]) + 1, Number(hit[1])],
        )
      }
    })
  }

  #attackInDOM(attack) {
    document.querySelector(`.js-cell--player[data-coordinate="${attack}"]`).click();
  }

  defineNextMove() {
    if (
      _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].checkLastAttackAtEnemyHitShip() && !_player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].checkLastAttackAtEnemySankShip()
    ) {
      this.#defineNextMoveAsShipAttack();
    } else if (_player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].checkLastAttackAtEnemySankShip()) {
      this.#defineNextMoveAsRandomAttack();
    }
  }

  #defineNextMoveAsShipAttack() {
    const lastAttack = _player_manager__WEBPACK_IMPORTED_MODULE_1__["default"].getLastAttackAtEnemy();
    if (!this.#lastHitAtShip) {
      // if it is first attack at the ship (it wasn't attacked before and last hit is falsy)
      this.#firstHitAtShip = lastAttack;
    }
    this.#tryingToSinkShip = true;
    this.#lastHitAtShip = lastAttack;
    this.#hitsAtShip.push(lastAttack);
  }

  #defineNextMoveAsRandomAttack() {
    this.#tryingToSinkShip = false;
    this.#lastHitAtShip = null;
    this.#attackDirection = null;
    this.#hitsAtShip = [];
    this.#guessedShipPositions = [];
  }
}




/***/ }),

/***/ "./src/modules/player_manager.js":
/*!***************************************!*\
  !*** ./src/modules/player_manager.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");


const PlayerManager = (() => {
  let _current;
  let _players = [];

  function addPlayer(player) {
    if (_players.length === 2) {
      _players = []; // no more than two players are stored
    }
    _players.push(player);
  }

  function toggleCurrent() {
    _current = getNotCurrent();
  }

  function setCurrent(player) {
    _current = player;
  }

  function getCurrent() {
    return _current;
  }

  function getPlayerName(player) { // Need for DOM classes
    return (player instanceof _player__WEBPACK_IMPORTED_MODULE_0__.Computer) ? 'computer' : 'player';
  }

  function getNotCurrent() {
    return (_current === _players[0]) ? _players[1] : _players[0];
  }

  function getPlayerPossibleAttacks(player) {
    // Finds the enemy player and gets the possible attacks from their gameboard
    return _players.find(_player => _player !== player).gameboard.getPossibleAttacks();
  }

  function getLastAttackAtEnemy() {
    const enemy = getNotCurrent();
    return enemy.gameboard.getLastAttack();
  }

  function checkLastAttackAtEnemyHitShip() {
    const enemy = getNotCurrent();
    return enemy.gameboard.checkLastAttackHitShip();
  }

  function checkLastAttackAtEnemySankShip() {
    const enemy = getNotCurrent();
    return enemy.gameboard.checkLastAttackSankShip();
  }

  function handleGameboardAttack(coordinates) {
    if (!coordinates) return;

    const enemy = getNotCurrent();
    enemy.gameboard.receiveAttack(coordinates.split(','));
  }

  return {
    setCurrent,
    getCurrent,
    getNotCurrent,
    getPlayerName,
    toggleCurrent,
    addPlayer,
    getPlayerPossibleAttacks,
    handleGameboardAttack,
    checkLastAttackAtEnemyHitShip,
    checkLastAttackAtEnemySankShip,
    getLastAttackAtEnemy
  }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlayerManager);

/***/ }),

/***/ "./src/modules/random_ships.js":
/*!*************************************!*\
  !*** ./src/modules/random_ships.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "generateShipsRandomly": () => (/* binding */ generateShipsRandomly)
/* harmony export */ });
/* harmony import */ var _ship_validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship_validator */ "./src/modules/ship_validator.js");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./input */ "./src/modules/input.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");





function generateShipsForBothPlayers() {
  generateShipsRandomly();
  generateShipsRandomly();
}

function generateShipsRandomly() {
  const readyShips = [
  ];

  const carrier = getValidShip(4, readyShips);
  readyShips.push(carrier);

  for (let i = 0; i < 2; i++) {
    const battleship = getValidShip(3, readyShips);
    readyShips.push(battleship);
  }

  for (let i = 0; i < 3; i++) {
    const cruiser = getValidShip(2, readyShips);
    readyShips.push(cruiser);
  }

  for (let i = 0; i < 4; i++) {
    const patrolBoat = getValidShip(1, readyShips);
    readyShips.push(patrolBoat);
  }

  _input__WEBPACK_IMPORTED_MODULE_1__["default"].placeShips(readyShips);
}

function getValidShip(shipLength, allShips) {
  while (true) {
    const generatedShip = generateShip(shipLength);

    if ((0,_ship_validator__WEBPACK_IMPORTED_MODULE_0__.validateRelativeShipPlacement)(generatedShip, allShips)) {
      return generatedShip;
    }
  }
}

function generateShip(shipLength) {
  const validCells = (0,_ship_validator__WEBPACK_IMPORTED_MODULE_0__.getValidPlacementCells)(shipLength);

  const firstCoordinate = validCells[Math.floor(Math.random() * validCells.length)];
  const coordinateX = firstCoordinate[0];
  const coordinateY = firstCoordinate[1];

  const shipCoordinates = [[...firstCoordinate]];

  for (let i = 1; i < shipLength; i++) { // go from the second coordinate
    shipCoordinates.push([coordinateX + i, coordinateY]);
  }

  return new _ship__WEBPACK_IMPORTED_MODULE_2__["default"](...shipCoordinates);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateShipsForBothPlayers);


/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Ship(...coordinates) {
  /* Coordinates are ship's location on board */
  /* They are received and not created here. Look like [2, 3] */
  /* Positions are ship's inner handling of these coordinates */
  /* Positions are used when deciding where the ship is hit, */
  /* Whether or not it is sunk, and where exactly */
  /* To hit the ship in the first place */

  const _positions = _createPositions(coordinates.length);

  const _coordinates = coordinates;

  this.getCoordinates = function () {
    return [..._coordinates];
  }

  this.getPosition = function (position) {
    return _positions[position];
  }

  this.isSunk = function () {
    if (_positions.every(position => position.isHit)) {
      return true;
    }

    return false;
  }

  /* Hit one of ship's positions */
  this.hit = function (position) {
    _positions[position].isHit = true;
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);


function _createPositions(length) {
  class Position {
    constructor() {
      this.isHit = false;
    }
  }

  const positions = [];

  for (let i = 0; i < length; i++) {
    positions.push(new Position());
  }

  return positions;
}

/***/ }),

/***/ "./src/modules/ship_validator.js":
/*!***************************************!*\
  !*** ./src/modules/ship_validator.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getValidPlacementCells": () => (/* binding */ getValidPlacementCells),
/* harmony export */   "validateRelativeShipPlacement": () => (/* binding */ validateRelativeShipPlacement)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/modules/helper.js");


/* The purpose of this module is to not allow to place ships */
/* Adjacent to each other. There must be some space between them */

/* First, it defines whether or not the placement is valid relative to other ships on board */
/* Second, it checks whether or not the coordinates are not outside the battlefield */

function validateRelativeShipPlacement(validatedShip, ships) {
  /* Validate against other ships */

  const shipCells =
    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(validatedShip.getCoordinates());

  const adjacentShipCoordinates =
    (0,_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(getAdjacentShipCoordinates(ships));

  if (shipCells.some(cell => adjacentShipCoordinates.includes(cell))) {
    return false;
  }

  return true;
}


function getAdjacentShipCoordinates(ships) {
  const adjacentShipCoordinates = ships
    .map(ship => {
      const shipCoordinates = ship.getCoordinates();
      return (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getCellsSurroundingShip)(shipCoordinates);
    })
    .flat();

  ships.forEach(ship => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach(coordinate => adjacentShipCoordinates.push((0,_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(coordinate)));
  });

  return adjacentShipCoordinates;
}

function getValidPlacementCells(validatedShipLength) {
  const validPlacementCells = [];

  switch (validatedShipLength) {
    case 4: {
      validPlacementCells.push(...getCellsValidForShipFour());
      break;
    }
    case 3: {
      validPlacementCells.push(...getCellsValidForShipThree());
      break;
    }
    case 2: {
      validPlacementCells.push(...getCellsValidForShipTwo());
      break;
    }
    case 1: {
      validPlacementCells.push(...getAllBoard());
      break;
    }
  }

  return validPlacementCells;
}

function getCellsValidForShipFour() {
  const validCells = [];

  for (let x = 1; x <= 7; x++) {
    for (let y = 1; y < 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipThree() {
  const validCells = [];

  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y < 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipTwo() {
  const validCells = [];

  for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getAllBoard() {
  const allBoard = [];

  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      allBoard.push([x, y]);
    }
  }

  return allBoard;
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dom/battlefield */ "./src/modules/dom/battlefield.js");
/* harmony import */ var _modules_dom_start_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/dom/start_menu */ "./src/modules/dom/start_menu.js");
/* harmony import */ var _modules_dom_restart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/dom/restart */ "./src/modules/dom/restart.js");
/* harmony import */ var _modules_dom_game_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/dom/game_state */ "./src/modules/dom/game_state.js");
/* harmony import */ var _modules_game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/game */ "./src/modules/game.js");
/* harmony import */ var _modules_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/input */ "./src/modules/input.js");
/* harmony import */ var _modules_random_ships__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/random_ships */ "./src/modules/random_ships.js");









(() => {
  initGame();
  (0,_modules_dom_restart__WEBPACK_IMPORTED_MODULE_2__.addRestartEvent)(receiveRestart);
})();

function initGame() {
  _modules_input__WEBPACK_IMPORTED_MODULE_5__["default"].clear();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.clearBattlefields)();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.fillBattlefieldsWithCells)();
  (0,_modules_random_ships__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.showPlayerShips)();
  (0,_modules_dom_start_menu__WEBPACK_IMPORTED_MODULE_1__.addEventsToStartMenuButtons)(receiveStart, receiveRandom);
}

function receiveStart() {
  _modules_game__WEBPACK_IMPORTED_MODULE_4__["default"].start();
}

function receiveRestart() {
  _modules_dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].toggleResult();
  _modules_dom_game_state__WEBPACK_IMPORTED_MODULE_3__["default"].showRestart();
  initGame();
}

function receiveRandom() {

}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZtQztBQUNvQztBQUNmOztBQUVMO0FBQ2pCO0FBQ0U7QUFDNkI7O0FBRWpFO0FBQ0E7QUFDQSxFQUFFLHFFQUFlO0FBQ2pCLENBQUM7O0FBRUQ7QUFDQSxFQUFFLDREQUFXO0FBQ2IsRUFBRSwyRUFBaUI7QUFDbkIsRUFBRSxtRkFBeUI7QUFDM0IsRUFBRSxpRUFBMkI7QUFDN0IsRUFBRSx5RUFBZTtBQUNqQixFQUFFLG9GQUEyQjtBQUM3Qjs7QUFFQTtBQUNBLEVBQUUsMkRBQVU7QUFDWjs7QUFFQTtBQUNBLEVBQUUsNEVBQXdCO0FBQzFCLEVBQUUsMkVBQXVCO0FBQ3pCO0FBQ0E7O0FBRUE7O0FBRUEsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vYmF0dGxlZmllbGQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS9jdXJyZW50X3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tL2dhbWVfc3RhdGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS9yZXN0YXJ0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vc3RhcnRfbWVudS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2lucHV0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9tYW5hZ2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllcl9tYW5hZ2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9yYW5kb21fc2hpcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXBfdmFsaWRhdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dCBmcm9tIFwiLi4vaW5wdXRcIjtcbi8qIENlbGxzIGdlbmVyYXRpb24gYW5kIGNsZWFyaW5nICovXG5cbmZ1bmN0aW9uIGZpbGxCYXR0bGVmaWVsZHNXaXRoQ2VsbHMoKSB7XG4gIGNvbnN0IHBsYXllckJhdHRsZWZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBsYXllci1iYXR0bGVmaWVsZCcpO1xuICBjb25zdCBjb21wdXRlckJhdHRsZWZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNvbXB1dGVyLWJhdHRsZWZpZWxkJyk7XG5cbiAgZmlsbFdpdGhDZWxscyhwbGF5ZXJCYXR0bGVmaWVsZCwgJ2pzLWNlbGwtLXBsYXllcicsICdqcy1jZWxsJyk7XG4gIGZpbGxXaXRoQ2VsbHMoY29tcHV0ZXJCYXR0bGVmaWVsZCwgJ2pzLWNlbGwtLWNvbXB1dGVyJywgJ2pzLWNlbGwnKTtcbn1cblxuZnVuY3Rpb24gZmlsbFdpdGhDZWxscyhiYXR0bGVmaWVsZCwgLi4uanNDbGFzc05hbWVzKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMTsgaiA8PSAxMDsgaisrKSB7XG4gICAgICBiYXR0bGVmaWVsZC5hcHBlbmRDaGlsZChfY3JlYXRlQ2VsbChbaiwgaV0sIGpzQ2xhc3NOYW1lcykpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDZWxsKGNvb3JkaW5hdGUsIGpzQ2xhc3NOYW1lcykge1xuICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2dhbWVib2FyZF9fY2VsbCcsIC4uLmpzQ2xhc3NOYW1lcyk7XG4gICAgY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGUgPSBjb29yZGluYXRlO1xuXG4gICAgcmV0dXJuIGNlbGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xlYXJCYXR0bGVmaWVsZHMoKSB7XG4gIGNvbnN0IHBsYXllckJhdHRsZWZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBsYXllci1iYXR0bGVmaWVsZCcpO1xuICBjb25zdCBjb21wdXRlckJhdHRsZWZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNvbXB1dGVyLWJhdHRsZWZpZWxkJyk7XG5cbiAgcGxheWVyQmF0dGxlZmllbGQudGV4dENvbnRlbnQgPSBcIlwiO1xuICBjb21wdXRlckJhdHRsZWZpZWxkLnRleHRDb250ZW50ID0gXCJcIjtcbn1cblxuLyogUmVzcG9uc2UgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIHNob3dNaXNzZWRBdHRhY2soY29vcmRpbmF0ZSwgZW5lbXkpIHtcbiAgY29uc3QgbWlzc2VkQXR0YWNrRGl2ID0gX2NyZWF0ZUF0dGFjaygnbWlzc2VkJyk7XG4gIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5qcy1jZWxsLS0ke2VuZW15fVtkYXRhLWNvb3JkaW5hdGU9XCIke2Nvb3JkaW5hdGV9XCJdYCk7XG5cbiAgaWYgKCFhdHRhY2tlZENlbGwpIHJldHVybjtcblxuICBhdHRhY2tlZENlbGwuYXBwZW5kQ2hpbGQobWlzc2VkQXR0YWNrRGl2KTtcbn1cblxuZnVuY3Rpb24gc2hvd0hpdEF0U2hpcChjb29yZGluYXRlLCBlbmVteSkge1xuICBjb25zdCBzaGlwQXR0YWNrRGl2ID0gX2NyZWF0ZUF0dGFjaygnaGl0Jyk7XG4gIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5qcy1jZWxsLS0ke2VuZW15fVtkYXRhLWNvb3JkaW5hdGU9XCIke2Nvb3JkaW5hdGV9XCJdYCk7XG5cbiAgYXR0YWNrZWRDZWxsLmFwcGVuZENoaWxkKHNoaXBBdHRhY2tEaXYpO1xufVxuXG5mdW5jdGlvbiBzaG93U3Vua1NoaXAoY29vcmRpbmF0ZSkge1xuXG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVBdHRhY2soYXR0YWNrUmVzdWx0KSB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChgZ2FtZWJvYXJkX18ke2F0dGFja1Jlc3VsdH1gKTtcblxuICByZXR1cm4gZGl2O1xufVxuXG4vKiBTaGlwcyBoaWdobGlnaHRpbmcgKi9cblxuZnVuY3Rpb24gc2hvd1BsYXllclNoaXBzKCkge1xuICBjb25zdCBwbGF5ZXJTaGlwc0Nvb3JkaW5hdGVzID1cbiAgICBJbnB1dFxuICAgICAgLmdldFBsYXllclNoaXBzKClcbiAgICAgIC5tYXAoc2hpcCA9PiBzaGlwLmdldENvb3JkaW5hdGVzKCkpO1xuXG4gIHBsYXllclNoaXBzQ29vcmRpbmF0ZXMuZm9yRWFjaChzaG93U2hpcCk7XG59XG5cbmZ1bmN0aW9uIHNob3dTaGlwKGNvb3JkaW5hdGVzKSB7XG4gIGNvbnN0IGZpcnN0Q29vcmRpbmF0ZSA9IGNvb3JkaW5hdGVzWzBdO1xuICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmpzLWNlbGxbZGF0YS1jb29yZGluYXRlPVwiJHtmaXJzdENvb3JkaW5hdGV9XCJdYCk7XG5cbiAgY29uc3Qgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnLCBgc2hpcC0tJHtjb29yZGluYXRlcy5sZW5ndGh9YCk7XG4gIGNlbGwuYXBwZW5kQ2hpbGQoc2hpcCk7XG59XG5cbmV4cG9ydCB7XG4gIGZpbGxCYXR0bGVmaWVsZHNXaXRoQ2VsbHMsXG4gIGNsZWFyQmF0dGxlZmllbGRzLFxuICBzaG93TWlzc2VkQXR0YWNrLFxuICBzaG93SGl0QXRTaGlwLFxuICBzaG93U3Vua1NoaXAsXG4gIHNob3dQbGF5ZXJTaGlwcyxcbiAgc2hvd1NoaXAsXG59IiwiZnVuY3Rpb24gcGxheWVyVHVybigpIHtcblxufVxuXG5mdW5jdGlvbiBjb21wdXRlclR1cm4oKSB7XG5cbn1cblxuZXhwb3J0IHtcbiAgcGxheWVyVHVybixcbiAgY29tcHV0ZXJUdXJuXG59IiwiaW1wb3J0IHsgcGxheWVyVHVybiwgY29tcHV0ZXJUdXJuIH0gZnJvbSBcIi4vY3VycmVudF9wbGF5ZXJcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9wbGF5ZXJfbWFuYWdlclwiO1xuXG5jb25zdCBVSUdhbWVTdGF0ZSA9ICgoKSA9PiB7XG4gIGxldCBfY3VycmVudFBsYXllcjtcbiAgbGV0IF9pc1N0YXJ0R2FtZSA9IHRydWU7XG5cbiAgLyogR2FtZSBzdGFydCAqL1xuXG4gIGZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBfY3VycmVudFBsYXllciA9ICdwbGF5ZXInO1xuICAgIF90b2dnbGVTdGFydEdhbWVJbnRlcmZhY2VWaXNpYmlsaXR5KCk7XG4gICAgX2Rpc2FibGVTdGFydEdhbWVJbnRlcmZhY2UoKTtcbiAgICBfdG9nZ2xlQm9hcmREZXNjcmlwdGlvbnMoKTtcbiAgICBwbGF5ZXJUdXJuKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wR2FtZSgpIHtcbiAgICByZW1vdmVBbGxNb3ZlTGlzdGVuZXJzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93R2FtZVJlc3VsdChpc1BsYXllcldpbm5lcikge1xuICAgIGlmIChpc1BsYXllcldpbm5lcikge1xuICAgICAgX3Nob3dQbGF5ZXJWaWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9zaG93UGxheWVyRGVmZWF0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dQbGF5ZXJWaWN0b3J5KCkge1xuICAgIHRvZ2dsZVJlc3VsdCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yZXN1bHQnKTtcbiAgICByZXN1bHQudGV4dENvbnRlbnQgPSAnVmljdG9yeSEnO1xuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dQbGF5ZXJEZWZlYXQoKSB7XG4gICAgdG9nZ2xlUmVzdWx0KCk7XG4gICAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3VsdCcpO1xuICAgIHJlc3VsdC50ZXh0Q29udGVudCA9ICdEZWZlYXQhJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZVJlc3VsdCgpIHtcbiAgICBjb25zdCByZXN1bHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29udGFpbmVyLS1yZXN1bHQnKTtcbiAgICByZXN1bHRDb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpO1xuICB9XG5cbiAgLyogR2FtZSByZXN0YXJ0ICovXG5cbiAgZnVuY3Rpb24gc2hvd1Jlc3RhcnQoKSB7XG4gICAgX3RvZ2dsZVN0YXJ0R2FtZUludGVyZmFjZVZpc2liaWxpdHkoKTtcbiAgICBfdG9nZ2xlQm9hcmREZXNjcmlwdGlvbnMoKTtcbiAgfVxuXG4gIC8qIFBsYXllciBhbmQgY29tcHV0ZXIgbW92ZSAqL1xuXG4gIC8qIFRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgb25jZSB0aGUgY2VsbCBpcyBjbGlja2VkICovXG4gIC8qIFRoZSBvdXRlciBtb2R1bGUsIGdhbWUsIHdpbGwgYXdhaXQgZm9yIHRoZSBwcm9taXNlIHRvIHJlc29sdmUsICovXG4gIC8qIEFuZCB0aGUgbW92ZSBjYXB0dXJlZCBpbiB0aGlzIG1vZHVsZSB3aWxsIGJlIGhhbmRsZWQgKi9cblxuICBmdW5jdGlvbiBwbGF5ZXJNb3ZlKHBsYXllcikge1xuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBfYWRkTW92ZUxpc3RlbmVyRm9yRW5lbXlDZWxscyhyZXNvbHZlLCAnLmpzLWNlbGwtLWNvbXB1dGVyJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wdXRlck1vdmUoY29tcHV0ZXIpIHtcbiAgICByZW1vdmVBbGxNb3ZlTGlzdGVuZXJzKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgX2FkZE1vdmVMaXN0ZW5lckZvckVuZW15Q2VsbHMocmVzb2x2ZSwgJy5qcy1jZWxsLS1wbGF5ZXInKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb21wdXRlci5tYWtlTW92ZSgpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hZGRNb3ZlTGlzdGVuZXJGb3JFbmVteUNlbGxzKHByb21pc2VSZXNvbHZlQ2FsbGJhY2ssIGVuZW15Q2VsbHNIVE1MQ2xhc3MpIHtcbiAgICBjb25zdCBlbmVteUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbmVteUNlbGxzSFRNTENsYXNzKTtcblxuICAgIGVuZW15Q2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5kYXRhc2V0LmNvb3JkaW5hdGUpIHJldHVybjtcbiAgICAgIFBsYXllck1hbmFnZXIuaGFuZGxlR2FtZWJvYXJkQXR0YWNrKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRpbmF0ZSk7XG4gICAgICBwcm9taXNlUmVzb2x2ZUNhbGxiYWNrKCk7XG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsTW92ZUxpc3RlbmVycygpIHtcbiAgICBjb25zdCBjZWxsc1dpdGhMaXN0ZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuanMtY2VsbC0tcGxheWVyLCAuanMtY2VsbC0tY29tcHV0ZXJgKTtcblxuICAgIGNlbGxzV2l0aExpc3RlbmVycy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgbGV0IGNlbGxXaXRob3V0TGlzdGVuZXIgPSBjZWxsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIGNlbGwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2VsbFdpdGhvdXRMaXN0ZW5lciwgY2VsbCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbnRQbGF5ZXIoKSB7XG4gICAgaWYgKF9jdXJyZW50UGxheWVyID09PSAncGxheWVyJykge1xuICAgICAgX2N1cnJlbnRQbGF5ZXIgPSAnY29tcHV0ZXInO1xuICAgICAgY29tcHV0ZXJUdXJuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9jdXJyZW50UGxheWVyID0gJ3BsYXllcic7XG4gICAgICBwbGF5ZXJUdXJuKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2Rpc2FibGVTdGFydEdhbWVJbnRlcmZhY2UoKSB7XG4gICAgY29uc3QgYnV0dG9uc1dpdGhMaXN0ZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcmFuZG9tLCAuanMtc3RhcnQnKTtcblxuICAgIGJ1dHRvbnNXaXRoTGlzdGVuZXJzLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgIGxldCBidXR0b25XaXRob3V0TGlzdGVuZXIgPSBidXR0b24uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgYnV0dG9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGJ1dHRvbldpdGhvdXRMaXN0ZW5lciwgYnV0dG9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90b2dnbGVTdGFydEdhbWVJbnRlcmZhY2VWaXNpYmlsaXR5KCkge1xuICAgIGNvbnN0IGNvbXB1dGVyR2FtZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNvbXB1dGVyLWdhbWVib2FyZCcpO1xuICAgIGNvbnN0IGdhbWVib2FyZEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcmFuZG9tLCAuanMtc3RhcnQnKTtcblxuICAgIGNvbXB1dGVyR2FtZWJvYXJkLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXZpc2libGUnKTtcbiAgICBnYW1lYm9hcmRCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdpcy12aXNpYmxlJykpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZUJvYXJkRGVzY3JpcHRpb25zKCkge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1kZXNjcmlwdGlvbicpO1xuICAgIGRlc2NyaXB0aW9ucy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy12aXNpYmxlJykpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydEdhbWUsXG4gICAgc3RvcEdhbWUsXG4gICAgc2hvd0dhbWVSZXN1bHQsXG4gICAgdG9nZ2xlUmVzdWx0LFxuICAgIHRvZ2dsZUN1cnJlbnRQbGF5ZXIsXG4gICAgcGxheWVyTW92ZSxcbiAgICBjb21wdXRlck1vdmUsXG4gICAgc2hvd1Jlc3RhcnQsXG4gICAgcmVtb3ZlQWxsTW92ZUxpc3RlbmVycyxcbiAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgVUlHYW1lU3RhdGU7IiwiZnVuY3Rpb24gYWRkUmVzdGFydEV2ZW50KGNhbGxiYWNrKSB7XG4gIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmVzdGFydCcpO1xuICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xufVxuXG5leHBvcnQge1xuICBhZGRSZXN0YXJ0RXZlbnQsXG59IiwiZnVuY3Rpb24gYWRkRXZlbnRzVG9TdGFydE1lbnVCdXR0b25zKHN0YXJ0Q2FsbGJhY2ssIHJhbmRvbUNhbGxiYWNrKSB7XG4gIGNvbnN0IHN0YXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXN0YXJ0Jyk7XG4gIGNvbnN0IHJhbmRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yYW5kb20nKVxuICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN0YXJ0Q2FsbGJhY2spO1xuICByYW5kb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByYW5kb21DYWxsYmFjayk7XG59XG5cbmV4cG9ydCB7XG4gIGFkZEV2ZW50c1RvU3RhcnRNZW51QnV0dG9ucyxcbn0iLCJpbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi9wbGF5ZXJfbWFuYWdlclwiO1xuaW1wb3J0IElucHV0IGZyb20gXCIuL2lucHV0XCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgVUlHYW1lU3RhdGUgZnJvbSBcIi4vZG9tL2dhbWVfc3RhdGVcIjtcbmltcG9ydCBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMgZnJvbSBcIi4vcmFuZG9tX3NoaXBzXCI7XG5pbXBvcnQgeyBzaG93SGl0QXRTaGlwLCBzaG93TWlzc2VkQXR0YWNrLCBzaG93U3Vua1NoaXAgfSBmcm9tIFwiLi9kb20vYmF0dGxlZmllbGRcIjtcbmltcG9ydCB7IENvbXB1dGVyLCBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IGdldENlbGxzU3Vycm91bmRpbmdTaGlwIH0gZnJvbSBcIi4vaGVscGVyXCI7XG5cbmNvbnN0IEdhbWUgPSAoKCkgPT4ge1xuICBsZXQgX2dhbWVHb2luZyA9IGZhbHNlO1xuICBsZXQgX3dpbm5lciA9IG51bGw7XG4gIGxldCBwbGF5ZXIgPSBudWxsO1xuICBsZXQgY29tcHV0ZXIgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgIF9pbml0UGxheWVycygpO1xuICAgIF9wbGFjZVNoaXBzKHBsYXllciwgY29tcHV0ZXIpO1xuICAgIF9pbml0VUkoKTtcblxuICAgIF9nYW1lR29pbmcgPSB0cnVlO1xuICAgIF9nYW1lbG9vcCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3N0b3AoKSB7XG4gICAgX2dhbWVHb2luZyA9IGZhbHNlO1xuICAgIElucHV0LmNsZWFyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5pdFBsYXllcnMoKSB7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcigncGxheWVyJyk7XG4gICAgY29tcHV0ZXIgPSBuZXcgQ29tcHV0ZXIoJ2NvbXB1dGVyJyk7XG5cbiAgICBQbGF5ZXJNYW5hZ2VyLmFkZFBsYXllcihwbGF5ZXIpO1xuICAgIFBsYXllck1hbmFnZXIuYWRkUGxheWVyKGNvbXB1dGVyKTtcbiAgICBQbGF5ZXJNYW5hZ2VyLnNldEN1cnJlbnQocGxheWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbml0VUkoKSB7XG4gICAgVUlHYW1lU3RhdGUuc3RhcnRHYW1lKCk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBfZ2FtZWxvb3AoKSB7XG4gICAgd2hpbGUgKF9nYW1lR29pbmcpIHtcbiAgICAgIGF3YWl0IG5leHRNb3ZlKCk7XG5cbiAgICAgIGNvbnN0IGF0dGFja2VyID0gUGxheWVyTWFuYWdlci5nZXRDdXJyZW50KCk7XG4gICAgICBjb25zdCBhdHRhY2tlZCA9IFBsYXllck1hbmFnZXIuZ2V0Tm90Q3VycmVudCgpO1xuXG4gICAgICBpZiAoIWF0dGFja2VkLmdhbWVib2FyZC5jaGVja0xhc3RBdHRhY2tTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghYXR0YWNrZWQuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAoKSkge1xuICAgICAgICAvKiBJZiB0aGUgbGFzdCBhdHRhY2sgZGlkIG5vdCBoaXQgYSBzaGlwICovXG4gICAgICAgIFBsYXllck1hbmFnZXIudG9nZ2xlQ3VycmVudCgpO1xuICAgICAgICBVSUdhbWVTdGF0ZS50b2dnbGVDdXJyZW50UGxheWVyKCk7XG4gICAgICAgIHNob3dNaXNzZWRBdHRhY2soYXR0YWNrZWQuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2soKSwgYXR0YWNrZWQubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG93SGl0QXRTaGlwKGF0dGFja2VkLmdhbWVib2FyZC5nZXRMYXN0QXR0YWNrKCksIGF0dGFja2VkLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0YWNrZWQuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwKCkpIHtcbiAgICAgICAgX2F0dGFja0NlbGxzQXJvdW5kU3Vua1NoaXAoYXR0YWNrZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0YWNrZWQuaXNHYW1lT3ZlcigpKSB7XG4gICAgICAgIF9zdG9wKCk7XG4gICAgICAgIF93aW5uZXIgPSBhdHRhY2tlcjtcblxuICAgICAgICBVSUdhbWVTdGF0ZS5zdG9wR2FtZSgpO1xuICAgICAgICBVSUdhbWVTdGF0ZS5zaG93R2FtZVJlc3VsdChfd2lubmVyID09PSBwbGF5ZXIgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBuZXh0TW92ZSgpIHtcbiAgICAgIGlmIChQbGF5ZXJNYW5hZ2VyLmdldEN1cnJlbnQoKSA9PT0gcGxheWVyKSB7XG4gICAgICAgIGF3YWl0IFVJR2FtZVN0YXRlLnBsYXllck1vdmUocGxheWVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKFBsYXllck1hbmFnZXIuZ2V0Q3VycmVudCgpID09PSBjb21wdXRlcikge1xuICAgICAgICBhd2FpdCBVSUdhbWVTdGF0ZS5jb21wdXRlck1vdmUoY29tcHV0ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wbGFjZVNoaXBzKHBsYXllciwgY29tcHV0ZXIpIHtcbiAgICBjb25zdCBwbGF5ZXJTaGlwcyA9IElucHV0LmdldFBsYXllclNoaXBzKCk7XG4gICAgY29uc3QgY29tcHV0ZXJTaGlwcyA9IElucHV0LmdldENvbXB1dGVyU2hpcHMoKTtcblxuICAgIHBsYXllclNoaXBzLmZvckVhY2goc2hpcCA9PiBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwKSk7XG4gICAgY29tcHV0ZXJTaGlwcy5mb3JFYWNoKHNoaXAgPT4gY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfYXR0YWNrQ2VsbHNBcm91bmRTdW5rU2hpcChhdHRhY2tlZCkge1xuICAgIGNvbnN0IHN1bmtTaGlwID0gYXR0YWNrZWQuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2tlZFNoaXAoKTtcblxuICAgIGNvbnN0IGNlbGxzVG9BdHRhY2sgPSBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcChzdW5rU2hpcC5nZXRDb29yZGluYXRlcygpKTtcbiAgICBjZWxsc1RvQXR0YWNrLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICBhdHRhY2tlZC5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjZWxsKTtcblxuICAgICAgaWYgKGF0dGFja2VkLmdhbWVib2FyZC5jaGVja0xhc3RBdHRhY2tTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgc2hvd01pc3NlZEF0dGFjayhjZWxsLCBQbGF5ZXJNYW5hZ2VyLmdldFBsYXllck5hbWUoYXR0YWNrZWQpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFVJR2FtZVN0YXRlLnJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnQsXG4gIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7IiwiaW1wb3J0IHsgaGl0U2hpcCB9IGZyb20gXCIuL21hbmFnZXJcIjtcbmltcG9ydCB7IHN0cmluZ2lmeUVsZW1lbnRzIH0gZnJvbSBcIi4vaGVscGVyXCJcblxuXG5mdW5jdGlvbiBHYW1lYm9hcmQoKSB7XG4gIGNvbnN0IF9sZW5ndGggPSAxMDsgLy8gMTAgeCAxMCBib2FyZFxuICBjb25zdCBfc2hpcHMgPSBbXTtcbiAgY29uc3QgX21pc3NlZEF0dGFja3MgPSBbXTtcbiAgY29uc3QgX2F0dGFja3MgPSBbXTtcblxuICB0aGlzLmdldExlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xlbmd0aDtcbiAgfVxuXG4gIHRoaXMuZ2V0U2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5fc2hpcHNdO1xuICB9XG5cbiAgdGhpcy5nZXRNaXNzZWRBdHRhY2tzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX21pc3NlZEF0dGFja3NdO1xuICB9XG5cbiAgdGhpcy5nZXRBbGxBdHRhY2tzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX2F0dGFja3NdO1xuICB9XG5cbiAgdGhpcy5nZXRQb3NzaWJsZUF0dGFja3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsQ2VsbHMoKS5maWx0ZXIoY2VsbCA9PiAhc3RyaW5naWZ5RWxlbWVudHMoX2F0dGFja3MpLmluY2x1ZGVzKGNlbGwudG9TdHJpbmcoKSkpO1xuICB9XG5cbiAgdGhpcy5nZXRMYXN0QXR0YWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfYXR0YWNrc1tfYXR0YWNrcy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIHRoaXMuZ2V0TGFzdEF0dGFja2VkU2hpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBsYXN0QXR0YWNrID0gdGhpcy5nZXRMYXN0QXR0YWNrKCk7XG5cbiAgICBjb25zdCBsYXN0QXR0YWNrZWRTaGlwID1cbiAgICAgIF9zaGlwc1xuICAgICAgICAuZmluZChcbiAgICAgICAgICBzaGlwID0+IHNoaXBcbiAgICAgICAgICAgIC5nZXRDb29yZGluYXRlcygpXG4gICAgICAgICAgICAuc29tZShjb29yZGluYXRlID0+IGNvb3JkaW5hdGUudG9TdHJpbmcoKSA9PT0gbGFzdEF0dGFjay50b1N0cmluZygpKVxuICAgICAgICApO1xuXG4gICAgcmV0dXJuIGxhc3RBdHRhY2tlZFNoaXA7XG4gIH1cblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IHRoaXMuZ2V0TGFzdEF0dGFjaygpO1xuICAgIGNvbnN0IGNoZWNrUmVzdWx0ID0gX3NoaXBzLmZpbmQoc2hpcCA9PiBzdHJpbmdpZnlFbGVtZW50cyhzaGlwLmdldENvb3JkaW5hdGVzKCkpLmluY2x1ZGVzKGxhc3RBdHRhY2sudG9TdHJpbmcoKSkpO1xuXG4gICAgcmV0dXJuIChjaGVja1Jlc3VsdCkgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSB0aGlzLmdldExhc3RBdHRhY2soKTtcbiAgICBjb25zdCBsYXN0U2hpcEhpdCA9IF9zaGlwcy5maW5kKHNoaXAgPT4gc3RyaW5naWZ5RWxlbWVudHMoc2hpcC5nZXRDb29yZGluYXRlcygpKS5pbmNsdWRlcyhsYXN0QXR0YWNrLnRvU3RyaW5nKCkpKTtcblxuICAgIHJldHVybiBsYXN0U2hpcEhpdCA/IGxhc3RTaGlwSGl0LmlzU3VuaygpIDogZmFsc2U7XG4gIH1cblxuICB0aGlzLmdldEFsbENlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFsbENlbGxzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBfbGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IF9sZW5ndGg7IGorKykge1xuICAgICAgICBhbGxDZWxscy5wdXNoKFtpLCBqXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5hbGxDZWxsc107XG4gIH1cblxuXG4gIGZ1bmN0aW9uIF9wbGFjZU1pc3NlZEF0dGFjayhhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgX21pc3NlZEF0dGFja3MucHVzaChhdHRhY2tDb29yZGluYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wbGFjZUF0dGFjayhhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgX2F0dGFja3MucHVzaChhdHRhY2tDb29yZGluYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pc0F0dGFja2luZ0FscmVhZHlBdHRhY2tlZENlbGwoYXR0YWNrQ29vcmRpbmF0ZVN0cikge1xuICAgIGZvciAoY29uc3QgYXR0YWNrIG9mIF9hdHRhY2tzKSB7XG4gICAgICBpZiAoYXR0YWNrLnRvU3RyaW5nKCkgPT09IGF0dGFja0Nvb3JkaW5hdGVTdHIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5wbGFjZVNoaXAgPSBmdW5jdGlvbiAoc2hpcCkge1xuICAgIF9zaGlwcy5wdXNoKHNoaXApO1xuICB9XG5cbiAgdGhpcy5hcmVBbGxTaGlwc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9zaGlwcy5ldmVyeShzaGlwID0+IHNoaXAuaXNTdW5rKCkpO1xuICB9XG5cbiAgbGV0IF9sYXN0QXR0YWNrU3VjY2Vzc2Z1bDtcblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9sYXN0QXR0YWNrU3VjY2Vzc2Z1bDtcbiAgfVxuXG4gIHRoaXMucmVjZWl2ZUF0dGFjayA9IGZ1bmN0aW9uIChhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgLyogQ2hlY2sgaWYgaXQgZG9lcyBub3QgYXR0YWNrIGFuIGFscmVhZHkgYXR0YWNrZWQgY29vcmRpbmF0ZSAqL1xuICAgIGNvbnN0IGF0dGFja0Nvb3JkaW5hdGVTdHIgPSBhdHRhY2tDb29yZGluYXRlLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAoX2lzQXR0YWNraW5nQWxyZWFkeUF0dGFja2VkQ2VsbChhdHRhY2tDb29yZGluYXRlU3RyKSkge1xuICAgICAgX2xhc3RBdHRhY2tTdWNjZXNzZnVsID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgX3BsYWNlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuXG4gICAgZm9yIChjb25zdCBzaGlwIG9mIF9zaGlwcykge1xuICAgICAgZm9yIChjb25zdCBzaGlwQ29vcmRpbmF0ZSBvZiBzaGlwLmdldENvb3JkaW5hdGVzKCkpIHtcbiAgICAgICAgaWYgKHNoaXBDb29yZGluYXRlLnRvU3RyaW5nKCkgPT09IGF0dGFja0Nvb3JkaW5hdGVTdHIpIHtcbiAgICAgICAgICBoaXRTaGlwKHNoaXAsIHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKS5pbmRleE9mKHNoaXBDb29yZGluYXRlKSk7IC8vIGhpdCB0aGUgc2hpcCBhdCB0aGlzIHBvc2l0aW9uXG4gICAgICAgICAgX2xhc3RBdHRhY2tTdWNjZXNzZnVsID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfcGxhY2VNaXNzZWRBdHRhY2soYXR0YWNrQ29vcmRpbmF0ZSk7XG4gICAgX2xhc3RBdHRhY2tTdWNjZXNzZnVsID0gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7IiwiZnVuY3Rpb24gZ2V0Q2VsbHNTdXJyb3VuZGluZ0NlbGwoY2VsbCkge1xuICAvLyBJdCBtYXkgcmV0dXJuIG5lZ2F0aXZlIGNlbGxzIHRoYXQgYXJlIG5vdCBvbiBib2FyZCxcbiAgLy8gYnV0IGl0IGRvZXNuJ3QgbWF0dGVyIHNpbmNlIHRoZXkgYXJlIG5vdCB1c2VkIGF0IGFsbFxuICAvLyBBbGwgd2UgbmVlZCB0byBjaGVjayBpcyB3aGV0aGVyIHdlIGNhbiBwbGFjZSBhIHNoaXAgb25cbiAgLy8gYW4gZXhpc3RpbmcgY2VsbCBvciBub3RcbiAgcmV0dXJuIFtcbiAgICAvLyByZXR1cm4gZXZlcnl0aGluZyBhcm91bmQgdGhpcyBjZWxsXG5cbiAgICAvLyBhYm92ZVxuICAgIFtjZWxsWzBdIC0gMSwgY2VsbFsxXSAtIDFdLFxuICAgIFtjZWxsWzBdLCBjZWxsWzFdIC0gMV0sXG4gICAgW2NlbGxbMF0gKyAxLCBjZWxsWzFdIC0gMV0sXG5cbiAgICAvLyByaWdodFxuICAgIFtjZWxsWzBdICsgMSwgY2VsbFsxXV0sXG4gICAgLy9sZWZ0XG4gICAgW2NlbGxbMF0gLSAxLCBjZWxsWzFdXSxcblxuICAgIC8vIGJlbG93XG4gICAgW2NlbGxbMF0gLSAxLCBjZWxsWzFdICsgMV0sXG4gICAgW2NlbGxbMF0sIGNlbGxbMV0gKyAxXSxcbiAgICBbY2VsbFswXSArIDEsIGNlbGxbMV0gKyAxXSxcbiAgXVxufVxuXG5mdW5jdGlvbiBnZXRQZXJwZW5kaWN1bGFyQ2VsbHMoY2VsbCkge1xuICBsZXQgY2VsbEFib3ZlO1xuICBsZXQgY2VsbEJlbG93O1xuICBsZXQgY2VsbFRvVGhlTGVmdDtcbiAgbGV0IGNlbGxUb1RoZVJpZ2h0O1xuICBsZXQgcGVycGVuZGljdWxhckNlbGxzID0gW107XG5cbiAgaWYgKGNlbGxbMV0gPiAxKSB7XG4gICAgY2VsbEFib3ZlID0gW051bWJlcihjZWxsWzBdKSwgTnVtYmVyKGNlbGxbMV0pIC0gMV07XG4gICAgcGVycGVuZGljdWxhckNlbGxzLnB1c2goY2VsbEFib3ZlKTtcbiAgfVxuXG4gIGlmIChjZWxsWzFdIDwgMTApIHtcbiAgICBjZWxsQmVsb3cgPSBbTnVtYmVyKGNlbGxbMF0pLCBOdW1iZXIoY2VsbFsxXSkgKyAxXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsQmVsb3cpO1xuICB9XG5cbiAgaWYgKGNlbGxbMF0gPCAxMCkge1xuICAgIGNlbGxUb1RoZVJpZ2h0ID0gW051bWJlcihjZWxsWzBdKSArIDEsIE51bWJlcihjZWxsWzFdKV07XG4gICAgcGVycGVuZGljdWxhckNlbGxzLnB1c2goY2VsbFRvVGhlUmlnaHQpO1xuICB9XG5cbiAgaWYgKGNlbGxbMF0gPiAxKSB7XG4gICAgY2VsbFRvVGhlTGVmdCA9IFtOdW1iZXIoY2VsbFswXSkgLSAxLCBOdW1iZXIoY2VsbFsxXSldO1xuICAgIHBlcnBlbmRpY3VsYXJDZWxscy5wdXNoKGNlbGxUb1RoZUxlZnQpO1xuICB9XG5cbiAgcmV0dXJuIFsuLi5wZXJwZW5kaWN1bGFyQ2VsbHNdO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlFbGVtZW50cyhhcnIpIHtcbiAgcmV0dXJuIGFyci5tYXAoZWwgPT4gZWwudG9TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRFbGVtZW50c1RvTnVtYmVycyhhcnIpIHtcbiAgcmV0dXJuIGFyci5tYXAoZWwgPT4gTnVtYmVyKGVsKSk7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxzU3Vycm91bmRpbmdTaGlwKHNoaXBDb29yZGluYXRlcykge1xuICBjb25zdCBjZWxsc1N1cnJvdW5kaW5nU2hpcCA9IHNoaXBDb29yZGluYXRlc1xuICAgIC5tYXAoZ2V0Q2VsbHNTdXJyb3VuZGluZ0NlbGwpXG4gICAgLmZsYXQoKVxuXG4gIHJldHVybiBjZWxsc1N1cnJvdW5kaW5nU2hpcDtcbn1cblxuZXhwb3J0IHtcbiAgZ2V0Q2VsbHNTdXJyb3VuZGluZ0NlbGwsXG4gIGdldFBlcnBlbmRpY3VsYXJDZWxscyxcbiAgc3RyaW5naWZ5RWxlbWVudHMsXG4gIGNvbnZlcnRFbGVtZW50c1RvTnVtYmVycyxcbiAgZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAsXG59OyIsImltcG9ydCB7IGNvbnZlcnRFbGVtZW50c1RvTnVtYmVycyB9IGZyb20gXCIuL2hlbHBlclwiO1xuXG5jb25zdCBJbnB1dCA9ICgoKSA9PiB7XG4gIGxldCBfbGFzdE1vdmU7XG4gIGxldCBfc2hpcHMgPSBbXTsgLy90d28tZGltZW5zaW9uYWwuXG5cbiAgZnVuY3Rpb24gc2V0TGFzdE1vdmUoY29vcmRpbmF0ZSkge1xuICAgIF9sYXN0TW92ZSA9IGNvbnZlcnRFbGVtZW50c1RvTnVtYmVycyhjb29yZGluYXRlKTtcbiAgICBjb25zb2xlLmxvZyhfbGFzdE1vdmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGFzdE1vdmUoKSB7XG4gICAgcmV0dXJuIF9sYXN0TW92ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcHMoc2hpcHMpIHtcbiAgICBfc2hpcHMucHVzaChzaGlwcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJTaGlwcygpIHtcbiAgICByZXR1cm4gX3NoaXBzWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29tcHV0ZXJTaGlwcygpIHtcbiAgICByZXR1cm4gX3NoaXBzWzFdO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgX2xhc3RNb3ZlID0gbnVsbDtcbiAgICBfc2hpcHMgPSBbXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0TGFzdE1vdmUsXG4gICAgZ2V0TGFzdE1vdmUsXG4gICAgZ2V0UGxheWVyU2hpcHMsXG4gICAgZ2V0Q29tcHV0ZXJTaGlwcyxcbiAgICBwbGFjZVNoaXBzLFxuICAgIGNsZWFyXG4gIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IElucHV0OyIsImZ1bmN0aW9uIGhpdFNoaXAoc2hpcCwgcG9zaXRpb24pIHtcbiAgc2hpcC5oaXQocG9zaXRpb24pO1xuICAvLyBUT0RPOiBoaXQgaW4gRE9NXG59XG5cbmV4cG9ydCB7XG4gIGhpdFNoaXBcbn0iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4vcGxheWVyX21hbmFnZXJcIjtcbmltcG9ydCB7IGdldFBlcnBlbmRpY3VsYXJDZWxscyB9IGZyb20gXCIuL2hlbHBlclwiO1xuaW1wb3J0IHsgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tIFwiLi9oZWxwZXJcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgI2dhbWVib2FyZDtcbiAgI25hbWU7XG5cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuI25hbWUgPSBuYW1lO1xuICAgIHRoaXMuI2dhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBQbGF5ZXJNYW5hZ2VyLmFkZFBsYXllcih0aGlzKTtcbiAgfVxuXG4gIGdldCBnYW1lYm9hcmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2dhbWVib2FyZDtcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNuYW1lO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICByZXR1cm4gdGhpcy4jZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpO1xuICB9XG59XG5cbmNsYXNzIENvbXB1dGVyIGV4dGVuZHMgUGxheWVyIHtcbiAgI2xhc3RIaXRBdFNoaXAgPSBudWxsO1xuXG4gICN0cnlpbmdUb1NpbmtTaGlwID0gZmFsc2U7IC8vIEl0IHdpbGwgdHJ5IHRvIHNpbmsgYSBzaGlwIGlmIGl0IGhpdCBpdFxuXG4gICNmaXJzdEhpdEF0U2hpcCA9IG51bGw7IC8vIFRoZSB2ZXJ5IGZpcnN0IHNoaXAncyBjb29yZGluYXRlIGF0dGFja2VkXG5cbiAgLy8gSWYgdGhlIHNoaXAgaXMgYXR0YWNrZWQgdHdpY2UsIGl0IHdpbGwgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHNoaXAgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxuICAjYXR0YWNrRGlyZWN0aW9uID0gbnVsbDtcblxuICAjaGl0c0F0U2hpcCA9IFtdOyAvLyBBbGwgaGl0cyBhdCB0aGUgY3VycmVudCBzaGlwIHRoYXQgaXQgaXMgdHJ5aW5nIHRvIGF0dGFjayBhbmQgc2lua1xuICAjZ3Vlc3NlZFNoaXBQb3NpdGlvbnMgPSBbXTsgLy8gSXQgd2lsbCBndWVzcyB3aGVyZSB0aGUgc2hpcCBtYXkgYmVcblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gIH1cblxuICAvKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzIGFyZSBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5ICovXG5cbiAgZ2V0IGxhc3RIaXRBdFNoaXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhc3RIaXRBdFNoaXA7XG4gIH1cblxuICBnZXQgdHJ5aW5nVG9TaW5rU2hpcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJ5aW5nVG9TaW5rU2hpcDtcbiAgfVxuXG4gIHNldCBsYXN0SGl0QXRTaGlwKHZhbHVlKSB7XG4gICAgdGhpcy4jbGFzdEhpdEF0U2hpcCA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IHRyeWluZ1RvU2lua1NoaXAodmFsdWUpIHtcbiAgICB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwID0gdmFsdWU7XG4gIH1cblxuXG4gIG1ha2VNb3ZlKCkge1xuICAgIGNvbnN0IHBvc3NpYmxlQXR0YWNrcyA9IFBsYXllck1hbmFnZXIuZ2V0UGxheWVyUG9zc2libGVBdHRhY2tzKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuI3RyeWluZ1RvU2lua1NoaXApIHtcbiAgICAgIHRoaXMuY3VycmVudEF0dGFjayA9IHRoaXMuI2dldFBvdGVudGlhbEF0dGFja1RvU2lua1NoaXAocG9zc2libGVBdHRhY2tzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50QXR0YWNrID0gdGhpcy4jZ2V0UmFuZG9tQ29vcmRpbmF0ZXMocG9zc2libGVBdHRhY2tzKTtcbiAgICB9XG5cbiAgICB0aGlzLiNhdHRhY2tJbkRPTSh0aGlzLmN1cnJlbnRBdHRhY2spO1xuICAgIHRoaXMuZGVmaW5lTmV4dE1vdmUoKTtcbiAgfVxuXG4gICNnZXRSYW5kb21Db29yZGluYXRlcyhwb3NzaWJsZUF0dGFja3MpIHtcbiAgICByZXR1cm4gcG9zc2libGVBdHRhY2tzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQXR0YWNrcy5sZW5ndGgpXTtcbiAgfVxuXG4gICNnZXRQb3RlbnRpYWxBdHRhY2tUb1NpbmtTaGlwKGFsbFZhbGlkQXR0YWNrcykge1xuICAgIGlmICh0aGlzLiNmaXJzdEhpdEF0U2hpcC50b1N0cmluZygpICE9PSB0aGlzLiNsYXN0SGl0QXRTaGlwLnRvU3RyaW5nKCkpIHtcbiAgICAgIC8vIGlmIGNvbXB1dGVyIGhhcyBhbHJlYWR5IGF0dGFja2VkIGEgc2hpcCB0d2ljZSBvciBtb3JlIHRpbWVzLFxuICAgICAgLy8gZGVmaW5lIHRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdG8gYXR0YWNrIG5leHRcbiAgICAgIHRoaXMuI3NldEF0dGFja0RpcmVjdGlvbigpO1xuICAgICAgdGhpcy4jZ3Vlc3NTaGlwUG9zaXRpb25zKCk7XG5cbiAgICAgIGNvbnN0IGF0dGFja3NUb1ZhbGlkYXRlID0gW1xuICAgICAgICAuLi50aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucyxcbiAgICAgIF07XG5cbiAgICAgIGFsbFZhbGlkQXR0YWNrcyA9IHN0cmluZ2lmeUVsZW1lbnRzKGFsbFZhbGlkQXR0YWNrcyk7XG5cbiAgICAgIGNvbnN0IHZhbGlkR3Vlc3NlZEF0dGFja3MgPSBhdHRhY2tzVG9WYWxpZGF0ZS5maWx0ZXIoXG4gICAgICAgIGF0dGFjayA9PiBhbGxWYWxpZEF0dGFja3MuaW5jbHVkZXMoYXR0YWNrLnRvU3RyaW5nKCkpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBuZXh0QXR0YWNrID0gdmFsaWRHdWVzc2VkQXR0YWNrc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEd1ZXNzZWRBdHRhY2tzLmxlbmd0aCldO1xuXG4gICAgICByZXR1cm4gbmV4dEF0dGFjaztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2VsbHNXaGVyZU1heUJlU2hpcCA9IGdldFBlcnBlbmRpY3VsYXJDZWxscyh0aGlzLiNsYXN0SGl0QXRTaGlwKTsgLy8gV2hlcmUgdGhlcmUgbWlnaHQgYmUgYSBzaGlwXG5cbiAgICAgIGFsbFZhbGlkQXR0YWNrcyA9IHN0cmluZ2lmeUVsZW1lbnRzKGFsbFZhbGlkQXR0YWNrcyk7XG5cbiAgICAgIGNvbnN0IHZhbGlkQ2VsbHNXaGVyZU1heUJlU2hpcCA9IGNlbGxzV2hlcmVNYXlCZVNoaXAuZmlsdGVyKFxuICAgICAgICBjZWxsID0+IGFsbFZhbGlkQXR0YWNrcy5pbmNsdWRlcyhjZWxsLnRvU3RyaW5nKCkpXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsaWRDZWxsc1doZXJlTWF5QmVTaGlwW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkQ2VsbHNXaGVyZU1heUJlU2hpcC5sZW5ndGgpXTtcbiAgICB9XG4gIH1cblxuICAjc2V0QXR0YWNrRGlyZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLiNmaXJzdEhpdEF0U2hpcFswXSAtIHRoaXMuI2xhc3RIaXRBdFNoaXBbMF0gPT09IDApIHtcbiAgICAgIHRoaXMuI2F0dGFja0RpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuI2ZpcnN0SGl0QXRTaGlwWzFdIC0gdGhpcy4jbGFzdEhpdEF0U2hpcFsxXSA9PT0gMCkge1xuICAgICAgdGhpcy4jYXR0YWNrRGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgfVxuXG4gICNndWVzc1NoaXBQb3NpdGlvbnMoKSB7XG4gICAgdGhpcy4jaGl0c0F0U2hpcC5mb3JFYWNoKGhpdCA9PiB7XG4gICAgICBpZiAodGhpcy4jYXR0YWNrRGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIHRoaXMuI2d1ZXNzZWRTaGlwUG9zaXRpb25zLnB1c2goXG4gICAgICAgICAgW051bWJlcihoaXRbMF0pLCBOdW1iZXIoaGl0WzFdKSAtIDFdLFxuICAgICAgICAgIFtOdW1iZXIoaGl0WzBdKSwgTnVtYmVyKGhpdFsxXSkgKyAxXSxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy4jYXR0YWNrRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgdGhpcy4jZ3Vlc3NlZFNoaXBQb3NpdGlvbnMucHVzaChcbiAgICAgICAgICBbTnVtYmVyKGhpdFswXSkgLSAxLCBOdW1iZXIoaGl0WzFdKV0sXG4gICAgICAgICAgW051bWJlcihoaXRbMF0pICsgMSwgTnVtYmVyKGhpdFsxXSldLFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gICNhdHRhY2tJbkRPTShhdHRhY2spIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuanMtY2VsbC0tcGxheWVyW2RhdGEtY29vcmRpbmF0ZT1cIiR7YXR0YWNrfVwiXWApLmNsaWNrKCk7XG4gIH1cblxuICBkZWZpbmVOZXh0TW92ZSgpIHtcbiAgICBpZiAoXG4gICAgICBQbGF5ZXJNYW5hZ2VyLmNoZWNrTGFzdEF0dGFja0F0RW5lbXlIaXRTaGlwKCkgJiYgIVBsYXllck1hbmFnZXIuY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwKClcbiAgICApIHtcbiAgICAgIHRoaXMuI2RlZmluZU5leHRNb3ZlQXNTaGlwQXR0YWNrKCk7XG4gICAgfSBlbHNlIGlmIChQbGF5ZXJNYW5hZ2VyLmNoZWNrTGFzdEF0dGFja0F0RW5lbXlTYW5rU2hpcCgpKSB7XG4gICAgICB0aGlzLiNkZWZpbmVOZXh0TW92ZUFzUmFuZG9tQXR0YWNrKCk7XG4gICAgfVxuICB9XG5cbiAgI2RlZmluZU5leHRNb3ZlQXNTaGlwQXR0YWNrKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSBQbGF5ZXJNYW5hZ2VyLmdldExhc3RBdHRhY2tBdEVuZW15KCk7XG4gICAgaWYgKCF0aGlzLiNsYXN0SGl0QXRTaGlwKSB7XG4gICAgICAvLyBpZiBpdCBpcyBmaXJzdCBhdHRhY2sgYXQgdGhlIHNoaXAgKGl0IHdhc24ndCBhdHRhY2tlZCBiZWZvcmUgYW5kIGxhc3QgaGl0IGlzIGZhbHN5KVxuICAgICAgdGhpcy4jZmlyc3RIaXRBdFNoaXAgPSBsYXN0QXR0YWNrO1xuICAgIH1cbiAgICB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwID0gdHJ1ZTtcbiAgICB0aGlzLiNsYXN0SGl0QXRTaGlwID0gbGFzdEF0dGFjaztcbiAgICB0aGlzLiNoaXRzQXRTaGlwLnB1c2gobGFzdEF0dGFjayk7XG4gIH1cblxuICAjZGVmaW5lTmV4dE1vdmVBc1JhbmRvbUF0dGFjaygpIHtcbiAgICB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwID0gZmFsc2U7XG4gICAgdGhpcy4jbGFzdEhpdEF0U2hpcCA9IG51bGw7XG4gICAgdGhpcy4jYXR0YWNrRGlyZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLiNoaXRzQXRTaGlwID0gW107XG4gICAgdGhpcy4jZ3Vlc3NlZFNoaXBQb3NpdGlvbnMgPSBbXTtcbiAgfVxufVxuXG5cbmV4cG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfSIsImltcG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuY29uc3QgUGxheWVyTWFuYWdlciA9ICgoKSA9PiB7XG4gIGxldCBfY3VycmVudDtcbiAgbGV0IF9wbGF5ZXJzID0gW107XG5cbiAgZnVuY3Rpb24gYWRkUGxheWVyKHBsYXllcikge1xuICAgIGlmIChfcGxheWVycy5sZW5ndGggPT09IDIpIHtcbiAgICAgIF9wbGF5ZXJzID0gW107IC8vIG5vIG1vcmUgdGhhbiB0d28gcGxheWVycyBhcmUgc3RvcmVkXG4gICAgfVxuICAgIF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbnQoKSB7XG4gICAgX2N1cnJlbnQgPSBnZXROb3RDdXJyZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRDdXJyZW50KHBsYXllcikge1xuICAgIF9jdXJyZW50ID0gcGxheWVyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudCgpIHtcbiAgICByZXR1cm4gX2N1cnJlbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKHBsYXllcikgeyAvLyBOZWVkIGZvciBET00gY2xhc3Nlc1xuICAgIHJldHVybiAocGxheWVyIGluc3RhbmNlb2YgQ29tcHV0ZXIpID8gJ2NvbXB1dGVyJyA6ICdwbGF5ZXInO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Tm90Q3VycmVudCgpIHtcbiAgICByZXR1cm4gKF9jdXJyZW50ID09PSBfcGxheWVyc1swXSkgPyBfcGxheWVyc1sxXSA6IF9wbGF5ZXJzWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGxheWVyUG9zc2libGVBdHRhY2tzKHBsYXllcikge1xuICAgIC8vIEZpbmRzIHRoZSBlbmVteSBwbGF5ZXIgYW5kIGdldHMgdGhlIHBvc3NpYmxlIGF0dGFja3MgZnJvbSB0aGVpciBnYW1lYm9hcmRcbiAgICByZXR1cm4gX3BsYXllcnMuZmluZChfcGxheWVyID0+IF9wbGF5ZXIgIT09IHBsYXllcikuZ2FtZWJvYXJkLmdldFBvc3NpYmxlQXR0YWNrcygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGFzdEF0dGFja0F0RW5lbXkoKSB7XG4gICAgY29uc3QgZW5lbXkgPSBnZXROb3RDdXJyZW50KCk7XG4gICAgcmV0dXJuIGVuZW15LmdhbWVib2FyZC5nZXRMYXN0QXR0YWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0xhc3RBdHRhY2tBdEVuZW15SGl0U2hpcCgpIHtcbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlTYW5rU2hpcCgpIHtcbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwKCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVHYW1lYm9hcmRBdHRhY2soY29vcmRpbmF0ZXMpIHtcbiAgICBpZiAoIWNvb3JkaW5hdGVzKSByZXR1cm47XG5cbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICBlbmVteS5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcy5zcGxpdCgnLCcpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0Q3VycmVudCxcbiAgICBnZXRDdXJyZW50LFxuICAgIGdldE5vdEN1cnJlbnQsXG4gICAgZ2V0UGxheWVyTmFtZSxcbiAgICB0b2dnbGVDdXJyZW50LFxuICAgIGFkZFBsYXllcixcbiAgICBnZXRQbGF5ZXJQb3NzaWJsZUF0dGFja3MsXG4gICAgaGFuZGxlR2FtZWJvYXJkQXR0YWNrLFxuICAgIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlIaXRTaGlwLFxuICAgIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlTYW5rU2hpcCxcbiAgICBnZXRMYXN0QXR0YWNrQXRFbmVteVxuICB9XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImltcG9ydCB7XG4gIHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50LCBnZXRWYWxpZFBsYWNlbWVudENlbGxzXG59IGZyb20gXCIuL3NoaXBfdmFsaWRhdG9yXCI7XG5cbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9pbnB1dFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMoKSB7XG4gIGdlbmVyYXRlU2hpcHNSYW5kb21seSgpO1xuICBnZW5lcmF0ZVNoaXBzUmFuZG9tbHkoKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTaGlwc1JhbmRvbWx5KCkge1xuICBjb25zdCByZWFkeVNoaXBzID0gW1xuICBdO1xuXG4gIGNvbnN0IGNhcnJpZXIgPSBnZXRWYWxpZFNoaXAoNCwgcmVhZHlTaGlwcyk7XG4gIHJlYWR5U2hpcHMucHVzaChjYXJyaWVyKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGNvbnN0IGJhdHRsZXNoaXAgPSBnZXRWYWxpZFNoaXAoMywgcmVhZHlTaGlwcyk7XG4gICAgcmVhZHlTaGlwcy5wdXNoKGJhdHRsZXNoaXApO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBjb25zdCBjcnVpc2VyID0gZ2V0VmFsaWRTaGlwKDIsIHJlYWR5U2hpcHMpO1xuICAgIHJlYWR5U2hpcHMucHVzaChjcnVpc2VyKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgY29uc3QgcGF0cm9sQm9hdCA9IGdldFZhbGlkU2hpcCgxLCByZWFkeVNoaXBzKTtcbiAgICByZWFkeVNoaXBzLnB1c2gocGF0cm9sQm9hdCk7XG4gIH1cblxuICBJbnB1dC5wbGFjZVNoaXBzKHJlYWR5U2hpcHMpO1xufVxuXG5mdW5jdGlvbiBnZXRWYWxpZFNoaXAoc2hpcExlbmd0aCwgYWxsU2hpcHMpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRTaGlwID0gZ2VuZXJhdGVTaGlwKHNoaXBMZW5ndGgpO1xuXG4gICAgaWYgKHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50KGdlbmVyYXRlZFNoaXAsIGFsbFNoaXBzKSkge1xuICAgICAgcmV0dXJuIGdlbmVyYXRlZFNoaXA7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2hpcChzaGlwTGVuZ3RoKSB7XG4gIGNvbnN0IHZhbGlkQ2VsbHMgPSBnZXRWYWxpZFBsYWNlbWVudENlbGxzKHNoaXBMZW5ndGgpO1xuXG4gIGNvbnN0IGZpcnN0Q29vcmRpbmF0ZSA9IHZhbGlkQ2VsbHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsaWRDZWxscy5sZW5ndGgpXTtcbiAgY29uc3QgY29vcmRpbmF0ZVggPSBmaXJzdENvb3JkaW5hdGVbMF07XG4gIGNvbnN0IGNvb3JkaW5hdGVZID0gZmlyc3RDb29yZGluYXRlWzFdO1xuXG4gIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IFtbLi4uZmlyc3RDb29yZGluYXRlXV07XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHsgLy8gZ28gZnJvbSB0aGUgc2Vjb25kIGNvb3JkaW5hdGVcbiAgICBzaGlwQ29vcmRpbmF0ZXMucHVzaChbY29vcmRpbmF0ZVggKyBpLCBjb29yZGluYXRlWV0pO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTaGlwKC4uLnNoaXBDb29yZGluYXRlcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycztcbmV4cG9ydCB7IGdlbmVyYXRlU2hpcHNSYW5kb21seSB9IiwiZnVuY3Rpb24gU2hpcCguLi5jb29yZGluYXRlcykge1xuICAvKiBDb29yZGluYXRlcyBhcmUgc2hpcCdzIGxvY2F0aW9uIG9uIGJvYXJkICovXG4gIC8qIFRoZXkgYXJlIHJlY2VpdmVkIGFuZCBub3QgY3JlYXRlZCBoZXJlLiBMb29rIGxpa2UgWzIsIDNdICovXG4gIC8qIFBvc2l0aW9ucyBhcmUgc2hpcCdzIGlubmVyIGhhbmRsaW5nIG9mIHRoZXNlIGNvb3JkaW5hdGVzICovXG4gIC8qIFBvc2l0aW9ucyBhcmUgdXNlZCB3aGVuIGRlY2lkaW5nIHdoZXJlIHRoZSBzaGlwIGlzIGhpdCwgKi9cbiAgLyogV2hldGhlciBvciBub3QgaXQgaXMgc3VuaywgYW5kIHdoZXJlIGV4YWN0bHkgKi9cbiAgLyogVG8gaGl0IHRoZSBzaGlwIGluIHRoZSBmaXJzdCBwbGFjZSAqL1xuXG4gIGNvbnN0IF9wb3NpdGlvbnMgPSBfY3JlYXRlUG9zaXRpb25zKGNvb3JkaW5hdGVzLmxlbmd0aCk7XG5cbiAgY29uc3QgX2Nvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgdGhpcy5nZXRDb29yZGluYXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLl9jb29yZGluYXRlc107XG4gIH1cblxuICB0aGlzLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIF9wb3NpdGlvbnNbcG9zaXRpb25dO1xuICB9XG5cbiAgdGhpcy5pc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF9wb3NpdGlvbnMuZXZlcnkocG9zaXRpb24gPT4gcG9zaXRpb24uaXNIaXQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBIaXQgb25lIG9mIHNoaXAncyBwb3NpdGlvbnMgKi9cbiAgdGhpcy5oaXQgPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICBfcG9zaXRpb25zW3Bvc2l0aW9uXS5pc0hpdCA9IHRydWU7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuXG5cbmZ1bmN0aW9uIF9jcmVhdGVQb3NpdGlvbnMobGVuZ3RoKSB7XG4gIGNsYXNzIFBvc2l0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuaXNIaXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBwb3NpdGlvbnMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcG9zaXRpb25zLnB1c2gobmV3IFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgcmV0dXJuIHBvc2l0aW9ucztcbn0iLCJpbXBvcnQgeyBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcCwgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tICcuL2hlbHBlcic7XG5cbi8qIFRoZSBwdXJwb3NlIG9mIHRoaXMgbW9kdWxlIGlzIHRvIG5vdCBhbGxvdyB0byBwbGFjZSBzaGlwcyAqL1xuLyogQWRqYWNlbnQgdG8gZWFjaCBvdGhlci4gVGhlcmUgbXVzdCBiZSBzb21lIHNwYWNlIGJldHdlZW4gdGhlbSAqL1xuXG4vKiBGaXJzdCwgaXQgZGVmaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgcGxhY2VtZW50IGlzIHZhbGlkIHJlbGF0aXZlIHRvIG90aGVyIHNoaXBzIG9uIGJvYXJkICovXG4vKiBTZWNvbmQsIGl0IGNoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGUgY29vcmRpbmF0ZXMgYXJlIG5vdCBvdXRzaWRlIHRoZSBiYXR0bGVmaWVsZCAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVJlbGF0aXZlU2hpcFBsYWNlbWVudCh2YWxpZGF0ZWRTaGlwLCBzaGlwcykge1xuICAvKiBWYWxpZGF0ZSBhZ2FpbnN0IG90aGVyIHNoaXBzICovXG5cbiAgY29uc3Qgc2hpcENlbGxzID1cbiAgICBzdHJpbmdpZnlFbGVtZW50cyh2YWxpZGF0ZWRTaGlwLmdldENvb3JkaW5hdGVzKCkpO1xuXG4gIGNvbnN0IGFkamFjZW50U2hpcENvb3JkaW5hdGVzID1cbiAgICBzdHJpbmdpZnlFbGVtZW50cyhnZXRBZGphY2VudFNoaXBDb29yZGluYXRlcyhzaGlwcykpO1xuXG4gIGlmIChzaGlwQ2VsbHMuc29tZShjZWxsID0+IGFkamFjZW50U2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNlbGwpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5cbmZ1bmN0aW9uIGdldEFkamFjZW50U2hpcENvb3JkaW5hdGVzKHNoaXBzKSB7XG4gIGNvbnN0IGFkamFjZW50U2hpcENvb3JkaW5hdGVzID0gc2hpcHNcbiAgICAubWFwKHNoaXAgPT4ge1xuICAgICAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gc2hpcC5nZXRDb29yZGluYXRlcygpO1xuICAgICAgcmV0dXJuIGdldENlbGxzU3Vycm91bmRpbmdTaGlwKHNoaXBDb29yZGluYXRlcyk7XG4gICAgfSlcbiAgICAuZmxhdCgpO1xuXG4gIHNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gc2hpcC5nZXRDb29yZGluYXRlcygpO1xuICAgIHNoaXBDb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT4gYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMucHVzaChzdHJpbmdpZnlFbGVtZW50cyhjb29yZGluYXRlKSkpO1xuICB9KTtcblxuICByZXR1cm4gYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXM7XG59XG5cbmZ1bmN0aW9uIGdldFZhbGlkUGxhY2VtZW50Q2VsbHModmFsaWRhdGVkU2hpcExlbmd0aCkge1xuICBjb25zdCB2YWxpZFBsYWNlbWVudENlbGxzID0gW107XG5cbiAgc3dpdGNoICh2YWxpZGF0ZWRTaGlwTGVuZ3RoKSB7XG4gICAgY2FzZSA0OiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0Q2VsbHNWYWxpZEZvclNoaXBGb3VyKCkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgMzoge1xuICAgICAgdmFsaWRQbGFjZW1lbnRDZWxscy5wdXNoKC4uLmdldENlbGxzVmFsaWRGb3JTaGlwVGhyZWUoKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAyOiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0Q2VsbHNWYWxpZEZvclNoaXBUd28oKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAxOiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0QWxsQm9hcmQoKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsaWRQbGFjZW1lbnRDZWxscztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNWYWxpZEZvclNoaXBGb3VyKCkge1xuICBjb25zdCB2YWxpZENlbGxzID0gW107XG5cbiAgZm9yIChsZXQgeCA9IDE7IHggPD0gNzsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPCAxMDsgeSsrKSB7XG4gICAgICB2YWxpZENlbGxzLnB1c2goW3gsIHldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsaWRDZWxscztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNWYWxpZEZvclNoaXBUaHJlZSgpIHtcbiAgY29uc3QgdmFsaWRDZWxscyA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDg7IHgrKykge1xuICAgIGZvciAobGV0IHkgPSAxOyB5IDwgMTA7IHkrKykge1xuICAgICAgdmFsaWRDZWxscy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkQ2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxzVmFsaWRGb3JTaGlwVHdvKCkge1xuICBjb25zdCB2YWxpZENlbGxzID0gW107XG5cbiAgZm9yIChsZXQgeCA9IDE7IHggPD0gOTsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPD0gMTA7IHkrKykge1xuICAgICAgdmFsaWRDZWxscy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkQ2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbEJvYXJkKCkge1xuICBjb25zdCBhbGxCb2FyZCA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDEwOyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0gMTsgeSA8PSAxMDsgeSsrKSB7XG4gICAgICBhbGxCb2FyZC5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFsbEJvYXJkO1xufVxuXG5cbmV4cG9ydCB7IHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50LCBnZXRWYWxpZFBsYWNlbWVudENlbGxzIH0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7XG4gIGZpbGxCYXR0bGVmaWVsZHNXaXRoQ2VsbHMsXG4gIGNsZWFyQmF0dGxlZmllbGRzLFxuICBzaG93UGxheWVyU2hpcHMsXG59IGZyb20gXCIuL21vZHVsZXMvZG9tL2JhdHRsZWZpZWxkXCI7XG5pbXBvcnQgeyBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMgfSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9zdGFydF9tZW51XCI7XG5pbXBvcnQgeyBhZGRSZXN0YXJ0RXZlbnQgfSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9yZXN0YXJ0XCI7XG5cbmltcG9ydCBVSUdhbWVTdGF0ZSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9nYW1lX3N0YXRlXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9tb2R1bGVzL2dhbWVcIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi9tb2R1bGVzL2lucHV0XCI7XG5pbXBvcnQgZ2VuZXJhdGVTaGlwc0ZvckJvdGhQbGF5ZXJzIGZyb20gXCIuL21vZHVsZXMvcmFuZG9tX3NoaXBzXCI7XG5cbigoKSA9PiB7XG4gIGluaXRHYW1lKCk7XG4gIGFkZFJlc3RhcnRFdmVudChyZWNlaXZlUmVzdGFydCk7XG59KSgpO1xuXG5mdW5jdGlvbiBpbml0R2FtZSgpIHtcbiAgSW5wdXQuY2xlYXIoKTtcbiAgY2xlYXJCYXR0bGVmaWVsZHMoKTtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpO1xuICBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMoKTtcbiAgc2hvd1BsYXllclNoaXBzKCk7XG4gIGFkZEV2ZW50c1RvU3RhcnRNZW51QnV0dG9ucyhyZWNlaXZlU3RhcnQsIHJlY2VpdmVSYW5kb20pO1xufVxuXG5mdW5jdGlvbiByZWNlaXZlU3RhcnQoKSB7XG4gIEdhbWUuc3RhcnQoKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVJlc3RhcnQoKSB7XG4gIFVJR2FtZVN0YXRlLnRvZ2dsZVJlc3VsdCgpO1xuICBVSUdhbWVTdGF0ZS5zaG93UmVzdGFydCgpO1xuICBpbml0R2FtZSgpO1xufVxuXG5mdW5jdGlvbiByZWNlaXZlUmFuZG9tKCkge1xuXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9