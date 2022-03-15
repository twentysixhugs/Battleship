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
/* harmony import */ var _utils_input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/input */ "./src/modules/utils/input.js");

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

function showSunkShip(coordinates, attackedPlayer) {
  if (attackedPlayer === 'computer') {
    showShip(coordinates, attackedPlayer);
  }

  setShipToSunk(coordinates, attackedPlayer);
}

function _createAttack(attackResult) {
  const div = document.createElement('div');
  div.classList.add(`gameboard__${attackResult}`);

  return div;
}

/* Ships highlighting */

function showPlayerShips() {
  const playerShipsCoordinates =
    _utils_input__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerShips()
      .map(ship => ship.getCoordinates());

  playerShipsCoordinates.forEach((coordinates) => showShip(coordinates, 'player'));
}

function showShip(coordinates, player) {
  const firstCoordinate = coordinates[0];
  const cell = document.querySelector(`.js-cell--${player}[data-coordinate="${firstCoordinate}"]`);

  const ship = document.createElement('div');
  ship.classList.add('ship', `ship--${coordinates.length}`);
  cell.appendChild(ship);
}

function setShipToSunk(coordinates, player) {
  const ship = document.querySelector(`.js-cell--${player}[data-coordinate="${coordinates[0]}"] .ship`);
  ship.classList.add('ship--sunk');
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
/* harmony import */ var _utils_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/input */ "./src/modules/utils/input.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");
/* harmony import */ var _dom_game_state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/game_state */ "./src/modules/dom/game_state.js");
/* harmony import */ var _random_ships__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./random_ships */ "./src/modules/random_ships.js");
/* harmony import */ var _dom_battlefield__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom/battlefield */ "./src/modules/dom/battlefield.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");









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
    _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].clear();
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
        const sunkShip = attacked.gameboard.getLastAttackedShip();

        _attackCellsAroundSunkShip(attacked, sunkShip);
        (0,_dom_battlefield__WEBPACK_IMPORTED_MODULE_5__.showSunkShip)(sunkShip.getCoordinates(), _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].getPlayerName(attacked));
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
    const playerShips = _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].getPlayerShips();
    const computerShips = _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].getComputerShips();

    playerShips.forEach(ship => player.gameboard.placeShip(ship));
    computerShips.forEach(ship => computer.gameboard.placeShip(ship));
  }

  function _attackCellsAroundSunkShip(attacked, sunkShip) {
    const cellsToAttack = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_7__.getCellsSurroundingShip)(sunkShip.getCoordinates());
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
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");



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
    return this.getAllCells().filter(cell => !(0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(_attacks).includes(cell.toString()));
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
    const checkResult = _ships.find(ship => (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString()));

    return (checkResult) ? true : false;
  }

  this.checkLastAttackSankShip = function () {
    const lastAttack = this.getLastAttack();
    const lastShipHit = _ships.find(ship => (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString()));

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
          // hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate));
          ship.hit(ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
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
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");





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

      allValidAttacks = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_2__.stringifyElements)(allValidAttacks);

      const validGuessedAttacks = attacksToValidate.filter(
        attack => allValidAttacks.includes(attack.toString())
      );

      const nextAttack = validGuessedAttacks[Math.floor(Math.random() * validGuessedAttacks.length)];

      return nextAttack;
    } else {
      const cellsWhereMayBeShip = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_2__.getPerpendicularCells)(this.#lastHitAtShip); // Where there might be a ship

      allValidAttacks = (0,_utils_helper__WEBPACK_IMPORTED_MODULE_2__.stringifyElements)(allValidAttacks);

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
/* harmony import */ var _utils_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/input */ "./src/modules/utils/input.js");
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

  _utils_input__WEBPACK_IMPORTED_MODULE_1__["default"].placeShips(readyShips);
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
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");


/* The purpose of this module is to not allow to place ships */
/* Adjacent to each other. There must be some space between them */

/* First, it defines whether or not the placement is valid relative to other ships on board */
/* Second, it checks whether or not the coordinates are not outside the battlefield */

function validateRelativeShipPlacement(validatedShip, ships) {
  /* Validate against other ships */

  const shipCells =
    (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(validatedShip.getCoordinates());

  const adjacentShipCoordinates =
    (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(getAdjacentShipCoordinates(ships));

  if (shipCells.some(cell => adjacentShipCoordinates.includes(cell))) {
    return false;
  }

  return true;
}


function getAdjacentShipCoordinates(ships) {
  const adjacentShipCoordinates = ships
    .map(ship => {
      const shipCoordinates = ship.getCoordinates();
      return (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.getCellsSurroundingShip)(shipCoordinates);
    })
    .flat();

  ships.forEach(ship => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach(coordinate => adjacentShipCoordinates.push((0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(coordinate)));
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




/***/ }),

/***/ "./src/modules/utils/helper.js":
/*!*************************************!*\
  !*** ./src/modules/utils/helper.js ***!
  \*************************************/
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

/***/ "./src/modules/utils/input.js":
/*!************************************!*\
  !*** ./src/modules/utils/input.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src/modules/utils/helper.js");


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
/* harmony import */ var _modules_utils_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/utils/input */ "./src/modules/utils/input.js");
/* harmony import */ var _modules_random_ships__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/random_ships */ "./src/modules/random_ships.js");









(() => {
  initGame();
  (0,_modules_dom_restart__WEBPACK_IMPORTED_MODULE_2__.addRestartEvent)(receiveRestart);
})();

function initGame() {
  _modules_utils_input__WEBPACK_IMPORTED_MODULE_5__["default"].clear();
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
  _modules_utils_input__WEBPACK_IMPORTED_MODULE_5__["default"].clear();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.clearBattlefields)();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.fillBattlefieldsWithCells)();
  (0,_modules_random_ships__WEBPACK_IMPORTED_MODULE_6__["default"])();
  (0,_modules_dom_battlefield__WEBPACK_IMPORTED_MODULE_0__.showPlayerShips)();
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRm1DO0FBQ29DO0FBQ2Y7O0FBRUw7QUFDakI7QUFDUTtBQUN1Qjs7QUFFakU7QUFDQTtBQUNBLEVBQUUscUVBQWU7QUFDakIsQ0FBQzs7QUFFRDtBQUNBLEVBQUUsa0VBQVc7QUFDYixFQUFFLDJFQUFpQjtBQUNuQixFQUFFLG1GQUF5QjtBQUMzQixFQUFFLGlFQUEyQjtBQUM3QixFQUFFLHlFQUFlO0FBQ2pCLEVBQUUsb0ZBQTJCO0FBQzdCOztBQUVBO0FBQ0EsRUFBRSwyREFBVTtBQUNaOztBQUVBO0FBQ0EsRUFBRSw0RUFBd0I7QUFDMUIsRUFBRSwyRUFBdUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBLEVBQUUsa0VBQVc7QUFDYixFQUFFLDJFQUFpQjtBQUNuQixFQUFFLG1GQUF5QjtBQUMzQixFQUFFLGlFQUEyQjtBQUM3QixFQUFFLHlFQUFlO0FBQ2pCLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tL2JhdHRsZWZpZWxkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vY3VycmVudF9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS9nYW1lX3N0YXRlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vcmVzdGFydC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tL3N0YXJ0X21lbnUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXJfbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcmFuZG9tX3NoaXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwX3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdXRpbHMvaGVscGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy91dGlscy9pbnB1dC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSW5wdXQgZnJvbSBcIi4uL3V0aWxzL2lucHV0XCI7XG4vKiBDZWxscyBnZW5lcmF0aW9uIGFuZCBjbGVhcmluZyAqL1xuXG5mdW5jdGlvbiBmaWxsQmF0dGxlZmllbGRzV2l0aENlbGxzKCkge1xuICBjb25zdCBwbGF5ZXJCYXR0bGVmaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wbGF5ZXItYmF0dGxlZmllbGQnKTtcbiAgY29uc3QgY29tcHV0ZXJCYXR0bGVmaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb21wdXRlci1iYXR0bGVmaWVsZCcpO1xuXG4gIGZpbGxXaXRoQ2VsbHMocGxheWVyQmF0dGxlZmllbGQsICdqcy1jZWxsLS1wbGF5ZXInLCAnanMtY2VsbCcpO1xuICBmaWxsV2l0aENlbGxzKGNvbXB1dGVyQmF0dGxlZmllbGQsICdqcy1jZWxsLS1jb21wdXRlcicsICdqcy1jZWxsJyk7XG59XG5cbmZ1bmN0aW9uIGZpbGxXaXRoQ2VsbHMoYmF0dGxlZmllbGQsIC4uLmpzQ2xhc3NOYW1lcykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDE7IGogPD0gMTA7IGorKykge1xuICAgICAgYmF0dGxlZmllbGQuYXBwZW5kQ2hpbGQoX2NyZWF0ZUNlbGwoW2osIGldLCBqc0NsYXNzTmFtZXMpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlQ2VsbChjb29yZGluYXRlLCBqc0NsYXNzTmFtZXMpIHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdnYW1lYm9hcmRfX2NlbGwnLCAuLi5qc0NsYXNzTmFtZXMpO1xuICAgIGNlbGwuZGF0YXNldC5jb29yZGluYXRlID0gY29vcmRpbmF0ZTtcblxuICAgIHJldHVybiBjZWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyQmF0dGxlZmllbGRzKCkge1xuICBjb25zdCBwbGF5ZXJCYXR0bGVmaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wbGF5ZXItYmF0dGxlZmllbGQnKTtcbiAgY29uc3QgY29tcHV0ZXJCYXR0bGVmaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb21wdXRlci1iYXR0bGVmaWVsZCcpO1xuXG4gIHBsYXllckJhdHRsZWZpZWxkLnRleHRDb250ZW50ID0gXCJcIjtcbiAgY29tcHV0ZXJCYXR0bGVmaWVsZC50ZXh0Q29udGVudCA9IFwiXCI7XG59XG5cbi8qIFJlc3BvbnNlIHRvIGF0dGFjayAqL1xuXG5mdW5jdGlvbiBzaG93TWlzc2VkQXR0YWNrKGNvb3JkaW5hdGUsIGVuZW15KSB7XG4gIGNvbnN0IG1pc3NlZEF0dGFja0RpdiA9IF9jcmVhdGVBdHRhY2soJ21pc3NlZCcpO1xuICBjb25zdCBhdHRhY2tlZENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuanMtY2VsbC0tJHtlbmVteX1bZGF0YS1jb29yZGluYXRlPVwiJHtjb29yZGluYXRlfVwiXWApO1xuXG4gIGlmICghYXR0YWNrZWRDZWxsKSByZXR1cm47XG5cbiAgYXR0YWNrZWRDZWxsLmFwcGVuZENoaWxkKG1pc3NlZEF0dGFja0Rpdik7XG59XG5cbmZ1bmN0aW9uIHNob3dIaXRBdFNoaXAoY29vcmRpbmF0ZSwgZW5lbXkpIHtcbiAgY29uc3Qgc2hpcEF0dGFja0RpdiA9IF9jcmVhdGVBdHRhY2soJ2hpdCcpO1xuICBjb25zdCBhdHRhY2tlZENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuanMtY2VsbC0tJHtlbmVteX1bZGF0YS1jb29yZGluYXRlPVwiJHtjb29yZGluYXRlfVwiXWApO1xuXG4gIGF0dGFja2VkQ2VsbC5hcHBlbmRDaGlsZChzaGlwQXR0YWNrRGl2KTtcbn1cblxuZnVuY3Rpb24gc2hvd1N1bmtTaGlwKGNvb3JkaW5hdGVzLCBhdHRhY2tlZFBsYXllcikge1xuICBpZiAoYXR0YWNrZWRQbGF5ZXIgPT09ICdjb21wdXRlcicpIHtcbiAgICBzaG93U2hpcChjb29yZGluYXRlcywgYXR0YWNrZWRQbGF5ZXIpO1xuICB9XG5cbiAgc2V0U2hpcFRvU3Vuayhjb29yZGluYXRlcywgYXR0YWNrZWRQbGF5ZXIpO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlQXR0YWNrKGF0dGFja1Jlc3VsdCkge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoYGdhbWVib2FyZF9fJHthdHRhY2tSZXN1bHR9YCk7XG5cbiAgcmV0dXJuIGRpdjtcbn1cblxuLyogU2hpcHMgaGlnaGxpZ2h0aW5nICovXG5cbmZ1bmN0aW9uIHNob3dQbGF5ZXJTaGlwcygpIHtcbiAgY29uc3QgcGxheWVyU2hpcHNDb29yZGluYXRlcyA9XG4gICAgSW5wdXRcbiAgICAgIC5nZXRQbGF5ZXJTaGlwcygpXG4gICAgICAubWFwKHNoaXAgPT4gc2hpcC5nZXRDb29yZGluYXRlcygpKTtcblxuICBwbGF5ZXJTaGlwc0Nvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGVzKSA9PiBzaG93U2hpcChjb29yZGluYXRlcywgJ3BsYXllcicpKTtcbn1cblxuZnVuY3Rpb24gc2hvd1NoaXAoY29vcmRpbmF0ZXMsIHBsYXllcikge1xuICBjb25zdCBmaXJzdENvb3JkaW5hdGUgPSBjb29yZGluYXRlc1swXTtcbiAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5qcy1jZWxsLS0ke3BsYXllcn1bZGF0YS1jb29yZGluYXRlPVwiJHtmaXJzdENvb3JkaW5hdGV9XCJdYCk7XG5cbiAgY29uc3Qgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnLCBgc2hpcC0tJHtjb29yZGluYXRlcy5sZW5ndGh9YCk7XG4gIGNlbGwuYXBwZW5kQ2hpbGQoc2hpcCk7XG59XG5cbmZ1bmN0aW9uIHNldFNoaXBUb1N1bmsoY29vcmRpbmF0ZXMsIHBsYXllcikge1xuICBjb25zdCBzaGlwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmpzLWNlbGwtLSR7cGxheWVyfVtkYXRhLWNvb3JkaW5hdGU9XCIke2Nvb3JkaW5hdGVzWzBdfVwiXSAuc2hpcGApO1xuICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAtLXN1bmsnKTtcbn1cblxuZXhwb3J0IHtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscyxcbiAgY2xlYXJCYXR0bGVmaWVsZHMsXG4gIHNob3dNaXNzZWRBdHRhY2ssXG4gIHNob3dIaXRBdFNoaXAsXG4gIHNob3dTdW5rU2hpcCxcbiAgc2hvd1BsYXllclNoaXBzLFxuICBzaG93U2hpcCxcbn0iLCJmdW5jdGlvbiBwbGF5ZXJUdXJuKCkge1xuXG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVyVHVybigpIHtcblxufVxuXG5leHBvcnQge1xuICBwbGF5ZXJUdXJuLFxuICBjb21wdXRlclR1cm5cbn0iLCJpbXBvcnQgeyBwbGF5ZXJUdXJuLCBjb21wdXRlclR1cm4gfSBmcm9tIFwiLi9jdXJyZW50X3BsYXllclwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4uL3BsYXllcl9tYW5hZ2VyXCI7XG5cbmNvbnN0IFVJR2FtZVN0YXRlID0gKCgpID0+IHtcbiAgbGV0IF9jdXJyZW50UGxheWVyO1xuICBsZXQgX2lzU3RhcnRHYW1lID0gdHJ1ZTtcblxuICAvKiBHYW1lIHN0YXJ0ICovXG5cbiAgZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICAgIF9jdXJyZW50UGxheWVyID0gJ3BsYXllcic7XG4gICAgX3RvZ2dsZVN0YXJ0R2FtZUludGVyZmFjZVZpc2liaWxpdHkoKTtcbiAgICBfZGlzYWJsZVN0YXJ0R2FtZUludGVyZmFjZSgpO1xuICAgIF90b2dnbGVCb2FyZERlc2NyaXB0aW9ucygpO1xuICAgIHBsYXllclR1cm4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BHYW1lKCkge1xuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dHYW1lUmVzdWx0KGlzUGxheWVyV2lubmVyKSB7XG4gICAgaWYgKGlzUGxheWVyV2lubmVyKSB7XG4gICAgICBfc2hvd1BsYXllclZpY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3Nob3dQbGF5ZXJEZWZlYXQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd1BsYXllclZpY3RvcnkoKSB7XG4gICAgdG9nZ2xlUmVzdWx0KCk7XG4gICAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3VsdCcpO1xuICAgIHJlc3VsdC50ZXh0Q29udGVudCA9ICdWaWN0b3J5ISc7XG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd1BsYXllckRlZmVhdCgpIHtcbiAgICB0b2dnbGVSZXN1bHQoKTtcbiAgICBjb25zdCByZXN1bHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmVzdWx0Jyk7XG4gICAgcmVzdWx0LnRleHRDb250ZW50ID0gJ0RlZmVhdCEnO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlUmVzdWx0KCkge1xuICAgIGNvbnN0IHJlc3VsdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb250YWluZXItLXJlc3VsdCcpO1xuICAgIHJlc3VsdENvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKCdpcy12aXNpYmxlJyk7XG4gIH1cblxuICAvKiBHYW1lIHJlc3RhcnQgKi9cblxuICBmdW5jdGlvbiBzaG93UmVzdGFydCgpIHtcbiAgICBfdG9nZ2xlU3RhcnRHYW1lSW50ZXJmYWNlVmlzaWJpbGl0eSgpO1xuICAgIF90b2dnbGVCb2FyZERlc2NyaXB0aW9ucygpO1xuICB9XG5cbiAgLyogUGxheWVyIGFuZCBjb21wdXRlciBtb3ZlICovXG5cbiAgLyogVGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBvbmNlIHRoZSBjZWxsIGlzIGNsaWNrZWQgKi9cbiAgLyogVGhlIG91dGVyIG1vZHVsZSwgZ2FtZSwgd2lsbCBhd2FpdCBmb3IgdGhlIHByb21pc2UgdG8gcmVzb2x2ZSwgKi9cbiAgLyogQW5kIHRoZSBtb3ZlIGNhcHR1cmVkIGluIHRoaXMgbW9kdWxlIHdpbGwgYmUgaGFuZGxlZCAqL1xuXG4gIGZ1bmN0aW9uIHBsYXllck1vdmUocGxheWVyKSB7XG4gICAgcmVtb3ZlQWxsTW92ZUxpc3RlbmVycygpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIF9hZGRNb3ZlTGlzdGVuZXJGb3JFbmVteUNlbGxzKHJlc29sdmUsICcuanMtY2VsbC0tY29tcHV0ZXInKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXB1dGVyTW92ZShjb21wdXRlcikge1xuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBfYWRkTW92ZUxpc3RlbmVyRm9yRW5lbXlDZWxscyhyZXNvbHZlLCAnLmpzLWNlbGwtLXBsYXllcicpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbXB1dGVyLm1ha2VNb3ZlKCk7XG4gICAgICB9LCA1MDApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2FkZE1vdmVMaXN0ZW5lckZvckVuZW15Q2VsbHMocHJvbWlzZVJlc29sdmVDYWxsYmFjaywgZW5lbXlDZWxsc0hUTUxDbGFzcykge1xuICAgIGNvbnN0IGVuZW15Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVuZW15Q2VsbHNIVE1MQ2xhc3MpO1xuXG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKGNlbGwgPT4gY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LmRhdGFzZXQuY29vcmRpbmF0ZSkgcmV0dXJuO1xuICAgICAgUGxheWVyTWFuYWdlci5oYW5kbGVHYW1lYm9hcmRBdHRhY2soZS50YXJnZXQuZGF0YXNldC5jb29yZGluYXRlKTtcbiAgICAgIHByb21pc2VSZXNvbHZlQ2FsbGJhY2soKTtcbiAgICB9KSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVBbGxNb3ZlTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IGNlbGxzV2l0aExpc3RlbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5qcy1jZWxsLS1wbGF5ZXIsIC5qcy1jZWxsLS1jb21wdXRlcmApO1xuXG4gICAgY2VsbHNXaXRoTGlzdGVuZXJzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICBsZXQgY2VsbFdpdGhvdXRMaXN0ZW5lciA9IGNlbGwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgY2VsbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjZWxsV2l0aG91dExpc3RlbmVyLCBjZWxsKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gdG9nZ2xlQ3VycmVudFBsYXllcigpIHtcbiAgICBpZiAoX2N1cnJlbnRQbGF5ZXIgPT09ICdwbGF5ZXInKSB7XG4gICAgICBfY3VycmVudFBsYXllciA9ICdjb21wdXRlcic7XG4gICAgICBjb21wdXRlclR1cm4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX2N1cnJlbnRQbGF5ZXIgPSAncGxheWVyJztcbiAgICAgIHBsYXllclR1cm4oKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZGlzYWJsZVN0YXJ0R2FtZUludGVyZmFjZSgpIHtcbiAgICBjb25zdCBidXR0b25zV2l0aExpc3RlbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1yYW5kb20sIC5qcy1zdGFydCcpO1xuXG4gICAgYnV0dG9uc1dpdGhMaXN0ZW5lcnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgbGV0IGJ1dHRvbldpdGhvdXRMaXN0ZW5lciA9IGJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBidXR0b24ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYnV0dG9uV2l0aG91dExpc3RlbmVyLCBidXR0b24pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3RvZ2dsZVN0YXJ0R2FtZUludGVyZmFjZVZpc2liaWxpdHkoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJHYW1lYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29tcHV0ZXItZ2FtZWJvYXJkJyk7XG4gICAgY29uc3QgZ2FtZWJvYXJkQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1yYW5kb20sIC5qcy1zdGFydCcpO1xuXG4gICAgY29tcHV0ZXJHYW1lYm9hcmQuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpO1xuICAgIGdhbWVib2FyZEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXZpc2libGUnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfdG9nZ2xlQm9hcmREZXNjcmlwdGlvbnMoKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWRlc2NyaXB0aW9uJyk7XG4gICAgZGVzY3JpcHRpb25zLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXZpc2libGUnKSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXJ0R2FtZSxcbiAgICBzdG9wR2FtZSxcbiAgICBzaG93R2FtZVJlc3VsdCxcbiAgICB0b2dnbGVSZXN1bHQsXG4gICAgdG9nZ2xlQ3VycmVudFBsYXllcixcbiAgICBwbGF5ZXJNb3ZlLFxuICAgIGNvbXB1dGVyTW92ZSxcbiAgICBzaG93UmVzdGFydCxcbiAgICByZW1vdmVBbGxNb3ZlTGlzdGVuZXJzLFxuICB9XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBVSUdhbWVTdGF0ZTsiLCJmdW5jdGlvbiBhZGRSZXN0YXJ0RXZlbnQoY2FsbGJhY2spIHtcbiAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yZXN0YXJ0Jyk7XG4gIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYWxsYmFjayk7XG59XG5cbmV4cG9ydCB7XG4gIGFkZFJlc3RhcnRFdmVudCxcbn0iLCJmdW5jdGlvbiBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMoc3RhcnRDYWxsYmFjaywgcmFuZG9tQ2FsbGJhY2spIHtcbiAgY29uc3Qgc3RhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc3RhcnQnKTtcbiAgY29uc3QgcmFuZG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJhbmRvbScpXG4gIHN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3RhcnRDYWxsYmFjayk7XG4gIHJhbmRvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJhbmRvbUNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IHtcbiAgYWRkRXZlbnRzVG9TdGFydE1lbnVCdXR0b25zLFxufSIsImltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuL3BsYXllcl9tYW5hZ2VyXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vdXRpbHMvaW5wdXRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcbmltcG9ydCBVSUdhbWVTdGF0ZSBmcm9tIFwiLi9kb20vZ2FtZV9zdGF0ZVwiO1xuaW1wb3J0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycyBmcm9tIFwiLi9yYW5kb21fc2hpcHNcIjtcbmltcG9ydCB7IHNob3dIaXRBdFNoaXAsIHNob3dNaXNzZWRBdHRhY2ssIHNob3dTdW5rU2hpcCB9IGZyb20gXCIuL2RvbS9iYXR0bGVmaWVsZFwiO1xuaW1wb3J0IHsgQ29tcHV0ZXIsIFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAgfSBmcm9tIFwiLi91dGlscy9oZWxwZXJcIjtcblxuY29uc3QgR2FtZSA9ICgoKSA9PiB7XG4gIGxldCBfZ2FtZUdvaW5nID0gZmFsc2U7XG4gIGxldCBfd2lubmVyID0gbnVsbDtcbiAgbGV0IHBsYXllciA9IG51bGw7XG4gIGxldCBjb21wdXRlciA9IG51bGw7XG5cbiAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgX2luaXRQbGF5ZXJzKCk7XG4gICAgX3BsYWNlU2hpcHMocGxheWVyLCBjb21wdXRlcik7XG4gICAgX2luaXRVSSgpO1xuXG4gICAgX2dhbWVHb2luZyA9IHRydWU7XG4gICAgX2dhbWVsb29wKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfc3RvcCgpIHtcbiAgICBfZ2FtZUdvaW5nID0gZmFsc2U7XG4gICAgSW5wdXQuY2xlYXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbml0UGxheWVycygpIHtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKCdwbGF5ZXInKTtcbiAgICBjb21wdXRlciA9IG5ldyBDb21wdXRlcignY29tcHV0ZXInKTtcblxuICAgIFBsYXllck1hbmFnZXIuYWRkUGxheWVyKHBsYXllcik7XG4gICAgUGxheWVyTWFuYWdlci5hZGRQbGF5ZXIoY29tcHV0ZXIpO1xuICAgIFBsYXllck1hbmFnZXIuc2V0Q3VycmVudChwbGF5ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luaXRVSSgpIHtcbiAgICBVSUdhbWVTdGF0ZS5zdGFydEdhbWUoKTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIF9nYW1lbG9vcCgpIHtcbiAgICB3aGlsZSAoX2dhbWVHb2luZykge1xuICAgICAgYXdhaXQgbmV4dE1vdmUoKTtcblxuICAgICAgY29uc3QgYXR0YWNrZXIgPSBQbGF5ZXJNYW5hZ2VyLmdldEN1cnJlbnQoKTtcbiAgICAgIGNvbnN0IGF0dGFja2VkID0gUGxheWVyTWFuYWdlci5nZXROb3RDdXJyZW50KCk7XG5cbiAgICAgIGlmICghYXR0YWNrZWQuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFhdHRhY2tlZC5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrSGl0U2hpcCgpKSB7XG4gICAgICAgIC8qIElmIHRoZSBsYXN0IGF0dGFjayBkaWQgbm90IGhpdCBhIHNoaXAgKi9cbiAgICAgICAgUGxheWVyTWFuYWdlci50b2dnbGVDdXJyZW50KCk7XG4gICAgICAgIFVJR2FtZVN0YXRlLnRvZ2dsZUN1cnJlbnRQbGF5ZXIoKTtcbiAgICAgICAgc2hvd01pc3NlZEF0dGFjayhhdHRhY2tlZC5nYW1lYm9hcmQuZ2V0TGFzdEF0dGFjaygpLCBhdHRhY2tlZC5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3dIaXRBdFNoaXAoYXR0YWNrZWQuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2soKSwgYXR0YWNrZWQubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRhY2tlZC5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrU2Fua1NoaXAoKSkge1xuICAgICAgICBjb25zdCBzdW5rU2hpcCA9IGF0dGFja2VkLmdhbWVib2FyZC5nZXRMYXN0QXR0YWNrZWRTaGlwKCk7XG5cbiAgICAgICAgX2F0dGFja0NlbGxzQXJvdW5kU3Vua1NoaXAoYXR0YWNrZWQsIHN1bmtTaGlwKTtcbiAgICAgICAgc2hvd1N1bmtTaGlwKHN1bmtTaGlwLmdldENvb3JkaW5hdGVzKCksIFBsYXllck1hbmFnZXIuZ2V0UGxheWVyTmFtZShhdHRhY2tlZCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0YWNrZWQuaXNHYW1lT3ZlcigpKSB7XG4gICAgICAgIF9zdG9wKCk7XG4gICAgICAgIF93aW5uZXIgPSBhdHRhY2tlcjtcblxuICAgICAgICBVSUdhbWVTdGF0ZS5zdG9wR2FtZSgpO1xuICAgICAgICBVSUdhbWVTdGF0ZS5zaG93R2FtZVJlc3VsdChfd2lubmVyID09PSBwbGF5ZXIgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBuZXh0TW92ZSgpIHtcbiAgICAgIGlmIChQbGF5ZXJNYW5hZ2VyLmdldEN1cnJlbnQoKSA9PT0gcGxheWVyKSB7XG4gICAgICAgIGF3YWl0IFVJR2FtZVN0YXRlLnBsYXllck1vdmUocGxheWVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKFBsYXllck1hbmFnZXIuZ2V0Q3VycmVudCgpID09PSBjb21wdXRlcikge1xuICAgICAgICBhd2FpdCBVSUdhbWVTdGF0ZS5jb21wdXRlck1vdmUoY29tcHV0ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9wbGFjZVNoaXBzKHBsYXllciwgY29tcHV0ZXIpIHtcbiAgICBjb25zdCBwbGF5ZXJTaGlwcyA9IElucHV0LmdldFBsYXllclNoaXBzKCk7XG4gICAgY29uc3QgY29tcHV0ZXJTaGlwcyA9IElucHV0LmdldENvbXB1dGVyU2hpcHMoKTtcblxuICAgIHBsYXllclNoaXBzLmZvckVhY2goc2hpcCA9PiBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwKSk7XG4gICAgY29tcHV0ZXJTaGlwcy5mb3JFYWNoKHNoaXAgPT4gY29tcHV0ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfYXR0YWNrQ2VsbHNBcm91bmRTdW5rU2hpcChhdHRhY2tlZCwgc3Vua1NoaXApIHtcbiAgICBjb25zdCBjZWxsc1RvQXR0YWNrID0gZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAoc3Vua1NoaXAuZ2V0Q29vcmRpbmF0ZXMoKSk7XG4gICAgY2VsbHNUb0F0dGFjay5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgYXR0YWNrZWQuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY2VsbCk7XG5cbiAgICAgIGlmIChhdHRhY2tlZC5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgIHNob3dNaXNzZWRBdHRhY2soY2VsbCwgUGxheWVyTWFuYWdlci5nZXRQbGF5ZXJOYW1lKGF0dGFja2VkKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBVSUdhbWVTdGF0ZS5yZW1vdmVBbGxNb3ZlTGlzdGVuZXJzKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXJ0LFxuICB9XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lOyIsImltcG9ydCB7IHN0cmluZ2lmeUVsZW1lbnRzIH0gZnJvbSBcIi4vdXRpbHMvaGVscGVyXCJcblxuXG5mdW5jdGlvbiBHYW1lYm9hcmQoKSB7XG4gIGNvbnN0IF9sZW5ndGggPSAxMDsgLy8gMTAgeCAxMCBib2FyZFxuICBjb25zdCBfc2hpcHMgPSBbXTtcbiAgY29uc3QgX21pc3NlZEF0dGFja3MgPSBbXTtcbiAgY29uc3QgX2F0dGFja3MgPSBbXTtcblxuICB0aGlzLmdldExlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xlbmd0aDtcbiAgfVxuXG4gIHRoaXMuZ2V0U2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5fc2hpcHNdO1xuICB9XG5cbiAgdGhpcy5nZXRNaXNzZWRBdHRhY2tzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX21pc3NlZEF0dGFja3NdO1xuICB9XG5cbiAgdGhpcy5nZXRBbGxBdHRhY2tzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX2F0dGFja3NdO1xuICB9XG5cbiAgdGhpcy5nZXRQb3NzaWJsZUF0dGFja3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsQ2VsbHMoKS5maWx0ZXIoY2VsbCA9PiAhc3RyaW5naWZ5RWxlbWVudHMoX2F0dGFja3MpLmluY2x1ZGVzKGNlbGwudG9TdHJpbmcoKSkpO1xuICB9XG5cbiAgdGhpcy5nZXRMYXN0QXR0YWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfYXR0YWNrc1tfYXR0YWNrcy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIHRoaXMuZ2V0TGFzdEF0dGFja2VkU2hpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBsYXN0QXR0YWNrID0gdGhpcy5nZXRMYXN0QXR0YWNrKCk7XG5cbiAgICBjb25zdCBsYXN0QXR0YWNrZWRTaGlwID1cbiAgICAgIF9zaGlwc1xuICAgICAgICAuZmluZChcbiAgICAgICAgICBzaGlwID0+IHNoaXBcbiAgICAgICAgICAgIC5nZXRDb29yZGluYXRlcygpXG4gICAgICAgICAgICAuc29tZShjb29yZGluYXRlID0+IGNvb3JkaW5hdGUudG9TdHJpbmcoKSA9PT0gbGFzdEF0dGFjay50b1N0cmluZygpKVxuICAgICAgICApO1xuXG4gICAgcmV0dXJuIGxhc3RBdHRhY2tlZFNoaXA7XG4gIH1cblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IHRoaXMuZ2V0TGFzdEF0dGFjaygpO1xuICAgIGNvbnN0IGNoZWNrUmVzdWx0ID0gX3NoaXBzLmZpbmQoc2hpcCA9PiBzdHJpbmdpZnlFbGVtZW50cyhzaGlwLmdldENvb3JkaW5hdGVzKCkpLmluY2x1ZGVzKGxhc3RBdHRhY2sudG9TdHJpbmcoKSkpO1xuXG4gICAgcmV0dXJuIChjaGVja1Jlc3VsdCkgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSB0aGlzLmdldExhc3RBdHRhY2soKTtcbiAgICBjb25zdCBsYXN0U2hpcEhpdCA9IF9zaGlwcy5maW5kKHNoaXAgPT4gc3RyaW5naWZ5RWxlbWVudHMoc2hpcC5nZXRDb29yZGluYXRlcygpKS5pbmNsdWRlcyhsYXN0QXR0YWNrLnRvU3RyaW5nKCkpKTtcblxuICAgIHJldHVybiBsYXN0U2hpcEhpdCA/IGxhc3RTaGlwSGl0LmlzU3VuaygpIDogZmFsc2U7XG4gIH1cblxuICB0aGlzLmdldEFsbENlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFsbENlbGxzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBfbGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IF9sZW5ndGg7IGorKykge1xuICAgICAgICBhbGxDZWxscy5wdXNoKFtpLCBqXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5hbGxDZWxsc107XG4gIH1cblxuXG4gIGZ1bmN0aW9uIF9wbGFjZU1pc3NlZEF0dGFjayhhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgX21pc3NlZEF0dGFja3MucHVzaChhdHRhY2tDb29yZGluYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wbGFjZUF0dGFjayhhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgX2F0dGFja3MucHVzaChhdHRhY2tDb29yZGluYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pc0F0dGFja2luZ0FscmVhZHlBdHRhY2tlZENlbGwoYXR0YWNrQ29vcmRpbmF0ZVN0cikge1xuICAgIGZvciAoY29uc3QgYXR0YWNrIG9mIF9hdHRhY2tzKSB7XG4gICAgICBpZiAoYXR0YWNrLnRvU3RyaW5nKCkgPT09IGF0dGFja0Nvb3JkaW5hdGVTdHIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5wbGFjZVNoaXAgPSBmdW5jdGlvbiAoc2hpcCkge1xuICAgIF9zaGlwcy5wdXNoKHNoaXApO1xuICB9XG5cbiAgdGhpcy5hcmVBbGxTaGlwc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9zaGlwcy5ldmVyeShzaGlwID0+IHNoaXAuaXNTdW5rKCkpO1xuICB9XG5cbiAgbGV0IF9sYXN0QXR0YWNrU3VjY2Vzc2Z1bDtcblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9sYXN0QXR0YWNrU3VjY2Vzc2Z1bDtcbiAgfVxuXG4gIHRoaXMucmVjZWl2ZUF0dGFjayA9IGZ1bmN0aW9uIChhdHRhY2tDb29yZGluYXRlKSB7XG4gICAgLyogQ2hlY2sgaWYgaXQgZG9lcyBub3QgYXR0YWNrIGFuIGFscmVhZHkgYXR0YWNrZWQgY29vcmRpbmF0ZSAqL1xuICAgIGNvbnN0IGF0dGFja0Nvb3JkaW5hdGVTdHIgPSBhdHRhY2tDb29yZGluYXRlLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAoX2lzQXR0YWNraW5nQWxyZWFkeUF0dGFja2VkQ2VsbChhdHRhY2tDb29yZGluYXRlU3RyKSkge1xuICAgICAgX2xhc3RBdHRhY2tTdWNjZXNzZnVsID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgX3BsYWNlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuXG4gICAgZm9yIChjb25zdCBzaGlwIG9mIF9zaGlwcykge1xuICAgICAgZm9yIChjb25zdCBzaGlwQ29vcmRpbmF0ZSBvZiBzaGlwLmdldENvb3JkaW5hdGVzKCkpIHtcbiAgICAgICAgaWYgKHNoaXBDb29yZGluYXRlLnRvU3RyaW5nKCkgPT09IGF0dGFja0Nvb3JkaW5hdGVTdHIpIHtcbiAgICAgICAgICAvLyBoaXRTaGlwKHNoaXAsIHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKS5pbmRleE9mKHNoaXBDb29yZGluYXRlKSk7XG4gICAgICAgICAgc2hpcC5oaXQoc2hpcC5nZXRDb29yZGluYXRlcygpLmluZGV4T2Yoc2hpcENvb3JkaW5hdGUpKTsgLy8gaGl0IHRoZSBzaGlwIGF0IHRoaXMgcG9zaXRpb25cbiAgICAgICAgICBfbGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9wbGFjZU1pc3NlZEF0dGFjayhhdHRhY2tDb29yZGluYXRlKTtcbiAgICBfbGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDsiLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4vcGxheWVyX21hbmFnZXJcIjtcbmltcG9ydCB7IGdldFBlcnBlbmRpY3VsYXJDZWxscyB9IGZyb20gXCIuL3V0aWxzL2hlbHBlclwiO1xuaW1wb3J0IHsgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tIFwiLi91dGlscy9oZWxwZXJcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgI2dhbWVib2FyZDtcbiAgI25hbWU7XG5cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMuI25hbWUgPSBuYW1lO1xuICAgIHRoaXMuI2dhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICBQbGF5ZXJNYW5hZ2VyLmFkZFBsYXllcih0aGlzKTtcbiAgfVxuXG4gIGdldCBnYW1lYm9hcmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2dhbWVib2FyZDtcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNuYW1lO1xuICB9XG5cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICByZXR1cm4gdGhpcy4jZ2FtZWJvYXJkLmFyZUFsbFNoaXBzU3VuaygpO1xuICB9XG59XG5cbmNsYXNzIENvbXB1dGVyIGV4dGVuZHMgUGxheWVyIHtcbiAgI2xhc3RIaXRBdFNoaXAgPSBudWxsO1xuXG4gICN0cnlpbmdUb1NpbmtTaGlwID0gZmFsc2U7IC8vIEl0IHdpbGwgdHJ5IHRvIHNpbmsgYSBzaGlwIGlmIGl0IGhpdCBpdFxuXG4gICNmaXJzdEhpdEF0U2hpcCA9IG51bGw7IC8vIFRoZSB2ZXJ5IGZpcnN0IHNoaXAncyBjb29yZGluYXRlIGF0dGFja2VkXG5cbiAgLy8gSWYgdGhlIHNoaXAgaXMgYXR0YWNrZWQgdHdpY2UsIGl0IHdpbGwgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHNoaXAgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxuICAjYXR0YWNrRGlyZWN0aW9uID0gbnVsbDtcblxuICAjaGl0c0F0U2hpcCA9IFtdOyAvLyBBbGwgaGl0cyBhdCB0aGUgY3VycmVudCBzaGlwIHRoYXQgaXQgaXMgdHJ5aW5nIHRvIGF0dGFjayBhbmQgc2lua1xuICAjZ3Vlc3NlZFNoaXBQb3NpdGlvbnMgPSBbXTsgLy8gSXQgd2lsbCBndWVzcyB3aGVyZSB0aGUgc2hpcCBtYXkgYmVcblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIobmFtZSk7XG4gIH1cblxuICAvKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzIGFyZSBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5ICovXG5cbiAgZ2V0IGxhc3RIaXRBdFNoaXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhc3RIaXRBdFNoaXA7XG4gIH1cblxuICBnZXQgdHJ5aW5nVG9TaW5rU2hpcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJ5aW5nVG9TaW5rU2hpcDtcbiAgfVxuXG4gIHNldCBsYXN0SGl0QXRTaGlwKHZhbHVlKSB7XG4gICAgdGhpcy4jbGFzdEhpdEF0U2hpcCA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IHRyeWluZ1RvU2lua1NoaXAodmFsdWUpIHtcbiAgICB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwID0gdmFsdWU7XG4gIH1cblxuXG4gIG1ha2VNb3ZlKCkge1xuICAgIGNvbnN0IHBvc3NpYmxlQXR0YWNrcyA9IFBsYXllck1hbmFnZXIuZ2V0UGxheWVyUG9zc2libGVBdHRhY2tzKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuI3RyeWluZ1RvU2lua1NoaXApIHtcbiAgICAgIHRoaXMuY3VycmVudEF0dGFjayA9IHRoaXMuI2dldFBvdGVudGlhbEF0dGFja1RvU2lua1NoaXAocG9zc2libGVBdHRhY2tzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50QXR0YWNrID0gdGhpcy4jZ2V0UmFuZG9tQ29vcmRpbmF0ZXMocG9zc2libGVBdHRhY2tzKTtcbiAgICB9XG5cbiAgICB0aGlzLiNhdHRhY2tJbkRPTSh0aGlzLmN1cnJlbnRBdHRhY2spO1xuICAgIHRoaXMuZGVmaW5lTmV4dE1vdmUoKTtcbiAgfVxuXG4gICNnZXRSYW5kb21Db29yZGluYXRlcyhwb3NzaWJsZUF0dGFja3MpIHtcbiAgICByZXR1cm4gcG9zc2libGVBdHRhY2tzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQXR0YWNrcy5sZW5ndGgpXTtcbiAgfVxuXG4gICNnZXRQb3RlbnRpYWxBdHRhY2tUb1NpbmtTaGlwKGFsbFZhbGlkQXR0YWNrcykge1xuICAgIGlmICh0aGlzLiNmaXJzdEhpdEF0U2hpcC50b1N0cmluZygpICE9PSB0aGlzLiNsYXN0SGl0QXRTaGlwLnRvU3RyaW5nKCkpIHtcbiAgICAgIC8vIGlmIGNvbXB1dGVyIGhhcyBhbHJlYWR5IGF0dGFja2VkIGEgc2hpcCB0d2ljZSBvciBtb3JlIHRpbWVzLFxuICAgICAgLy8gZGVmaW5lIHRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdG8gYXR0YWNrIG5leHRcbiAgICAgIHRoaXMuI3NldEF0dGFja0RpcmVjdGlvbigpO1xuICAgICAgdGhpcy4jZ3Vlc3NTaGlwUG9zaXRpb25zKCk7XG5cbiAgICAgIGNvbnN0IGF0dGFja3NUb1ZhbGlkYXRlID0gW1xuICAgICAgICAuLi50aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucyxcbiAgICAgIF07XG5cbiAgICAgIGFsbFZhbGlkQXR0YWNrcyA9IHN0cmluZ2lmeUVsZW1lbnRzKGFsbFZhbGlkQXR0YWNrcyk7XG5cbiAgICAgIGNvbnN0IHZhbGlkR3Vlc3NlZEF0dGFja3MgPSBhdHRhY2tzVG9WYWxpZGF0ZS5maWx0ZXIoXG4gICAgICAgIGF0dGFjayA9PiBhbGxWYWxpZEF0dGFja3MuaW5jbHVkZXMoYXR0YWNrLnRvU3RyaW5nKCkpXG4gICAgICApO1xuXG4gICAgICBjb25zdCBuZXh0QXR0YWNrID0gdmFsaWRHdWVzc2VkQXR0YWNrc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEd1ZXNzZWRBdHRhY2tzLmxlbmd0aCldO1xuXG4gICAgICByZXR1cm4gbmV4dEF0dGFjaztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2VsbHNXaGVyZU1heUJlU2hpcCA9IGdldFBlcnBlbmRpY3VsYXJDZWxscyh0aGlzLiNsYXN0SGl0QXRTaGlwKTsgLy8gV2hlcmUgdGhlcmUgbWlnaHQgYmUgYSBzaGlwXG5cbiAgICAgIGFsbFZhbGlkQXR0YWNrcyA9IHN0cmluZ2lmeUVsZW1lbnRzKGFsbFZhbGlkQXR0YWNrcyk7XG5cbiAgICAgIGNvbnN0IHZhbGlkQ2VsbHNXaGVyZU1heUJlU2hpcCA9IGNlbGxzV2hlcmVNYXlCZVNoaXAuZmlsdGVyKFxuICAgICAgICBjZWxsID0+IGFsbFZhbGlkQXR0YWNrcy5pbmNsdWRlcyhjZWxsLnRvU3RyaW5nKCkpXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsaWRDZWxsc1doZXJlTWF5QmVTaGlwW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkQ2VsbHNXaGVyZU1heUJlU2hpcC5sZW5ndGgpXTtcbiAgICB9XG4gIH1cblxuICAjc2V0QXR0YWNrRGlyZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLiNmaXJzdEhpdEF0U2hpcFswXSAtIHRoaXMuI2xhc3RIaXRBdFNoaXBbMF0gPT09IDApIHtcbiAgICAgIHRoaXMuI2F0dGFja0RpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuI2ZpcnN0SGl0QXRTaGlwWzFdIC0gdGhpcy4jbGFzdEhpdEF0U2hpcFsxXSA9PT0gMCkge1xuICAgICAgdGhpcy4jYXR0YWNrRGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgfVxuXG4gICNndWVzc1NoaXBQb3NpdGlvbnMoKSB7XG4gICAgdGhpcy4jaGl0c0F0U2hpcC5mb3JFYWNoKGhpdCA9PiB7XG4gICAgICBpZiAodGhpcy4jYXR0YWNrRGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIHRoaXMuI2d1ZXNzZWRTaGlwUG9zaXRpb25zLnB1c2goXG4gICAgICAgICAgW051bWJlcihoaXRbMF0pLCBOdW1iZXIoaGl0WzFdKSAtIDFdLFxuICAgICAgICAgIFtOdW1iZXIoaGl0WzBdKSwgTnVtYmVyKGhpdFsxXSkgKyAxXSxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy4jYXR0YWNrRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgdGhpcy4jZ3Vlc3NlZFNoaXBQb3NpdGlvbnMucHVzaChcbiAgICAgICAgICBbTnVtYmVyKGhpdFswXSkgLSAxLCBOdW1iZXIoaGl0WzFdKV0sXG4gICAgICAgICAgW051bWJlcihoaXRbMF0pICsgMSwgTnVtYmVyKGhpdFsxXSldLFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gICNhdHRhY2tJbkRPTShhdHRhY2spIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuanMtY2VsbC0tcGxheWVyW2RhdGEtY29vcmRpbmF0ZT1cIiR7YXR0YWNrfVwiXWApLmNsaWNrKCk7XG4gIH1cblxuICBkZWZpbmVOZXh0TW92ZSgpIHtcbiAgICBpZiAoXG4gICAgICBQbGF5ZXJNYW5hZ2VyLmNoZWNrTGFzdEF0dGFja0F0RW5lbXlIaXRTaGlwKCkgJiYgIVBsYXllck1hbmFnZXIuY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwKClcbiAgICApIHtcbiAgICAgIHRoaXMuI2RlZmluZU5leHRNb3ZlQXNTaGlwQXR0YWNrKCk7XG4gICAgfSBlbHNlIGlmIChQbGF5ZXJNYW5hZ2VyLmNoZWNrTGFzdEF0dGFja0F0RW5lbXlTYW5rU2hpcCgpKSB7XG4gICAgICB0aGlzLiNkZWZpbmVOZXh0TW92ZUFzUmFuZG9tQXR0YWNrKCk7XG4gICAgfVxuICB9XG5cbiAgI2RlZmluZU5leHRNb3ZlQXNTaGlwQXR0YWNrKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSBQbGF5ZXJNYW5hZ2VyLmdldExhc3RBdHRhY2tBdEVuZW15KCk7XG4gICAgaWYgKCF0aGlzLiNsYXN0SGl0QXRTaGlwKSB7XG4gICAgICAvLyBpZiBpdCBpcyBmaXJzdCBhdHRhY2sgYXQgdGhlIHNoaXAgKGl0IHdhc24ndCBhdHRhY2tlZCBiZWZvcmUgYW5kIGxhc3QgaGl0IGlzIGZhbHN5KVxuICAgICAgdGhpcy4jZmlyc3RIaXRBdFNoaXAgPSBsYXN0QXR0YWNrO1xuICAgIH1cbiAgICB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwID0gdHJ1ZTtcbiAgICB0aGlzLiNsYXN0SGl0QXRTaGlwID0gbGFzdEF0dGFjaztcbiAgICB0aGlzLiNoaXRzQXRTaGlwLnB1c2gobGFzdEF0dGFjayk7XG4gIH1cblxuICAjZGVmaW5lTmV4dE1vdmVBc1JhbmRvbUF0dGFjaygpIHtcbiAgICB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwID0gZmFsc2U7XG4gICAgdGhpcy4jbGFzdEhpdEF0U2hpcCA9IG51bGw7XG4gICAgdGhpcy4jYXR0YWNrRGlyZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLiNoaXRzQXRTaGlwID0gW107XG4gICAgdGhpcy4jZ3Vlc3NlZFNoaXBQb3NpdGlvbnMgPSBbXTtcbiAgfVxufVxuXG5cbmV4cG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfSIsImltcG9ydCB7IFBsYXllciwgQ29tcHV0ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuY29uc3QgUGxheWVyTWFuYWdlciA9ICgoKSA9PiB7XG4gIGxldCBfY3VycmVudDtcbiAgbGV0IF9wbGF5ZXJzID0gW107XG5cbiAgZnVuY3Rpb24gYWRkUGxheWVyKHBsYXllcikge1xuICAgIGlmIChfcGxheWVycy5sZW5ndGggPT09IDIpIHtcbiAgICAgIF9wbGF5ZXJzID0gW107IC8vIG5vIG1vcmUgdGhhbiB0d28gcGxheWVycyBhcmUgc3RvcmVkXG4gICAgfVxuICAgIF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbnQoKSB7XG4gICAgX2N1cnJlbnQgPSBnZXROb3RDdXJyZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRDdXJyZW50KHBsYXllcikge1xuICAgIF9jdXJyZW50ID0gcGxheWVyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudCgpIHtcbiAgICByZXR1cm4gX2N1cnJlbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJOYW1lKHBsYXllcikgeyAvLyBOZWVkIGZvciBET00gY2xhc3Nlc1xuICAgIHJldHVybiAocGxheWVyIGluc3RhbmNlb2YgQ29tcHV0ZXIpID8gJ2NvbXB1dGVyJyA6ICdwbGF5ZXInO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Tm90Q3VycmVudCgpIHtcbiAgICByZXR1cm4gKF9jdXJyZW50ID09PSBfcGxheWVyc1swXSkgPyBfcGxheWVyc1sxXSA6IF9wbGF5ZXJzWzBdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGxheWVyUG9zc2libGVBdHRhY2tzKHBsYXllcikge1xuICAgIC8vIEZpbmRzIHRoZSBlbmVteSBwbGF5ZXIgYW5kIGdldHMgdGhlIHBvc3NpYmxlIGF0dGFja3MgZnJvbSB0aGVpciBnYW1lYm9hcmRcbiAgICByZXR1cm4gX3BsYXllcnMuZmluZChfcGxheWVyID0+IF9wbGF5ZXIgIT09IHBsYXllcikuZ2FtZWJvYXJkLmdldFBvc3NpYmxlQXR0YWNrcygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGFzdEF0dGFja0F0RW5lbXkoKSB7XG4gICAgY29uc3QgZW5lbXkgPSBnZXROb3RDdXJyZW50KCk7XG4gICAgcmV0dXJuIGVuZW15LmdhbWVib2FyZC5nZXRMYXN0QXR0YWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0xhc3RBdHRhY2tBdEVuZW15SGl0U2hpcCgpIHtcbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja0hpdFNoaXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlTYW5rU2hpcCgpIHtcbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwKCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVHYW1lYm9hcmRBdHRhY2soY29vcmRpbmF0ZXMpIHtcbiAgICBpZiAoIWNvb3JkaW5hdGVzKSByZXR1cm47XG5cbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICBlbmVteS5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcy5zcGxpdCgnLCcpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0Q3VycmVudCxcbiAgICBnZXRDdXJyZW50LFxuICAgIGdldE5vdEN1cnJlbnQsXG4gICAgZ2V0UGxheWVyTmFtZSxcbiAgICB0b2dnbGVDdXJyZW50LFxuICAgIGFkZFBsYXllcixcbiAgICBnZXRQbGF5ZXJQb3NzaWJsZUF0dGFja3MsXG4gICAgaGFuZGxlR2FtZWJvYXJkQXR0YWNrLFxuICAgIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlIaXRTaGlwLFxuICAgIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlTYW5rU2hpcCxcbiAgICBnZXRMYXN0QXR0YWNrQXRFbmVteVxuICB9XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImltcG9ydCB7XG4gIHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50LCBnZXRWYWxpZFBsYWNlbWVudENlbGxzXG59IGZyb20gXCIuL3NoaXBfdmFsaWRhdG9yXCI7XG5cbmltcG9ydCBJbnB1dCBmcm9tIFwiLi91dGlscy9pbnB1dFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMoKSB7XG4gIGdlbmVyYXRlU2hpcHNSYW5kb21seSgpO1xuICBnZW5lcmF0ZVNoaXBzUmFuZG9tbHkoKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTaGlwc1JhbmRvbWx5KCkge1xuICBjb25zdCByZWFkeVNoaXBzID0gW1xuICBdO1xuXG4gIGNvbnN0IGNhcnJpZXIgPSBnZXRWYWxpZFNoaXAoNCwgcmVhZHlTaGlwcyk7XG4gIHJlYWR5U2hpcHMucHVzaChjYXJyaWVyKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgIGNvbnN0IGJhdHRsZXNoaXAgPSBnZXRWYWxpZFNoaXAoMywgcmVhZHlTaGlwcyk7XG4gICAgcmVhZHlTaGlwcy5wdXNoKGJhdHRsZXNoaXApO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBjb25zdCBjcnVpc2VyID0gZ2V0VmFsaWRTaGlwKDIsIHJlYWR5U2hpcHMpO1xuICAgIHJlYWR5U2hpcHMucHVzaChjcnVpc2VyKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgY29uc3QgcGF0cm9sQm9hdCA9IGdldFZhbGlkU2hpcCgxLCByZWFkeVNoaXBzKTtcbiAgICByZWFkeVNoaXBzLnB1c2gocGF0cm9sQm9hdCk7XG4gIH1cblxuICBJbnB1dC5wbGFjZVNoaXBzKHJlYWR5U2hpcHMpO1xufVxuXG5mdW5jdGlvbiBnZXRWYWxpZFNoaXAoc2hpcExlbmd0aCwgYWxsU2hpcHMpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRTaGlwID0gZ2VuZXJhdGVTaGlwKHNoaXBMZW5ndGgpO1xuXG4gICAgaWYgKHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50KGdlbmVyYXRlZFNoaXAsIGFsbFNoaXBzKSkge1xuICAgICAgcmV0dXJuIGdlbmVyYXRlZFNoaXA7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2hpcChzaGlwTGVuZ3RoKSB7XG4gIGNvbnN0IHZhbGlkQ2VsbHMgPSBnZXRWYWxpZFBsYWNlbWVudENlbGxzKHNoaXBMZW5ndGgpO1xuXG4gIGNvbnN0IGZpcnN0Q29vcmRpbmF0ZSA9IHZhbGlkQ2VsbHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsaWRDZWxscy5sZW5ndGgpXTtcbiAgY29uc3QgY29vcmRpbmF0ZVggPSBmaXJzdENvb3JkaW5hdGVbMF07XG4gIGNvbnN0IGNvb3JkaW5hdGVZID0gZmlyc3RDb29yZGluYXRlWzFdO1xuXG4gIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IFtbLi4uZmlyc3RDb29yZGluYXRlXV07XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHsgLy8gZ28gZnJvbSB0aGUgc2Vjb25kIGNvb3JkaW5hdGVcbiAgICBzaGlwQ29vcmRpbmF0ZXMucHVzaChbY29vcmRpbmF0ZVggKyBpLCBjb29yZGluYXRlWV0pO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTaGlwKC4uLnNoaXBDb29yZGluYXRlcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycztcbmV4cG9ydCB7IGdlbmVyYXRlU2hpcHNSYW5kb21seSB9IiwiZnVuY3Rpb24gU2hpcCguLi5jb29yZGluYXRlcykge1xuICAvKiBDb29yZGluYXRlcyBhcmUgc2hpcCdzIGxvY2F0aW9uIG9uIGJvYXJkICovXG4gIC8qIFRoZXkgYXJlIHJlY2VpdmVkIGFuZCBub3QgY3JlYXRlZCBoZXJlLiBMb29rIGxpa2UgWzIsIDNdICovXG4gIC8qIFBvc2l0aW9ucyBhcmUgc2hpcCdzIGlubmVyIGhhbmRsaW5nIG9mIHRoZXNlIGNvb3JkaW5hdGVzICovXG4gIC8qIFBvc2l0aW9ucyBhcmUgdXNlZCB3aGVuIGRlY2lkaW5nIHdoZXJlIHRoZSBzaGlwIGlzIGhpdCwgKi9cbiAgLyogV2hldGhlciBvciBub3QgaXQgaXMgc3VuaywgYW5kIHdoZXJlIGV4YWN0bHkgKi9cbiAgLyogVG8gaGl0IHRoZSBzaGlwIGluIHRoZSBmaXJzdCBwbGFjZSAqL1xuXG4gIGNvbnN0IF9wb3NpdGlvbnMgPSBfY3JlYXRlUG9zaXRpb25zKGNvb3JkaW5hdGVzLmxlbmd0aCk7XG5cbiAgY29uc3QgX2Nvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgdGhpcy5nZXRDb29yZGluYXRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLl9jb29yZGluYXRlc107XG4gIH1cblxuICB0aGlzLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIF9wb3NpdGlvbnNbcG9zaXRpb25dO1xuICB9XG5cbiAgdGhpcy5pc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF9wb3NpdGlvbnMuZXZlcnkocG9zaXRpb24gPT4gcG9zaXRpb24uaXNIaXQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBIaXQgb25lIG9mIHNoaXAncyBwb3NpdGlvbnMgKi9cbiAgdGhpcy5oaXQgPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICBfcG9zaXRpb25zW3Bvc2l0aW9uXS5pc0hpdCA9IHRydWU7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuXG5cbmZ1bmN0aW9uIF9jcmVhdGVQb3NpdGlvbnMobGVuZ3RoKSB7XG4gIGNsYXNzIFBvc2l0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuaXNIaXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBwb3NpdGlvbnMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcG9zaXRpb25zLnB1c2gobmV3IFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgcmV0dXJuIHBvc2l0aW9ucztcbn0iLCJpbXBvcnQgeyBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcCwgc3RyaW5naWZ5RWxlbWVudHMgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5cbi8qIFRoZSBwdXJwb3NlIG9mIHRoaXMgbW9kdWxlIGlzIHRvIG5vdCBhbGxvdyB0byBwbGFjZSBzaGlwcyAqL1xuLyogQWRqYWNlbnQgdG8gZWFjaCBvdGhlci4gVGhlcmUgbXVzdCBiZSBzb21lIHNwYWNlIGJldHdlZW4gdGhlbSAqL1xuXG4vKiBGaXJzdCwgaXQgZGVmaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgcGxhY2VtZW50IGlzIHZhbGlkIHJlbGF0aXZlIHRvIG90aGVyIHNoaXBzIG9uIGJvYXJkICovXG4vKiBTZWNvbmQsIGl0IGNoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGUgY29vcmRpbmF0ZXMgYXJlIG5vdCBvdXRzaWRlIHRoZSBiYXR0bGVmaWVsZCAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVJlbGF0aXZlU2hpcFBsYWNlbWVudCh2YWxpZGF0ZWRTaGlwLCBzaGlwcykge1xuICAvKiBWYWxpZGF0ZSBhZ2FpbnN0IG90aGVyIHNoaXBzICovXG5cbiAgY29uc3Qgc2hpcENlbGxzID1cbiAgICBzdHJpbmdpZnlFbGVtZW50cyh2YWxpZGF0ZWRTaGlwLmdldENvb3JkaW5hdGVzKCkpO1xuXG4gIGNvbnN0IGFkamFjZW50U2hpcENvb3JkaW5hdGVzID1cbiAgICBzdHJpbmdpZnlFbGVtZW50cyhnZXRBZGphY2VudFNoaXBDb29yZGluYXRlcyhzaGlwcykpO1xuXG4gIGlmIChzaGlwQ2VsbHMuc29tZShjZWxsID0+IGFkamFjZW50U2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKGNlbGwpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5cbmZ1bmN0aW9uIGdldEFkamFjZW50U2hpcENvb3JkaW5hdGVzKHNoaXBzKSB7XG4gIGNvbnN0IGFkamFjZW50U2hpcENvb3JkaW5hdGVzID0gc2hpcHNcbiAgICAubWFwKHNoaXAgPT4ge1xuICAgICAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gc2hpcC5nZXRDb29yZGluYXRlcygpO1xuICAgICAgcmV0dXJuIGdldENlbGxzU3Vycm91bmRpbmdTaGlwKHNoaXBDb29yZGluYXRlcyk7XG4gICAgfSlcbiAgICAuZmxhdCgpO1xuXG4gIHNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gc2hpcC5nZXRDb29yZGluYXRlcygpO1xuICAgIHNoaXBDb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT4gYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMucHVzaChzdHJpbmdpZnlFbGVtZW50cyhjb29yZGluYXRlKSkpO1xuICB9KTtcblxuICByZXR1cm4gYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXM7XG59XG5cbmZ1bmN0aW9uIGdldFZhbGlkUGxhY2VtZW50Q2VsbHModmFsaWRhdGVkU2hpcExlbmd0aCkge1xuICBjb25zdCB2YWxpZFBsYWNlbWVudENlbGxzID0gW107XG5cbiAgc3dpdGNoICh2YWxpZGF0ZWRTaGlwTGVuZ3RoKSB7XG4gICAgY2FzZSA0OiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0Q2VsbHNWYWxpZEZvclNoaXBGb3VyKCkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgMzoge1xuICAgICAgdmFsaWRQbGFjZW1lbnRDZWxscy5wdXNoKC4uLmdldENlbGxzVmFsaWRGb3JTaGlwVGhyZWUoKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAyOiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0Q2VsbHNWYWxpZEZvclNoaXBUd28oKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAxOiB7XG4gICAgICB2YWxpZFBsYWNlbWVudENlbGxzLnB1c2goLi4uZ2V0QWxsQm9hcmQoKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsaWRQbGFjZW1lbnRDZWxscztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNWYWxpZEZvclNoaXBGb3VyKCkge1xuICBjb25zdCB2YWxpZENlbGxzID0gW107XG5cbiAgZm9yIChsZXQgeCA9IDE7IHggPD0gNzsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPCAxMDsgeSsrKSB7XG4gICAgICB2YWxpZENlbGxzLnB1c2goW3gsIHldKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsaWRDZWxscztcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNWYWxpZEZvclNoaXBUaHJlZSgpIHtcbiAgY29uc3QgdmFsaWRDZWxscyA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDg7IHgrKykge1xuICAgIGZvciAobGV0IHkgPSAxOyB5IDwgMTA7IHkrKykge1xuICAgICAgdmFsaWRDZWxscy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkQ2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxzVmFsaWRGb3JTaGlwVHdvKCkge1xuICBjb25zdCB2YWxpZENlbGxzID0gW107XG5cbiAgZm9yIChsZXQgeCA9IDE7IHggPD0gOTsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPD0gMTA7IHkrKykge1xuICAgICAgdmFsaWRDZWxscy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkQ2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbEJvYXJkKCkge1xuICBjb25zdCBhbGxCb2FyZCA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDEwOyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0gMTsgeSA8PSAxMDsgeSsrKSB7XG4gICAgICBhbGxCb2FyZC5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFsbEJvYXJkO1xufVxuXG5cbmV4cG9ydCB7IHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50LCBnZXRWYWxpZFBsYWNlbWVudENlbGxzIH0iLCJmdW5jdGlvbiBnZXRDZWxsc1N1cnJvdW5kaW5nQ2VsbChjZWxsKSB7XG4gIC8vIEl0IG1heSByZXR1cm4gbmVnYXRpdmUgY2VsbHMgdGhhdCBhcmUgbm90IG9uIGJvYXJkLFxuICAvLyBidXQgaXQgZG9lc24ndCBtYXR0ZXIgc2luY2UgdGhleSBhcmUgbm90IHVzZWQgYXQgYWxsXG4gIC8vIEFsbCB3ZSBuZWVkIHRvIGNoZWNrIGlzIHdoZXRoZXIgd2UgY2FuIHBsYWNlIGEgc2hpcCBvblxuICAvLyBhbiBleGlzdGluZyBjZWxsIG9yIG5vdFxuICByZXR1cm4gW1xuICAgIC8vIHJldHVybiBldmVyeXRoaW5nIGFyb3VuZCB0aGlzIGNlbGxcblxuICAgIC8vIGFib3ZlXG4gICAgW2NlbGxbMF0gLSAxLCBjZWxsWzFdIC0gMV0sXG4gICAgW2NlbGxbMF0sIGNlbGxbMV0gLSAxXSxcbiAgICBbY2VsbFswXSArIDEsIGNlbGxbMV0gLSAxXSxcblxuICAgIC8vIHJpZ2h0XG4gICAgW2NlbGxbMF0gKyAxLCBjZWxsWzFdXSxcbiAgICAvL2xlZnRcbiAgICBbY2VsbFswXSAtIDEsIGNlbGxbMV1dLFxuXG4gICAgLy8gYmVsb3dcbiAgICBbY2VsbFswXSAtIDEsIGNlbGxbMV0gKyAxXSxcbiAgICBbY2VsbFswXSwgY2VsbFsxXSArIDFdLFxuICAgIFtjZWxsWzBdICsgMSwgY2VsbFsxXSArIDFdLFxuICBdXG59XG5cbmZ1bmN0aW9uIGdldFBlcnBlbmRpY3VsYXJDZWxscyhjZWxsKSB7XG4gIGxldCBjZWxsQWJvdmU7XG4gIGxldCBjZWxsQmVsb3c7XG4gIGxldCBjZWxsVG9UaGVMZWZ0O1xuICBsZXQgY2VsbFRvVGhlUmlnaHQ7XG4gIGxldCBwZXJwZW5kaWN1bGFyQ2VsbHMgPSBbXTtcblxuICBpZiAoY2VsbFsxXSA+IDEpIHtcbiAgICBjZWxsQWJvdmUgPSBbTnVtYmVyKGNlbGxbMF0pLCBOdW1iZXIoY2VsbFsxXSkgLSAxXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsQWJvdmUpO1xuICB9XG5cbiAgaWYgKGNlbGxbMV0gPCAxMCkge1xuICAgIGNlbGxCZWxvdyA9IFtOdW1iZXIoY2VsbFswXSksIE51bWJlcihjZWxsWzFdKSArIDFdO1xuICAgIHBlcnBlbmRpY3VsYXJDZWxscy5wdXNoKGNlbGxCZWxvdyk7XG4gIH1cblxuICBpZiAoY2VsbFswXSA8IDEwKSB7XG4gICAgY2VsbFRvVGhlUmlnaHQgPSBbTnVtYmVyKGNlbGxbMF0pICsgMSwgTnVtYmVyKGNlbGxbMV0pXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsVG9UaGVSaWdodCk7XG4gIH1cblxuICBpZiAoY2VsbFswXSA+IDEpIHtcbiAgICBjZWxsVG9UaGVMZWZ0ID0gW051bWJlcihjZWxsWzBdKSAtIDEsIE51bWJlcihjZWxsWzFdKV07XG4gICAgcGVycGVuZGljdWxhckNlbGxzLnB1c2goY2VsbFRvVGhlTGVmdCk7XG4gIH1cblxuICByZXR1cm4gWy4uLnBlcnBlbmRpY3VsYXJDZWxsc107XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUVsZW1lbnRzKGFycikge1xuICByZXR1cm4gYXJyLm1hcChlbCA9PiBlbC50b1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gY29udmVydEVsZW1lbnRzVG9OdW1iZXJzKGFycikge1xuICByZXR1cm4gYXJyLm1hcChlbCA9PiBOdW1iZXIoZWwpKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAoc2hpcENvb3JkaW5hdGVzKSB7XG4gIGNvbnN0IGNlbGxzU3Vycm91bmRpbmdTaGlwID0gc2hpcENvb3JkaW5hdGVzXG4gICAgLm1hcChnZXRDZWxsc1N1cnJvdW5kaW5nQ2VsbClcbiAgICAuZmxhdCgpXG5cbiAgcmV0dXJuIGNlbGxzU3Vycm91bmRpbmdTaGlwO1xufVxuXG5leHBvcnQge1xuICBnZXRDZWxsc1N1cnJvdW5kaW5nQ2VsbCxcbiAgZ2V0UGVycGVuZGljdWxhckNlbGxzLFxuICBzdHJpbmdpZnlFbGVtZW50cyxcbiAgY29udmVydEVsZW1lbnRzVG9OdW1iZXJzLFxuICBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcCxcbn07IiwiaW1wb3J0IHsgY29udmVydEVsZW1lbnRzVG9OdW1iZXJzIH0gZnJvbSBcIi4vaGVscGVyXCI7XG5cbmNvbnN0IElucHV0ID0gKCgpID0+IHtcbiAgbGV0IF9sYXN0TW92ZTtcbiAgbGV0IF9zaGlwcyA9IFtdOyAvL3R3by1kaW1lbnNpb25hbC5cblxuICBmdW5jdGlvbiBzZXRMYXN0TW92ZShjb29yZGluYXRlKSB7XG4gICAgX2xhc3RNb3ZlID0gY29udmVydEVsZW1lbnRzVG9OdW1iZXJzKGNvb3JkaW5hdGUpO1xuICAgIGNvbnNvbGUubG9nKF9sYXN0TW92ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMYXN0TW92ZSgpIHtcbiAgICByZXR1cm4gX2xhc3RNb3ZlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwcyhzaGlwcykge1xuICAgIF9zaGlwcy5wdXNoKHNoaXBzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBsYXllclNoaXBzKCkge1xuICAgIHJldHVybiBfc2hpcHNbMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb21wdXRlclNoaXBzKCkge1xuICAgIHJldHVybiBfc2hpcHNbMV07XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICBfbGFzdE1vdmUgPSBudWxsO1xuICAgIF9zaGlwcyA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRMYXN0TW92ZSxcbiAgICBnZXRMYXN0TW92ZSxcbiAgICBnZXRQbGF5ZXJTaGlwcyxcbiAgICBnZXRDb21wdXRlclNoaXBzLFxuICAgIHBsYWNlU2hpcHMsXG4gICAgY2xlYXJcbiAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgSW5wdXQ7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge1xuICBmaWxsQmF0dGxlZmllbGRzV2l0aENlbGxzLFxuICBjbGVhckJhdHRsZWZpZWxkcyxcbiAgc2hvd1BsYXllclNoaXBzLFxufSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9iYXR0bGVmaWVsZFwiO1xuaW1wb3J0IHsgYWRkRXZlbnRzVG9TdGFydE1lbnVCdXR0b25zIH0gZnJvbSBcIi4vbW9kdWxlcy9kb20vc3RhcnRfbWVudVwiO1xuaW1wb3J0IHsgYWRkUmVzdGFydEV2ZW50IH0gZnJvbSBcIi4vbW9kdWxlcy9kb20vcmVzdGFydFwiO1xuXG5pbXBvcnQgVUlHYW1lU3RhdGUgZnJvbSBcIi4vbW9kdWxlcy9kb20vZ2FtZV9zdGF0ZVwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vbW9kdWxlcy91dGlscy9pbnB1dFwiO1xuaW1wb3J0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycyBmcm9tIFwiLi9tb2R1bGVzL3JhbmRvbV9zaGlwc1wiO1xuXG4oKCkgPT4ge1xuICBpbml0R2FtZSgpO1xuICBhZGRSZXN0YXJ0RXZlbnQocmVjZWl2ZVJlc3RhcnQpO1xufSkoKTtcblxuZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG4gIElucHV0LmNsZWFyKCk7XG4gIGNsZWFyQmF0dGxlZmllbGRzKCk7XG4gIGZpbGxCYXR0bGVmaWVsZHNXaXRoQ2VsbHMoKTtcbiAgZ2VuZXJhdGVTaGlwc0ZvckJvdGhQbGF5ZXJzKCk7XG4gIHNob3dQbGF5ZXJTaGlwcygpO1xuICBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMocmVjZWl2ZVN0YXJ0LCByZWNlaXZlUmFuZG9tKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVN0YXJ0KCkge1xuICBHYW1lLnN0YXJ0KCk7XG59XG5cbmZ1bmN0aW9uIHJlY2VpdmVSZXN0YXJ0KCkge1xuICBVSUdhbWVTdGF0ZS50b2dnbGVSZXN1bHQoKTtcbiAgVUlHYW1lU3RhdGUuc2hvd1Jlc3RhcnQoKTtcbiAgaW5pdEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVJhbmRvbSgpIHtcbiAgSW5wdXQuY2xlYXIoKTtcbiAgY2xlYXJCYXR0bGVmaWVsZHMoKTtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpO1xuICBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMoKTtcbiAgc2hvd1BsYXllclNoaXBzKCk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9