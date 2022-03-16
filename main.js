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
  ship.dataset.length = coordinates.length;

  cell.appendChild(ship);
}

function setShipToSunk(coordinates, player) {
  const ship = document.querySelector(`.js-cell--${player}[data-coordinate="${coordinates[0]}"] .ship`);
  ship.classList.add('ship--sunk');
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
/* harmony import */ var _player_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../player_manager */ "./src/modules/player_manager.js");


const UIGameState = (() => {
  let _currentPlayer;
  let _isStartGame = true;

  /* Game start */

  function startGame() {
    _currentPlayer = 'player';
    _toggleStartGameInterfaceVisibility();
    _disableStartGameInterface();
    _toggleBoardDescriptions();
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
      _player_manager__WEBPACK_IMPORTED_MODULE_0__["default"].handleGameboardAttack(e.target.dataset.coordinate);
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
    } else {
      _currentPlayer = 'player';
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
    const checkResult = _ships.find(
      ship => (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString())
    );

    return (checkResult) ? true : false;
  }

  this.checkLastAttackSankShip = function () {
    const lastAttack = this.getLastAttack();
    const lastShipHit = _ships.find(
      ship => (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(ship.getCoordinates()).includes(lastAttack.toString())
    );

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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getValidPlacementCells": () => (/* binding */ getValidPlacementCells),
/* harmony export */   "validateRelativeShipPlacement": () => (/* binding */ validateRelativeShipPlacement)
/* harmony export */ });
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/helper */ "./src/modules/utils/helper.js");


/* The purpose of this module is to not allow to place ships */
/* adjacent to each other and outside the gameboard. */
/* There must be some space between them */

/* First, it defines whether or not the placement is valid relative to other ships on board */
/* Second, it checks whether or not the coordinates are not outside the gameboard */

function validateShipPlacement(validatedShip, allShips) {
  const shipCoordinates = validatedShip.getCoordinates();
  const shipLength = shipCoordinates.length;
  const firstCoordinate = shipCoordinates[0];

  const isValidRelative = validateRelativeShipPlacement(validatedShip, allShips);
  const isInside = !isOutsideGameboard(shipLength, firstCoordinate);

  const isValid = isValidRelative && isInside;

  return isValid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validateShipPlacement);


function validateRelativeShipPlacement(validatedShip, allShips) {
  /* Validate against other ships */

  const shipCells =
    (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(validatedShip.getCoordinates());

  const adjacentShipCoordinates =
    (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(getAdjacentShipCoordinates(allShips));

  if (shipCells.some(cell => adjacentShipCoordinates.includes(cell))) {
    return false;
  }

  return true;
}


function getAdjacentShipCoordinates(allShips) {
  const adjacentShipCoordinates = allShips
    .map(ship => {
      const shipCoordinates = ship.getCoordinates();
      return (0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.getCellsSurroundingShip)(shipCoordinates);
    })
    .flat();

  allShips.forEach(ship => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach(coordinate =>
      adjacentShipCoordinates
        .push((0,_utils_helper__WEBPACK_IMPORTED_MODULE_0__.stringifyElements)(coordinate)));
  });

  return adjacentShipCoordinates;
}

function isOutsideGameboard(validatedShipLength, firstCoordinate) {
  const validCells = getValidPlacementCells(validatedShipLength);
  const isPlacementInvalid = validCells
    .every(cell => cell.toString() !== firstCoordinate.toString());

  if (isPlacementInvalid) {
    return true;
  } else {
    return false;
  }
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
    for (let y = 1; y <= 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipThree() {
  const validCells = [];

  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y <= 10; y++) {
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
  /* Update battlefields */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGbUM7QUFDb0M7QUFDZjs7QUFFTDtBQUNqQjtBQUNRO0FBQ3VCOztBQUVqRTtBQUNBO0FBQ0EsRUFBRSxxRUFBZTtBQUNqQixDQUFDOztBQUVEO0FBQ0EsRUFBRSxrRUFBVztBQUNiO0FBQ0EsRUFBRSwyRUFBaUI7QUFDbkIsRUFBRSxtRkFBeUI7O0FBRTNCLEVBQUUsaUVBQTJCO0FBQzdCLEVBQUUseUVBQWU7O0FBRWpCLEVBQUUsb0ZBQTJCO0FBQzdCOztBQUVBO0FBQ0EsRUFBRSwyREFBVTtBQUNaOztBQUVBO0FBQ0EsRUFBRSw0RUFBd0I7QUFDMUIsRUFBRSwyRUFBdUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBLEVBQUUsa0VBQVc7QUFDYixFQUFFLDJFQUFpQjtBQUNuQixFQUFFLG1GQUF5QjtBQUMzQixFQUFFLGlFQUEyQjtBQUM3QixFQUFFLHlFQUFlO0FBQ2pCLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tL2JhdHRsZWZpZWxkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20vZ2FtZV9zdGF0ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZG9tL3Jlc3RhcnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS9zdGFydF9tZW51LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyX21hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3JhbmRvbV9zaGlwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcF92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3V0aWxzL2hlbHBlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdXRpbHMvaW5wdXQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElucHV0IGZyb20gXCIuLi91dGlscy9pbnB1dFwiO1xuLyogQ2VsbHMgZ2VuZXJhdGlvbiBhbmQgY2xlYXJpbmcgKi9cblxuZnVuY3Rpb24gZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpIHtcbiAgY29uc3QgcGxheWVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcGxheWVyLWJhdHRsZWZpZWxkJyk7XG4gIGNvbnN0IGNvbXB1dGVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29tcHV0ZXItYmF0dGxlZmllbGQnKTtcblxuICBmaWxsV2l0aENlbGxzKHBsYXllckJhdHRsZWZpZWxkLCAnanMtY2VsbC0tcGxheWVyJywgJ2pzLWNlbGwnKTtcbiAgZmlsbFdpdGhDZWxscyhjb21wdXRlckJhdHRsZWZpZWxkLCAnanMtY2VsbC0tY29tcHV0ZXInLCAnanMtY2VsbCcpO1xufVxuXG5mdW5jdGlvbiBmaWxsV2l0aENlbGxzKGJhdHRsZWZpZWxkLCAuLi5qc0NsYXNzTmFtZXMpIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTA7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAxOyBqIDw9IDEwOyBqKyspIHtcbiAgICAgIGJhdHRsZWZpZWxkLmFwcGVuZENoaWxkKF9jcmVhdGVDZWxsKFtqLCBpXSwganNDbGFzc05hbWVzKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUNlbGwoY29vcmRpbmF0ZSwganNDbGFzc05hbWVzKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnZ2FtZWJvYXJkX19jZWxsJywgLi4uanNDbGFzc05hbWVzKTtcbiAgICBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZSA9IGNvb3JkaW5hdGU7XG5cbiAgICByZXR1cm4gY2VsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhckJhdHRsZWZpZWxkcygpIHtcbiAgY29uc3QgcGxheWVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcGxheWVyLWJhdHRsZWZpZWxkJyk7XG4gIGNvbnN0IGNvbXB1dGVyQmF0dGxlZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29tcHV0ZXItYmF0dGxlZmllbGQnKTtcblxuICBwbGF5ZXJCYXR0bGVmaWVsZC50ZXh0Q29udGVudCA9IFwiXCI7XG4gIGNvbXB1dGVyQmF0dGxlZmllbGQudGV4dENvbnRlbnQgPSBcIlwiO1xufVxuXG4vKiBSZXNwb25zZSB0byBhdHRhY2sgKi9cblxuZnVuY3Rpb24gc2hvd01pc3NlZEF0dGFjayhjb29yZGluYXRlLCBlbmVteSkge1xuICBjb25zdCBtaXNzZWRBdHRhY2tEaXYgPSBfY3JlYXRlQXR0YWNrKCdtaXNzZWQnKTtcbiAgY29uc3QgYXR0YWNrZWRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmpzLWNlbGwtLSR7ZW5lbXl9W2RhdGEtY29vcmRpbmF0ZT1cIiR7Y29vcmRpbmF0ZX1cIl1gKTtcblxuICBpZiAoIWF0dGFja2VkQ2VsbCkgcmV0dXJuO1xuXG4gIGF0dGFja2VkQ2VsbC5hcHBlbmRDaGlsZChtaXNzZWRBdHRhY2tEaXYpO1xufVxuXG5mdW5jdGlvbiBzaG93SGl0QXRTaGlwKGNvb3JkaW5hdGUsIGVuZW15KSB7XG4gIGNvbnN0IHNoaXBBdHRhY2tEaXYgPSBfY3JlYXRlQXR0YWNrKCdoaXQnKTtcbiAgY29uc3QgYXR0YWNrZWRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmpzLWNlbGwtLSR7ZW5lbXl9W2RhdGEtY29vcmRpbmF0ZT1cIiR7Y29vcmRpbmF0ZX1cIl1gKTtcblxuICBhdHRhY2tlZENlbGwuYXBwZW5kQ2hpbGQoc2hpcEF0dGFja0Rpdik7XG59XG5cbmZ1bmN0aW9uIHNob3dTdW5rU2hpcChjb29yZGluYXRlcywgYXR0YWNrZWRQbGF5ZXIpIHtcbiAgaWYgKGF0dGFja2VkUGxheWVyID09PSAnY29tcHV0ZXInKSB7XG4gICAgc2hvd1NoaXAoY29vcmRpbmF0ZXMsIGF0dGFja2VkUGxheWVyKTtcbiAgfVxuXG4gIHNldFNoaXBUb1N1bmsoY29vcmRpbmF0ZXMsIGF0dGFja2VkUGxheWVyKTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUF0dGFjayhhdHRhY2tSZXN1bHQpIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKGBnYW1lYm9hcmRfXyR7YXR0YWNrUmVzdWx0fWApO1xuXG4gIHJldHVybiBkaXY7XG59XG5cbi8qIFNoaXBzIGhpZ2hsaWdodGluZyAqL1xuXG5mdW5jdGlvbiBzaG93UGxheWVyU2hpcHMoKSB7XG4gIGNvbnN0IHBsYXllclNoaXBzQ29vcmRpbmF0ZXMgPVxuICAgIElucHV0XG4gICAgICAuZ2V0UGxheWVyU2hpcHMoKVxuICAgICAgLm1hcChzaGlwID0+IHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKSk7XG5cbiAgcGxheWVyU2hpcHNDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlcykgPT4gc2hvd1NoaXAoY29vcmRpbmF0ZXMsICdwbGF5ZXInKSk7XG59XG5cbmZ1bmN0aW9uIHNob3dTaGlwKGNvb3JkaW5hdGVzLCBwbGF5ZXIpIHtcbiAgY29uc3QgZmlyc3RDb29yZGluYXRlID0gY29vcmRpbmF0ZXNbMF07XG4gIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuanMtY2VsbC0tJHtwbGF5ZXJ9W2RhdGEtY29vcmRpbmF0ZT1cIiR7Zmlyc3RDb29yZGluYXRlfVwiXWApO1xuXG4gIGNvbnN0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJywgYHNoaXAtLSR7Y29vcmRpbmF0ZXMubGVuZ3RofWApO1xuICBzaGlwLmRhdGFzZXQubGVuZ3RoID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuXG4gIGNlbGwuYXBwZW5kQ2hpbGQoc2hpcCk7XG59XG5cbmZ1bmN0aW9uIHNldFNoaXBUb1N1bmsoY29vcmRpbmF0ZXMsIHBsYXllcikge1xuICBjb25zdCBzaGlwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmpzLWNlbGwtLSR7cGxheWVyfVtkYXRhLWNvb3JkaW5hdGU9XCIke2Nvb3JkaW5hdGVzWzBdfVwiXSAuc2hpcGApO1xuICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAtLXN1bmsnKTtcbn1cblxuZXhwb3J0IHtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscyxcbiAgY2xlYXJCYXR0bGVmaWVsZHMsXG4gIHNob3dNaXNzZWRBdHRhY2ssXG4gIHNob3dIaXRBdFNoaXAsXG4gIHNob3dTdW5rU2hpcCxcbiAgc2hvd1BsYXllclNoaXBzLFxuICBzaG93U2hpcCxcbn0iLCJpbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vcGxheWVyX21hbmFnZXJcIjtcblxuY29uc3QgVUlHYW1lU3RhdGUgPSAoKCkgPT4ge1xuICBsZXQgX2N1cnJlbnRQbGF5ZXI7XG4gIGxldCBfaXNTdGFydEdhbWUgPSB0cnVlO1xuXG4gIC8qIEdhbWUgc3RhcnQgKi9cblxuICBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgX2N1cnJlbnRQbGF5ZXIgPSAncGxheWVyJztcbiAgICBfdG9nZ2xlU3RhcnRHYW1lSW50ZXJmYWNlVmlzaWJpbGl0eSgpO1xuICAgIF9kaXNhYmxlU3RhcnRHYW1lSW50ZXJmYWNlKCk7XG4gICAgX3RvZ2dsZUJvYXJkRGVzY3JpcHRpb25zKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wR2FtZSgpIHtcbiAgICByZW1vdmVBbGxNb3ZlTGlzdGVuZXJzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93R2FtZVJlc3VsdChpc1BsYXllcldpbm5lcikge1xuICAgIGlmIChpc1BsYXllcldpbm5lcikge1xuICAgICAgX3Nob3dQbGF5ZXJWaWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9zaG93UGxheWVyRGVmZWF0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dQbGF5ZXJWaWN0b3J5KCkge1xuICAgIHRvZ2dsZVJlc3VsdCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yZXN1bHQnKTtcbiAgICByZXN1bHQudGV4dENvbnRlbnQgPSAnVmljdG9yeSEnO1xuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dQbGF5ZXJEZWZlYXQoKSB7XG4gICAgdG9nZ2xlUmVzdWx0KCk7XG4gICAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3VsdCcpO1xuICAgIHJlc3VsdC50ZXh0Q29udGVudCA9ICdEZWZlYXQhJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZVJlc3VsdCgpIHtcbiAgICBjb25zdCByZXN1bHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29udGFpbmVyLS1yZXN1bHQnKTtcbiAgICByZXN1bHRDb250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpO1xuICB9XG5cbiAgLyogR2FtZSByZXN0YXJ0ICovXG5cbiAgZnVuY3Rpb24gc2hvd1Jlc3RhcnQoKSB7XG4gICAgX3RvZ2dsZVN0YXJ0R2FtZUludGVyZmFjZVZpc2liaWxpdHkoKTtcbiAgICBfdG9nZ2xlQm9hcmREZXNjcmlwdGlvbnMoKTtcbiAgfVxuXG4gIC8qIFBsYXllciBhbmQgY29tcHV0ZXIgbW92ZSAqL1xuXG4gIC8qIFRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgb25jZSB0aGUgY2VsbCBpcyBjbGlja2VkICovXG4gIC8qIFRoZSBvdXRlciBtb2R1bGUsIGdhbWUsIHdpbGwgYXdhaXQgZm9yIHRoZSBwcm9taXNlIHRvIHJlc29sdmUsICovXG4gIC8qIEFuZCB0aGUgbW92ZSBjYXB0dXJlZCBpbiB0aGlzIG1vZHVsZSB3aWxsIGJlIGhhbmRsZWQgKi9cblxuICBmdW5jdGlvbiBwbGF5ZXJNb3ZlKHBsYXllcikge1xuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBfYWRkTW92ZUxpc3RlbmVyRm9yRW5lbXlDZWxscyhyZXNvbHZlLCAnLmpzLWNlbGwtLWNvbXB1dGVyJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wdXRlck1vdmUoY29tcHV0ZXIpIHtcbiAgICByZW1vdmVBbGxNb3ZlTGlzdGVuZXJzKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgX2FkZE1vdmVMaXN0ZW5lckZvckVuZW15Q2VsbHMocmVzb2x2ZSwgJy5qcy1jZWxsLS1wbGF5ZXInKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb21wdXRlci5tYWtlTW92ZSgpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hZGRNb3ZlTGlzdGVuZXJGb3JFbmVteUNlbGxzKHByb21pc2VSZXNvbHZlQ2FsbGJhY2ssIGVuZW15Q2VsbHNIVE1MQ2xhc3MpIHtcbiAgICBjb25zdCBlbmVteUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbmVteUNlbGxzSFRNTENsYXNzKTtcblxuICAgIGVuZW15Q2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5kYXRhc2V0LmNvb3JkaW5hdGUpIHJldHVybjtcbiAgICAgIFBsYXllck1hbmFnZXIuaGFuZGxlR2FtZWJvYXJkQXR0YWNrKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRpbmF0ZSk7XG4gICAgICBwcm9taXNlUmVzb2x2ZUNhbGxiYWNrKCk7XG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsTW92ZUxpc3RlbmVycygpIHtcbiAgICBjb25zdCBjZWxsc1dpdGhMaXN0ZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuanMtY2VsbC0tcGxheWVyLCAuanMtY2VsbC0tY29tcHV0ZXJgKTtcblxuICAgIGNlbGxzV2l0aExpc3RlbmVycy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgbGV0IGNlbGxXaXRob3V0TGlzdGVuZXIgPSBjZWxsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIGNlbGwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2VsbFdpdGhvdXRMaXN0ZW5lciwgY2VsbCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUN1cnJlbnRQbGF5ZXIoKSB7XG4gICAgaWYgKF9jdXJyZW50UGxheWVyID09PSAncGxheWVyJykge1xuICAgICAgX2N1cnJlbnRQbGF5ZXIgPSAnY29tcHV0ZXInO1xuICAgIH0gZWxzZSB7XG4gICAgICBfY3VycmVudFBsYXllciA9ICdwbGF5ZXInO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9kaXNhYmxlU3RhcnRHYW1lSW50ZXJmYWNlKCkge1xuICAgIGNvbnN0IGJ1dHRvbnNXaXRoTGlzdGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXJhbmRvbSwgLmpzLXN0YXJ0Jyk7XG5cbiAgICBidXR0b25zV2l0aExpc3RlbmVycy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBsZXQgYnV0dG9uV2l0aG91dExpc3RlbmVyID0gYnV0dG9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIGJ1dHRvbi5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChidXR0b25XaXRob3V0TGlzdGVuZXIsIGJ1dHRvbik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfdG9nZ2xlU3RhcnRHYW1lSW50ZXJmYWNlVmlzaWJpbGl0eSgpIHtcbiAgICBjb25zdCBjb21wdXRlckdhbWVib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb21wdXRlci1nYW1lYm9hcmQnKTtcbiAgICBjb25zdCBnYW1lYm9hcmRCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXJhbmRvbSwgLmpzLXN0YXJ0Jyk7XG5cbiAgICBjb21wdXRlckdhbWVib2FyZC5jbGFzc0xpc3QudG9nZ2xlKCdpcy12aXNpYmxlJyk7XG4gICAgZ2FtZWJvYXJkQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90b2dnbGVCb2FyZERlc2NyaXB0aW9ucygpIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZGVzY3JpcHRpb24nKTtcbiAgICBkZXNjcmlwdGlvbnMuZm9yRWFjaChub2RlID0+IG5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdmlzaWJsZScpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRHYW1lLFxuICAgIHN0b3BHYW1lLFxuICAgIHNob3dHYW1lUmVzdWx0LFxuICAgIHRvZ2dsZVJlc3VsdCxcbiAgICB0b2dnbGVDdXJyZW50UGxheWVyLFxuICAgIHBsYXllck1vdmUsXG4gICAgY29tcHV0ZXJNb3ZlLFxuICAgIHNob3dSZXN0YXJ0LFxuICAgIHJlbW92ZUFsbE1vdmVMaXN0ZW5lcnMsXG4gIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IFVJR2FtZVN0YXRlOyIsImZ1bmN0aW9uIGFkZFJlc3RhcnRFdmVudChjYWxsYmFjaykge1xuICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3RhcnQnKTtcbiAgcmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IHtcbiAgYWRkUmVzdGFydEV2ZW50LFxufSIsImZ1bmN0aW9uIGFkZEV2ZW50c1RvU3RhcnRNZW51QnV0dG9ucyhzdGFydENhbGxiYWNrLCByYW5kb21DYWxsYmFjaykge1xuICBjb25zdCBzdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zdGFydCcpO1xuICBjb25zdCByYW5kb20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmFuZG9tJylcbiAgc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdGFydENhbGxiYWNrKTtcbiAgcmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9tQ2FsbGJhY2spO1xufVxuXG5leHBvcnQge1xuICBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMsXG59IiwiaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4vcGxheWVyX21hbmFnZXJcIjtcbmltcG9ydCBJbnB1dCBmcm9tIFwiLi91dGlscy9pbnB1dFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IFVJR2FtZVN0YXRlIGZyb20gXCIuL2RvbS9nYW1lX3N0YXRlXCI7XG5pbXBvcnQgZ2VuZXJhdGVTaGlwc0ZvckJvdGhQbGF5ZXJzIGZyb20gXCIuL3JhbmRvbV9zaGlwc1wiO1xuaW1wb3J0IHsgc2hvd0hpdEF0U2hpcCwgc2hvd01pc3NlZEF0dGFjaywgc2hvd1N1bmtTaGlwIH0gZnJvbSBcIi4vZG9tL2JhdHRsZWZpZWxkXCI7XG5pbXBvcnQgeyBDb21wdXRlciwgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcCB9IGZyb20gXCIuL3V0aWxzL2hlbHBlclwiO1xuXG5jb25zdCBHYW1lID0gKCgpID0+IHtcbiAgbGV0IF9nYW1lR29pbmcgPSBmYWxzZTtcbiAgbGV0IF93aW5uZXIgPSBudWxsO1xuICBsZXQgcGxheWVyID0gbnVsbDtcbiAgbGV0IGNvbXB1dGVyID0gbnVsbDtcblxuICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICBfaW5pdFBsYXllcnMoKTtcbiAgICBfcGxhY2VTaGlwcyhwbGF5ZXIsIGNvbXB1dGVyKTtcbiAgICBfaW5pdFVJKCk7XG5cbiAgICBfZ2FtZUdvaW5nID0gdHJ1ZTtcbiAgICBfZ2FtZWxvb3AoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zdG9wKCkge1xuICAgIF9nYW1lR29pbmcgPSBmYWxzZTtcbiAgICBJbnB1dC5jbGVhcigpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2luaXRQbGF5ZXJzKCkge1xuICAgIHBsYXllciA9IG5ldyBQbGF5ZXIoJ3BsYXllcicpO1xuICAgIGNvbXB1dGVyID0gbmV3IENvbXB1dGVyKCdjb21wdXRlcicpO1xuXG4gICAgUGxheWVyTWFuYWdlci5hZGRQbGF5ZXIocGxheWVyKTtcbiAgICBQbGF5ZXJNYW5hZ2VyLmFkZFBsYXllcihjb21wdXRlcik7XG4gICAgUGxheWVyTWFuYWdlci5zZXRDdXJyZW50KHBsYXllcik7XG4gIH1cblxuICBmdW5jdGlvbiBfaW5pdFVJKCkge1xuICAgIFVJR2FtZVN0YXRlLnN0YXJ0R2FtZSgpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gX2dhbWVsb29wKCkge1xuICAgIHdoaWxlIChfZ2FtZUdvaW5nKSB7XG4gICAgICBhd2FpdCBuZXh0TW92ZSgpO1xuXG4gICAgICBjb25zdCBhdHRhY2tlciA9IFBsYXllck1hbmFnZXIuZ2V0Q3VycmVudCgpO1xuICAgICAgY29uc3QgYXR0YWNrZWQgPSBQbGF5ZXJNYW5hZ2VyLmdldE5vdEN1cnJlbnQoKTtcblxuICAgICAgaWYgKCFhdHRhY2tlZC5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWF0dGFja2VkLmdhbWVib2FyZC5jaGVja0xhc3RBdHRhY2tIaXRTaGlwKCkpIHtcbiAgICAgICAgLyogSWYgdGhlIGxhc3QgYXR0YWNrIGRpZCBub3QgaGl0IGEgc2hpcCAqL1xuICAgICAgICBQbGF5ZXJNYW5hZ2VyLnRvZ2dsZUN1cnJlbnQoKTtcbiAgICAgICAgVUlHYW1lU3RhdGUudG9nZ2xlQ3VycmVudFBsYXllcigpO1xuXG4gICAgICAgIHNob3dNaXNzZWRBdHRhY2soYXR0YWNrZWQuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2soKSwgYXR0YWNrZWQubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG93SGl0QXRTaGlwKGF0dGFja2VkLmdhbWVib2FyZC5nZXRMYXN0QXR0YWNrKCksIGF0dGFja2VkLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0YWNrZWQuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwKCkpIHtcbiAgICAgICAgY29uc3Qgc3Vua1NoaXAgPSBhdHRhY2tlZC5nYW1lYm9hcmQuZ2V0TGFzdEF0dGFja2VkU2hpcCgpO1xuXG4gICAgICAgIF9hdHRhY2tDZWxsc0Fyb3VuZFN1bmtTaGlwKGF0dGFja2VkLCBzdW5rU2hpcCk7XG4gICAgICAgIHNob3dTdW5rU2hpcChzdW5rU2hpcC5nZXRDb29yZGluYXRlcygpLCBQbGF5ZXJNYW5hZ2VyLmdldFBsYXllck5hbWUoYXR0YWNrZWQpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dGFja2VkLmlzR2FtZU92ZXIoKSkge1xuICAgICAgICBfc3RvcCgpO1xuICAgICAgICBfd2lubmVyID0gYXR0YWNrZXI7XG5cbiAgICAgICAgVUlHYW1lU3RhdGUuc3RvcEdhbWUoKTtcbiAgICAgICAgVUlHYW1lU3RhdGUuc2hvd0dhbWVSZXN1bHQoX3dpbm5lciA9PT0gcGxheWVyID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gbmV4dE1vdmUoKSB7XG4gICAgICBpZiAoUGxheWVyTWFuYWdlci5nZXRDdXJyZW50KCkgPT09IHBsYXllcikge1xuICAgICAgICBhd2FpdCBVSUdhbWVTdGF0ZS5wbGF5ZXJNb3ZlKHBsYXllcik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChQbGF5ZXJNYW5hZ2VyLmdldEN1cnJlbnQoKSA9PT0gY29tcHV0ZXIpIHtcbiAgICAgICAgYXdhaXQgVUlHYW1lU3RhdGUuY29tcHV0ZXJNb3ZlKGNvbXB1dGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfcGxhY2VTaGlwcyhwbGF5ZXIsIGNvbXB1dGVyKSB7XG4gICAgY29uc3QgcGxheWVyU2hpcHMgPSBJbnB1dC5nZXRQbGF5ZXJTaGlwcygpO1xuICAgIGNvbnN0IGNvbXB1dGVyU2hpcHMgPSBJbnB1dC5nZXRDb21wdXRlclNoaXBzKCk7XG5cbiAgICBwbGF5ZXJTaGlwcy5mb3JFYWNoKHNoaXAgPT4gcGxheWVyLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCkpO1xuICAgIGNvbXB1dGVyU2hpcHMuZm9yRWFjaChzaGlwID0+IGNvbXB1dGVyLmdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2F0dGFja0NlbGxzQXJvdW5kU3Vua1NoaXAoYXR0YWNrZWQsIHN1bmtTaGlwKSB7XG4gICAgY29uc3QgY2VsbHNUb0F0dGFjayA9IGdldENlbGxzU3Vycm91bmRpbmdTaGlwKHN1bmtTaGlwLmdldENvb3JkaW5hdGVzKCkpO1xuICAgIGNlbGxzVG9BdHRhY2suZm9yRWFjaChjZWxsID0+IHtcbiAgICAgIGF0dGFja2VkLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNlbGwpO1xuXG4gICAgICBpZiAoYXR0YWNrZWQuZ2FtZWJvYXJkLmNoZWNrTGFzdEF0dGFja1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICBzaG93TWlzc2VkQXR0YWNrKGNlbGwsIFBsYXllck1hbmFnZXIuZ2V0UGxheWVyTmFtZShhdHRhY2tlZCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgVUlHYW1lU3RhdGUucmVtb3ZlQWxsTW92ZUxpc3RlbmVycygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydCxcbiAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZTsiLCJpbXBvcnQgeyBzdHJpbmdpZnlFbGVtZW50cyB9IGZyb20gXCIuL3V0aWxzL2hlbHBlclwiXG5cblxuZnVuY3Rpb24gR2FtZWJvYXJkKCkge1xuICBjb25zdCBfbGVuZ3RoID0gMTA7IC8vIDEwIHggMTAgYm9hcmRcbiAgY29uc3QgX3NoaXBzID0gW107XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG4gIGNvbnN0IF9hdHRhY2tzID0gW107XG5cbiAgdGhpcy5nZXRMZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9sZW5ndGg7XG4gIH1cblxuICB0aGlzLmdldFNoaXBzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX3NoaXBzXTtcbiAgfVxuXG4gIHRoaXMuZ2V0TWlzc2VkQXR0YWNrcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLl9taXNzZWRBdHRhY2tzXTtcbiAgfVxuXG4gIHRoaXMuZ2V0QWxsQXR0YWNrcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLl9hdHRhY2tzXTtcbiAgfVxuXG4gIHRoaXMuZ2V0UG9zc2libGVBdHRhY2tzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFsbENlbGxzKCkuZmlsdGVyKGNlbGwgPT4gIXN0cmluZ2lmeUVsZW1lbnRzKF9hdHRhY2tzKS5pbmNsdWRlcyhjZWxsLnRvU3RyaW5nKCkpKTtcbiAgfVxuXG4gIHRoaXMuZ2V0TGFzdEF0dGFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2F0dGFja3NbX2F0dGFja3MubGVuZ3RoIC0gMV07XG4gIH1cblxuICB0aGlzLmdldExhc3RBdHRhY2tlZFNoaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IHRoaXMuZ2V0TGFzdEF0dGFjaygpO1xuXG4gICAgY29uc3QgbGFzdEF0dGFja2VkU2hpcCA9XG4gICAgICBfc2hpcHNcbiAgICAgICAgLmZpbmQoXG4gICAgICAgICAgc2hpcCA9PiBzaGlwXG4gICAgICAgICAgICAuZ2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICAgICAgLnNvbWUoY29vcmRpbmF0ZSA9PiBjb29yZGluYXRlLnRvU3RyaW5nKCkgPT09IGxhc3RBdHRhY2sudG9TdHJpbmcoKSlcbiAgICAgICAgKTtcblxuICAgIHJldHVybiBsYXN0QXR0YWNrZWRTaGlwO1xuICB9XG5cbiAgdGhpcy5jaGVja0xhc3RBdHRhY2tIaXRTaGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSB0aGlzLmdldExhc3RBdHRhY2soKTtcbiAgICBjb25zdCBjaGVja1Jlc3VsdCA9IF9zaGlwcy5maW5kKFxuICAgICAgc2hpcCA9PiBzdHJpbmdpZnlFbGVtZW50cyhzaGlwLmdldENvb3JkaW5hdGVzKCkpLmluY2x1ZGVzKGxhc3RBdHRhY2sudG9TdHJpbmcoKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIChjaGVja1Jlc3VsdCkgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICB0aGlzLmNoZWNrTGFzdEF0dGFja1NhbmtTaGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxhc3RBdHRhY2sgPSB0aGlzLmdldExhc3RBdHRhY2soKTtcbiAgICBjb25zdCBsYXN0U2hpcEhpdCA9IF9zaGlwcy5maW5kKFxuICAgICAgc2hpcCA9PiBzdHJpbmdpZnlFbGVtZW50cyhzaGlwLmdldENvb3JkaW5hdGVzKCkpLmluY2x1ZGVzKGxhc3RBdHRhY2sudG9TdHJpbmcoKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGxhc3RTaGlwSGl0ID8gbGFzdFNoaXBIaXQuaXNTdW5rKCkgOiBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuZ2V0QWxsQ2VsbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWxsQ2VsbHMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IF9sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gX2xlbmd0aDsgaisrKSB7XG4gICAgICAgIGFsbENlbGxzLnB1c2goW2ksIGpdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWy4uLmFsbENlbGxzXTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gX3BsYWNlTWlzc2VkQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpIHtcbiAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKGF0dGFja0Nvb3JkaW5hdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3BsYWNlQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpIHtcbiAgICBfYXR0YWNrcy5wdXNoKGF0dGFja0Nvb3JkaW5hdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2lzQXR0YWNraW5nQWxyZWFkeUF0dGFja2VkQ2VsbChhdHRhY2tDb29yZGluYXRlU3RyKSB7XG4gICAgZm9yIChjb25zdCBhdHRhY2sgb2YgX2F0dGFja3MpIHtcbiAgICAgIGlmIChhdHRhY2sudG9TdHJpbmcoKSA9PT0gYXR0YWNrQ29vcmRpbmF0ZVN0cikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLnBsYWNlU2hpcCA9IGZ1bmN0aW9uIChzaGlwKSB7XG4gICAgX3NoaXBzLnB1c2goc2hpcCk7XG4gIH1cblxuICB0aGlzLmFyZUFsbFNoaXBzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3NoaXBzLmV2ZXJ5KHNoaXAgPT4gc2hpcC5pc1N1bmsoKSk7XG4gIH1cblxuICBsZXQgX2xhc3RBdHRhY2tTdWNjZXNzZnVsO1xuXG4gIHRoaXMuY2hlY2tMYXN0QXR0YWNrU3VjY2Vzc2Z1bCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2xhc3RBdHRhY2tTdWNjZXNzZnVsO1xuICB9XG5cbiAgdGhpcy5yZWNlaXZlQXR0YWNrID0gZnVuY3Rpb24gKGF0dGFja0Nvb3JkaW5hdGUpIHtcbiAgICAvKiBDaGVjayBpZiBpdCBkb2VzIG5vdCBhdHRhY2sgYW4gYWxyZWFkeSBhdHRhY2tlZCBjb29yZGluYXRlICovXG4gICAgY29uc3QgYXR0YWNrQ29vcmRpbmF0ZVN0ciA9IGF0dGFja0Nvb3JkaW5hdGUudG9TdHJpbmcoKTtcblxuICAgIGlmIChfaXNBdHRhY2tpbmdBbHJlYWR5QXR0YWNrZWRDZWxsKGF0dGFja0Nvb3JkaW5hdGVTdHIpKSB7XG4gICAgICBfbGFzdEF0dGFja1N1Y2Nlc3NmdWwgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfcGxhY2VBdHRhY2soYXR0YWNrQ29vcmRpbmF0ZSk7XG5cbiAgICBmb3IgKGNvbnN0IHNoaXAgb2YgX3NoaXBzKSB7XG4gICAgICBmb3IgKGNvbnN0IHNoaXBDb29yZGluYXRlIG9mIHNoaXAuZ2V0Q29vcmRpbmF0ZXMoKSkge1xuICAgICAgICBpZiAoc2hpcENvb3JkaW5hdGUudG9TdHJpbmcoKSA9PT0gYXR0YWNrQ29vcmRpbmF0ZVN0cikge1xuICAgICAgICAgIC8vIGhpdFNoaXAoc2hpcCwgc2hpcC5nZXRDb29yZGluYXRlcygpLmluZGV4T2Yoc2hpcENvb3JkaW5hdGUpKTtcbiAgICAgICAgICBzaGlwLmhpdChzaGlwLmdldENvb3JkaW5hdGVzKCkuaW5kZXhPZihzaGlwQ29vcmRpbmF0ZSkpOyAvLyBoaXQgdGhlIHNoaXAgYXQgdGhpcyBwb3NpdGlvblxuICAgICAgICAgIF9sYXN0QXR0YWNrU3VjY2Vzc2Z1bCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3BsYWNlTWlzc2VkQXR0YWNrKGF0dGFja0Nvb3JkaW5hdGUpO1xuICAgIF9sYXN0QXR0YWNrU3VjY2Vzc2Z1bCA9IHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkOyIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi9wbGF5ZXJfbWFuYWdlclwiO1xuaW1wb3J0IHsgZ2V0UGVycGVuZGljdWxhckNlbGxzIH0gZnJvbSBcIi4vdXRpbHMvaGVscGVyXCI7XG5pbXBvcnQgeyBzdHJpbmdpZnlFbGVtZW50cyB9IGZyb20gXCIuL3V0aWxzL2hlbHBlclwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAjZ2FtZWJvYXJkO1xuICAjbmFtZTtcblxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy4jbmFtZSA9IG5hbWU7XG4gICAgdGhpcy4jZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIFBsYXllck1hbmFnZXIuYWRkUGxheWVyKHRoaXMpO1xuICB9XG5cbiAgZ2V0IGdhbWVib2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jZ2FtZWJvYXJkO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI25hbWU7XG4gIH1cblxuICBpc0dhbWVPdmVyKCkge1xuICAgIHJldHVybiB0aGlzLiNnYW1lYm9hcmQuYXJlQWxsU2hpcHNTdW5rKCk7XG4gIH1cbn1cblxuY2xhc3MgQ29tcHV0ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICAjbGFzdEhpdEF0U2hpcCA9IG51bGw7XG5cbiAgI3RyeWluZ1RvU2lua1NoaXAgPSBmYWxzZTsgLy8gSXQgd2lsbCB0cnkgdG8gc2luayBhIHNoaXAgaWYgaXQgaGl0IGl0XG5cbiAgI2ZpcnN0SGl0QXRTaGlwID0gbnVsbDsgLy8gVGhlIHZlcnkgZmlyc3Qgc2hpcCdzIGNvb3JkaW5hdGUgYXR0YWNrZWRcblxuICAvLyBJZiB0aGUgc2hpcCBpcyBhdHRhY2tlZCB0d2ljZSwgaXQgd2lsbCBkZXRlcm1pbmUgd2hldGhlciB0aGUgc2hpcCBpcyBob3Jpem9udGFsIG9yIHZlcnRpY2FsXG4gICNhdHRhY2tEaXJlY3Rpb24gPSBudWxsO1xuXG4gICNoaXRzQXRTaGlwID0gW107IC8vIEFsbCBoaXRzIGF0IHRoZSBjdXJyZW50IHNoaXAgdGhhdCBpdCBpcyB0cnlpbmcgdG8gYXR0YWNrIGFuZCBzaW5rXG4gICNndWVzc2VkU2hpcFBvc2l0aW9ucyA9IFtdOyAvLyBJdCB3aWxsIGd1ZXNzIHdoZXJlIHRoZSBzaGlwIG1heSBiZVxuXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcihuYW1lKTtcbiAgfVxuXG4gIC8qIEdldHRlcnMgYW5kIHNldHRlcnMgYXJlIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkgKi9cblxuICBnZXQgbGFzdEhpdEF0U2hpcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFzdEhpdEF0U2hpcDtcbiAgfVxuXG4gIGdldCB0cnlpbmdUb1NpbmtTaGlwKCkge1xuICAgIHJldHVybiB0aGlzLiN0cnlpbmdUb1NpbmtTaGlwO1xuICB9XG5cbiAgc2V0IGxhc3RIaXRBdFNoaXAodmFsdWUpIHtcbiAgICB0aGlzLiNsYXN0SGl0QXRTaGlwID0gdmFsdWU7XG4gIH1cblxuICBzZXQgdHJ5aW5nVG9TaW5rU2hpcCh2YWx1ZSkge1xuICAgIHRoaXMuI3RyeWluZ1RvU2lua1NoaXAgPSB2YWx1ZTtcbiAgfVxuXG5cbiAgbWFrZU1vdmUoKSB7XG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gUGxheWVyTWFuYWdlci5nZXRQbGF5ZXJQb3NzaWJsZUF0dGFja3ModGhpcyk7XG5cbiAgICBpZiAodGhpcy4jdHJ5aW5nVG9TaW5rU2hpcCkge1xuICAgICAgdGhpcy5jdXJyZW50QXR0YWNrID0gdGhpcy4jZ2V0UG90ZW50aWFsQXR0YWNrVG9TaW5rU2hpcChwb3NzaWJsZUF0dGFja3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRBdHRhY2sgPSB0aGlzLiNnZXRSYW5kb21Db29yZGluYXRlcyhwb3NzaWJsZUF0dGFja3MpO1xuICAgIH1cblxuICAgIHRoaXMuI2F0dGFja0luRE9NKHRoaXMuY3VycmVudEF0dGFjayk7XG4gICAgdGhpcy5kZWZpbmVOZXh0TW92ZSgpO1xuICB9XG5cbiAgI2dldFJhbmRvbUNvb3JkaW5hdGVzKHBvc3NpYmxlQXR0YWNrcykge1xuICAgIHJldHVybiBwb3NzaWJsZUF0dGFja3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBdHRhY2tzLmxlbmd0aCldO1xuICB9XG5cbiAgI2dldFBvdGVudGlhbEF0dGFja1RvU2lua1NoaXAoYWxsVmFsaWRBdHRhY2tzKSB7XG4gICAgaWYgKHRoaXMuI2ZpcnN0SGl0QXRTaGlwLnRvU3RyaW5nKCkgIT09IHRoaXMuI2xhc3RIaXRBdFNoaXAudG9TdHJpbmcoKSkge1xuICAgICAgLy8gaWYgY29tcHV0ZXIgaGFzIGFscmVhZHkgYXR0YWNrZWQgYSBzaGlwIHR3aWNlIG9yIG1vcmUgdGltZXMsXG4gICAgICAvLyBkZWZpbmUgdGhlIGRpcmVjdGlvbiBpbiB3aGljaCB0byBhdHRhY2sgbmV4dFxuICAgICAgdGhpcy4jc2V0QXR0YWNrRGlyZWN0aW9uKCk7XG4gICAgICB0aGlzLiNndWVzc1NoaXBQb3NpdGlvbnMoKTtcblxuICAgICAgY29uc3QgYXR0YWNrc1RvVmFsaWRhdGUgPSBbXG4gICAgICAgIC4uLnRoaXMuI2d1ZXNzZWRTaGlwUG9zaXRpb25zLFxuICAgICAgXTtcblxuICAgICAgYWxsVmFsaWRBdHRhY2tzID0gc3RyaW5naWZ5RWxlbWVudHMoYWxsVmFsaWRBdHRhY2tzKTtcblxuICAgICAgY29uc3QgdmFsaWRHdWVzc2VkQXR0YWNrcyA9IGF0dGFja3NUb1ZhbGlkYXRlLmZpbHRlcihcbiAgICAgICAgYXR0YWNrID0+IGFsbFZhbGlkQXR0YWNrcy5pbmNsdWRlcyhhdHRhY2sudG9TdHJpbmcoKSlcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IG5leHRBdHRhY2sgPSB2YWxpZEd1ZXNzZWRBdHRhY2tzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkR3Vlc3NlZEF0dGFja3MubGVuZ3RoKV07XG5cbiAgICAgIHJldHVybiBuZXh0QXR0YWNrO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjZWxsc1doZXJlTWF5QmVTaGlwID0gZ2V0UGVycGVuZGljdWxhckNlbGxzKHRoaXMuI2xhc3RIaXRBdFNoaXApOyAvLyBXaGVyZSB0aGVyZSBtaWdodCBiZSBhIHNoaXBcblxuICAgICAgYWxsVmFsaWRBdHRhY2tzID0gc3RyaW5naWZ5RWxlbWVudHMoYWxsVmFsaWRBdHRhY2tzKTtcblxuICAgICAgY29uc3QgdmFsaWRDZWxsc1doZXJlTWF5QmVTaGlwID0gY2VsbHNXaGVyZU1heUJlU2hpcC5maWx0ZXIoXG4gICAgICAgIGNlbGwgPT4gYWxsVmFsaWRBdHRhY2tzLmluY2x1ZGVzKGNlbGwudG9TdHJpbmcoKSlcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB2YWxpZENlbGxzV2hlcmVNYXlCZVNoaXBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsaWRDZWxsc1doZXJlTWF5QmVTaGlwLmxlbmd0aCldO1xuICAgIH1cbiAgfVxuXG4gICNzZXRBdHRhY2tEaXJlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuI2ZpcnN0SGl0QXRTaGlwWzBdIC0gdGhpcy4jbGFzdEhpdEF0U2hpcFswXSA9PT0gMCkge1xuICAgICAgdGhpcy4jYXR0YWNrRGlyZWN0aW9uID0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy4jZmlyc3RIaXRBdFNoaXBbMV0gLSB0aGlzLiNsYXN0SGl0QXRTaGlwWzFdID09PSAwKSB7XG4gICAgICB0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPSAnaG9yaXpvbnRhbCc7XG4gICAgfVxuICB9XG5cbiAgI2d1ZXNzU2hpcFBvc2l0aW9ucygpIHtcbiAgICB0aGlzLiNoaXRzQXRTaGlwLmZvckVhY2goaGl0ID0+IHtcbiAgICAgIGlmICh0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgdGhpcy4jZ3Vlc3NlZFNoaXBQb3NpdGlvbnMucHVzaChcbiAgICAgICAgICBbTnVtYmVyKGhpdFswXSksIE51bWJlcihoaXRbMV0pIC0gMV0sXG4gICAgICAgICAgW051bWJlcihoaXRbMF0pLCBOdW1iZXIoaGl0WzFdKSArIDFdLFxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICB0aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucy5wdXNoKFxuICAgICAgICAgIFtOdW1iZXIoaGl0WzBdKSAtIDEsIE51bWJlcihoaXRbMV0pXSxcbiAgICAgICAgICBbTnVtYmVyKGhpdFswXSkgKyAxLCBOdW1iZXIoaGl0WzFdKV0sXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgI2F0dGFja0luRE9NKGF0dGFjaykge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5qcy1jZWxsLS1wbGF5ZXJbZGF0YS1jb29yZGluYXRlPVwiJHthdHRhY2t9XCJdYCkuY2xpY2soKTtcbiAgfVxuXG4gIGRlZmluZU5leHRNb3ZlKCkge1xuICAgIGlmIChcbiAgICAgIFBsYXllck1hbmFnZXIuY2hlY2tMYXN0QXR0YWNrQXRFbmVteUhpdFNoaXAoKSAmJiAhUGxheWVyTWFuYWdlci5jaGVja0xhc3RBdHRhY2tBdEVuZW15U2Fua1NoaXAoKVxuICAgICkge1xuICAgICAgdGhpcy4jZGVmaW5lTmV4dE1vdmVBc1NoaXBBdHRhY2soKTtcbiAgICB9IGVsc2UgaWYgKFBsYXllck1hbmFnZXIuY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwKCkpIHtcbiAgICAgIHRoaXMuI2RlZmluZU5leHRNb3ZlQXNSYW5kb21BdHRhY2soKTtcbiAgICB9XG4gIH1cblxuICAjZGVmaW5lTmV4dE1vdmVBc1NoaXBBdHRhY2soKSB7XG4gICAgY29uc3QgbGFzdEF0dGFjayA9IFBsYXllck1hbmFnZXIuZ2V0TGFzdEF0dGFja0F0RW5lbXkoKTtcbiAgICBpZiAoIXRoaXMuI2xhc3RIaXRBdFNoaXApIHtcbiAgICAgIC8vIGlmIGl0IGlzIGZpcnN0IGF0dGFjayBhdCB0aGUgc2hpcCAoaXQgd2Fzbid0IGF0dGFja2VkIGJlZm9yZSBhbmQgbGFzdCBoaXQgaXMgZmFsc3kpXG4gICAgICB0aGlzLiNmaXJzdEhpdEF0U2hpcCA9IGxhc3RBdHRhY2s7XG4gICAgfVxuICAgIHRoaXMuI3RyeWluZ1RvU2lua1NoaXAgPSB0cnVlO1xuICAgIHRoaXMuI2xhc3RIaXRBdFNoaXAgPSBsYXN0QXR0YWNrO1xuICAgIHRoaXMuI2hpdHNBdFNoaXAucHVzaChsYXN0QXR0YWNrKTtcbiAgfVxuXG4gICNkZWZpbmVOZXh0TW92ZUFzUmFuZG9tQXR0YWNrKCkge1xuICAgIHRoaXMuI3RyeWluZ1RvU2lua1NoaXAgPSBmYWxzZTtcbiAgICB0aGlzLiNsYXN0SGl0QXRTaGlwID0gbnVsbDtcbiAgICB0aGlzLiNhdHRhY2tEaXJlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuI2hpdHNBdFNoaXAgPSBbXTtcbiAgICB0aGlzLiNndWVzc2VkU2hpcFBvc2l0aW9ucyA9IFtdO1xuICB9XG59XG5cblxuZXhwb3J0IHsgUGxheWVyLCBDb21wdXRlciB9IiwiaW1wb3J0IHsgUGxheWVyLCBDb21wdXRlciB9IGZyb20gXCIuL3BsYXllclwiO1xuXG5jb25zdCBQbGF5ZXJNYW5hZ2VyID0gKCgpID0+IHtcbiAgbGV0IF9jdXJyZW50O1xuICBsZXQgX3BsYXllcnMgPSBbXTtcblxuICBmdW5jdGlvbiBhZGRQbGF5ZXIocGxheWVyKSB7XG4gICAgaWYgKF9wbGF5ZXJzLmxlbmd0aCA9PT0gMikge1xuICAgICAgX3BsYXllcnMgPSBbXTsgLy8gbm8gbW9yZSB0aGFuIHR3byBwbGF5ZXJzIGFyZSBzdG9yZWRcbiAgICB9XG4gICAgX3BsYXllcnMucHVzaChwbGF5ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQ3VycmVudCgpIHtcbiAgICBfY3VycmVudCA9IGdldE5vdEN1cnJlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEN1cnJlbnQocGxheWVyKSB7XG4gICAgX2N1cnJlbnQgPSBwbGF5ZXI7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDdXJyZW50KCkge1xuICAgIHJldHVybiBfY3VycmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBsYXllck5hbWUocGxheWVyKSB7IC8vIE5lZWQgZm9yIERPTSBjbGFzc2VzXG4gICAgcmV0dXJuIChwbGF5ZXIgaW5zdGFuY2VvZiBDb21wdXRlcikgPyAnY29tcHV0ZXInIDogJ3BsYXllcic7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROb3RDdXJyZW50KCkge1xuICAgIHJldHVybiAoX2N1cnJlbnQgPT09IF9wbGF5ZXJzWzBdKSA/IF9wbGF5ZXJzWzFdIDogX3BsYXllcnNbMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQbGF5ZXJQb3NzaWJsZUF0dGFja3MocGxheWVyKSB7XG4gICAgLy8gRmluZHMgdGhlIGVuZW15IHBsYXllciBhbmQgZ2V0cyB0aGUgcG9zc2libGUgYXR0YWNrcyBmcm9tIHRoZWlyIGdhbWVib2FyZFxuICAgIHJldHVybiBfcGxheWVycy5maW5kKF9wbGF5ZXIgPT4gX3BsYXllciAhPT0gcGxheWVyKS5nYW1lYm9hcmQuZ2V0UG9zc2libGVBdHRhY2tzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMYXN0QXR0YWNrQXRFbmVteSgpIHtcbiAgICBjb25zdCBlbmVteSA9IGdldE5vdEN1cnJlbnQoKTtcbiAgICByZXR1cm4gZW5lbXkuZ2FtZWJvYXJkLmdldExhc3RBdHRhY2soKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrTGFzdEF0dGFja0F0RW5lbXlIaXRTaGlwKCkge1xuICAgIGNvbnN0IGVuZW15ID0gZ2V0Tm90Q3VycmVudCgpO1xuICAgIHJldHVybiBlbmVteS5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrSGl0U2hpcCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwKCkge1xuICAgIGNvbnN0IGVuZW15ID0gZ2V0Tm90Q3VycmVudCgpO1xuICAgIHJldHVybiBlbmVteS5nYW1lYm9hcmQuY2hlY2tMYXN0QXR0YWNrU2Fua1NoaXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUdhbWVib2FyZEF0dGFjayhjb29yZGluYXRlcykge1xuICAgIGlmICghY29vcmRpbmF0ZXMpIHJldHVybjtcblxuICAgIGNvbnN0IGVuZW15ID0gZ2V0Tm90Q3VycmVudCgpO1xuICAgIGVuZW15LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGVzLnNwbGl0KCcsJykpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRDdXJyZW50LFxuICAgIGdldEN1cnJlbnQsXG4gICAgZ2V0Tm90Q3VycmVudCxcbiAgICBnZXRQbGF5ZXJOYW1lLFxuICAgIHRvZ2dsZUN1cnJlbnQsXG4gICAgYWRkUGxheWVyLFxuICAgIGdldFBsYXllclBvc3NpYmxlQXR0YWNrcyxcbiAgICBoYW5kbGVHYW1lYm9hcmRBdHRhY2ssXG4gICAgY2hlY2tMYXN0QXR0YWNrQXRFbmVteUhpdFNoaXAsXG4gICAgY2hlY2tMYXN0QXR0YWNrQXRFbmVteVNhbmtTaGlwLFxuICAgIGdldExhc3RBdHRhY2tBdEVuZW15XG4gIH1cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiaW1wb3J0IHtcbiAgdmFsaWRhdGVSZWxhdGl2ZVNoaXBQbGFjZW1lbnQsIGdldFZhbGlkUGxhY2VtZW50Q2VsbHNcbn0gZnJvbSBcIi4vc2hpcF92YWxpZGF0b3JcIjtcblxuaW1wb3J0IElucHV0IGZyb20gXCIuL3V0aWxzL2lucHV0XCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycygpIHtcbiAgZ2VuZXJhdGVTaGlwc1JhbmRvbWx5KCk7XG4gIGdlbmVyYXRlU2hpcHNSYW5kb21seSgpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVNoaXBzUmFuZG9tbHkoKSB7XG4gIGNvbnN0IHJlYWR5U2hpcHMgPSBbXG4gIF07XG5cbiAgY29uc3QgY2FycmllciA9IGdldFZhbGlkU2hpcCg0LCByZWFkeVNoaXBzKTtcbiAgcmVhZHlTaGlwcy5wdXNoKGNhcnJpZXIpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgY29uc3QgYmF0dGxlc2hpcCA9IGdldFZhbGlkU2hpcCgzLCByZWFkeVNoaXBzKTtcbiAgICByZWFkeVNoaXBzLnB1c2goYmF0dGxlc2hpcCk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGNvbnN0IGNydWlzZXIgPSBnZXRWYWxpZFNoaXAoMiwgcmVhZHlTaGlwcyk7XG4gICAgcmVhZHlTaGlwcy5wdXNoKGNydWlzZXIpO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICBjb25zdCBwYXRyb2xCb2F0ID0gZ2V0VmFsaWRTaGlwKDEsIHJlYWR5U2hpcHMpO1xuICAgIHJlYWR5U2hpcHMucHVzaChwYXRyb2xCb2F0KTtcbiAgfVxuXG4gIElucHV0LnBsYWNlU2hpcHMocmVhZHlTaGlwcyk7XG59XG5cbmZ1bmN0aW9uIGdldFZhbGlkU2hpcChzaGlwTGVuZ3RoLCBhbGxTaGlwcykge1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGNvbnN0IGdlbmVyYXRlZFNoaXAgPSBnZW5lcmF0ZVNoaXAoc2hpcExlbmd0aCk7XG5cbiAgICBpZiAodmFsaWRhdGVSZWxhdGl2ZVNoaXBQbGFjZW1lbnQoZ2VuZXJhdGVkU2hpcCwgYWxsU2hpcHMpKSB7XG4gICAgICByZXR1cm4gZ2VuZXJhdGVkU2hpcDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTaGlwKHNoaXBMZW5ndGgpIHtcbiAgY29uc3QgdmFsaWRDZWxscyA9IGdldFZhbGlkUGxhY2VtZW50Q2VsbHMoc2hpcExlbmd0aCk7XG5cbiAgY29uc3QgZmlyc3RDb29yZGluYXRlID0gdmFsaWRDZWxsc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZENlbGxzLmxlbmd0aCldO1xuICBjb25zdCBjb29yZGluYXRlWCA9IGZpcnN0Q29vcmRpbmF0ZVswXTtcbiAgY29uc3QgY29vcmRpbmF0ZVkgPSBmaXJzdENvb3JkaW5hdGVbMV07XG5cbiAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gW1suLi5maXJzdENvb3JkaW5hdGVdXTtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IHNoaXBMZW5ndGg7IGkrKykgeyAvLyBnbyBmcm9tIHRoZSBzZWNvbmQgY29vcmRpbmF0ZVxuICAgIHNoaXBDb29yZGluYXRlcy5wdXNoKFtjb29yZGluYXRlWCArIGksIGNvb3JkaW5hdGVZXSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNoaXAoLi4uc2hpcENvb3JkaW5hdGVzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVTaGlwc0ZvckJvdGhQbGF5ZXJzO1xuZXhwb3J0IHsgZ2VuZXJhdGVTaGlwc1JhbmRvbWx5IH0iLCJmdW5jdGlvbiBTaGlwKC4uLmNvb3JkaW5hdGVzKSB7XG4gIC8qIENvb3JkaW5hdGVzIGFyZSBzaGlwJ3MgbG9jYXRpb24gb24gYm9hcmQgKi9cbiAgLyogVGhleSBhcmUgcmVjZWl2ZWQgYW5kIG5vdCBjcmVhdGVkIGhlcmUuIExvb2sgbGlrZSBbMiwgM10gKi9cbiAgLyogUG9zaXRpb25zIGFyZSBzaGlwJ3MgaW5uZXIgaGFuZGxpbmcgb2YgdGhlc2UgY29vcmRpbmF0ZXMgKi9cbiAgLyogUG9zaXRpb25zIGFyZSB1c2VkIHdoZW4gZGVjaWRpbmcgd2hlcmUgdGhlIHNoaXAgaXMgaGl0LCAqL1xuICAvKiBXaGV0aGVyIG9yIG5vdCBpdCBpcyBzdW5rLCBhbmQgd2hlcmUgZXhhY3RseSAqL1xuICAvKiBUbyBoaXQgdGhlIHNoaXAgaW4gdGhlIGZpcnN0IHBsYWNlICovXG5cbiAgY29uc3QgX3Bvc2l0aW9ucyA9IF9jcmVhdGVQb3NpdGlvbnMoY29vcmRpbmF0ZXMubGVuZ3RoKTtcblxuICBjb25zdCBfY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICB0aGlzLmdldENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uX2Nvb3JkaW5hdGVzXTtcbiAgfVxuXG4gIHRoaXMuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICByZXR1cm4gX3Bvc2l0aW9uc1twb3NpdGlvbl07XG4gIH1cblxuICB0aGlzLmlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX3Bvc2l0aW9ucy5ldmVyeShwb3NpdGlvbiA9PiBwb3NpdGlvbi5pc0hpdCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qIEhpdCBvbmUgb2Ygc2hpcCdzIHBvc2l0aW9ucyAqL1xuICB0aGlzLmhpdCA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgIF9wb3NpdGlvbnNbcG9zaXRpb25dLmlzSGl0ID0gdHJ1ZTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG5cblxuZnVuY3Rpb24gX2NyZWF0ZVBvc2l0aW9ucyhsZW5ndGgpIHtcbiAgY2xhc3MgUG9zaXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5pc0hpdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBwb3NpdGlvbnMucHVzaChuZXcgUG9zaXRpb24oKSk7XG4gIH1cblxuICByZXR1cm4gcG9zaXRpb25zO1xufSIsImltcG9ydCB7IGdldENlbGxzU3Vycm91bmRpbmdTaGlwLCBzdHJpbmdpZnlFbGVtZW50cyB9IGZyb20gJy4vdXRpbHMvaGVscGVyJztcblxuLyogVGhlIHB1cnBvc2Ugb2YgdGhpcyBtb2R1bGUgaXMgdG8gbm90IGFsbG93IHRvIHBsYWNlIHNoaXBzICovXG4vKiBhZGphY2VudCB0byBlYWNoIG90aGVyIGFuZCBvdXRzaWRlIHRoZSBnYW1lYm9hcmQuICovXG4vKiBUaGVyZSBtdXN0IGJlIHNvbWUgc3BhY2UgYmV0d2VlbiB0aGVtICovXG5cbi8qIEZpcnN0LCBpdCBkZWZpbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBwbGFjZW1lbnQgaXMgdmFsaWQgcmVsYXRpdmUgdG8gb3RoZXIgc2hpcHMgb24gYm9hcmQgKi9cbi8qIFNlY29uZCwgaXQgY2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoZSBjb29yZGluYXRlcyBhcmUgbm90IG91dHNpZGUgdGhlIGdhbWVib2FyZCAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVNoaXBQbGFjZW1lbnQodmFsaWRhdGVkU2hpcCwgYWxsU2hpcHMpIHtcbiAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gdmFsaWRhdGVkU2hpcC5nZXRDb29yZGluYXRlcygpO1xuICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcENvb3JkaW5hdGVzLmxlbmd0aDtcbiAgY29uc3QgZmlyc3RDb29yZGluYXRlID0gc2hpcENvb3JkaW5hdGVzWzBdO1xuXG4gIGNvbnN0IGlzVmFsaWRSZWxhdGl2ZSA9IHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50KHZhbGlkYXRlZFNoaXAsIGFsbFNoaXBzKTtcbiAgY29uc3QgaXNJbnNpZGUgPSAhaXNPdXRzaWRlR2FtZWJvYXJkKHNoaXBMZW5ndGgsIGZpcnN0Q29vcmRpbmF0ZSk7XG5cbiAgY29uc3QgaXNWYWxpZCA9IGlzVmFsaWRSZWxhdGl2ZSAmJiBpc0luc2lkZTtcblxuICByZXR1cm4gaXNWYWxpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGVTaGlwUGxhY2VtZW50O1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50KHZhbGlkYXRlZFNoaXAsIGFsbFNoaXBzKSB7XG4gIC8qIFZhbGlkYXRlIGFnYWluc3Qgb3RoZXIgc2hpcHMgKi9cblxuICBjb25zdCBzaGlwQ2VsbHMgPVxuICAgIHN0cmluZ2lmeUVsZW1lbnRzKHZhbGlkYXRlZFNoaXAuZ2V0Q29vcmRpbmF0ZXMoKSk7XG5cbiAgY29uc3QgYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMgPVxuICAgIHN0cmluZ2lmeUVsZW1lbnRzKGdldEFkamFjZW50U2hpcENvb3JkaW5hdGVzKGFsbFNoaXBzKSk7XG5cbiAgaWYgKHNoaXBDZWxscy5zb21lKGNlbGwgPT4gYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXMoY2VsbCkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cblxuZnVuY3Rpb24gZ2V0QWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMoYWxsU2hpcHMpIHtcbiAgY29uc3QgYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXMgPSBhbGxTaGlwc1xuICAgIC5tYXAoc2hpcCA9PiB7XG4gICAgICBjb25zdCBzaGlwQ29vcmRpbmF0ZXMgPSBzaGlwLmdldENvb3JkaW5hdGVzKCk7XG4gICAgICByZXR1cm4gZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAoc2hpcENvb3JkaW5hdGVzKTtcbiAgICB9KVxuICAgIC5mbGF0KCk7XG5cbiAgYWxsU2hpcHMuZm9yRWFjaChzaGlwID0+IHtcbiAgICBjb25zdCBzaGlwQ29vcmRpbmF0ZXMgPSBzaGlwLmdldENvb3JkaW5hdGVzKCk7XG4gICAgc2hpcENvb3JkaW5hdGVzLmZvckVhY2goY29vcmRpbmF0ZSA9PlxuICAgICAgYWRqYWNlbnRTaGlwQ29vcmRpbmF0ZXNcbiAgICAgICAgLnB1c2goc3RyaW5naWZ5RWxlbWVudHMoY29vcmRpbmF0ZSkpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFkamFjZW50U2hpcENvb3JkaW5hdGVzO1xufVxuXG5mdW5jdGlvbiBpc091dHNpZGVHYW1lYm9hcmQodmFsaWRhdGVkU2hpcExlbmd0aCwgZmlyc3RDb29yZGluYXRlKSB7XG4gIGNvbnN0IHZhbGlkQ2VsbHMgPSBnZXRWYWxpZFBsYWNlbWVudENlbGxzKHZhbGlkYXRlZFNoaXBMZW5ndGgpO1xuICBjb25zdCBpc1BsYWNlbWVudEludmFsaWQgPSB2YWxpZENlbGxzXG4gICAgLmV2ZXJ5KGNlbGwgPT4gY2VsbC50b1N0cmluZygpICE9PSBmaXJzdENvb3JkaW5hdGUudG9TdHJpbmcoKSk7XG5cbiAgaWYgKGlzUGxhY2VtZW50SW52YWxpZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRWYWxpZFBsYWNlbWVudENlbGxzKHZhbGlkYXRlZFNoaXBMZW5ndGgpIHtcbiAgY29uc3QgdmFsaWRQbGFjZW1lbnRDZWxscyA9IFtdO1xuXG4gIHN3aXRjaCAodmFsaWRhdGVkU2hpcExlbmd0aCkge1xuICAgIGNhc2UgNDoge1xuICAgICAgdmFsaWRQbGFjZW1lbnRDZWxscy5wdXNoKC4uLmdldENlbGxzVmFsaWRGb3JTaGlwRm91cigpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDM6IHtcbiAgICAgIHZhbGlkUGxhY2VtZW50Q2VsbHMucHVzaCguLi5nZXRDZWxsc1ZhbGlkRm9yU2hpcFRocmVlKCkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgMjoge1xuICAgICAgdmFsaWRQbGFjZW1lbnRDZWxscy5wdXNoKC4uLmdldENlbGxzVmFsaWRGb3JTaGlwVHdvKCkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgMToge1xuICAgICAgdmFsaWRQbGFjZW1lbnRDZWxscy5wdXNoKC4uLmdldEFsbEJvYXJkKCkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkUGxhY2VtZW50Q2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxzVmFsaWRGb3JTaGlwRm91cigpIHtcbiAgY29uc3QgdmFsaWRDZWxscyA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDc7IHgrKykge1xuICAgIGZvciAobGV0IHkgPSAxOyB5IDw9IDEwOyB5KyspIHtcbiAgICAgIHZhbGlkQ2VsbHMucHVzaChbeCwgeV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWxpZENlbGxzO1xufVxuXG5mdW5jdGlvbiBnZXRDZWxsc1ZhbGlkRm9yU2hpcFRocmVlKCkge1xuICBjb25zdCB2YWxpZENlbGxzID0gW107XG5cbiAgZm9yIChsZXQgeCA9IDE7IHggPD0gODsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPD0gMTA7IHkrKykge1xuICAgICAgdmFsaWRDZWxscy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkQ2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxzVmFsaWRGb3JTaGlwVHdvKCkge1xuICBjb25zdCB2YWxpZENlbGxzID0gW107XG5cbiAgZm9yIChsZXQgeCA9IDE7IHggPD0gOTsgeCsrKSB7XG4gICAgZm9yIChsZXQgeSA9IDE7IHkgPD0gMTA7IHkrKykge1xuICAgICAgdmFsaWRDZWxscy5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbGlkQ2VsbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbEJvYXJkKCkge1xuICBjb25zdCBhbGxCb2FyZCA9IFtdO1xuXG4gIGZvciAobGV0IHggPSAxOyB4IDw9IDEwOyB4KyspIHtcbiAgICBmb3IgKGxldCB5ID0gMTsgeSA8PSAxMDsgeSsrKSB7XG4gICAgICBhbGxCb2FyZC5wdXNoKFt4LCB5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFsbEJvYXJkO1xufVxuXG5cbmV4cG9ydCB7IHZhbGlkYXRlUmVsYXRpdmVTaGlwUGxhY2VtZW50LCBnZXRWYWxpZFBsYWNlbWVudENlbGxzIH0iLCJmdW5jdGlvbiBnZXRDZWxsc1N1cnJvdW5kaW5nQ2VsbChjZWxsKSB7XG4gIC8vIEl0IG1heSByZXR1cm4gbmVnYXRpdmUgY2VsbHMgdGhhdCBhcmUgbm90IG9uIGJvYXJkLFxuICAvLyBidXQgaXQgZG9lc24ndCBtYXR0ZXIgc2luY2UgdGhleSBhcmUgbm90IHVzZWQgYXQgYWxsXG4gIC8vIEFsbCB3ZSBuZWVkIHRvIGNoZWNrIGlzIHdoZXRoZXIgd2UgY2FuIHBsYWNlIGEgc2hpcCBvblxuICAvLyBhbiBleGlzdGluZyBjZWxsIG9yIG5vdFxuICByZXR1cm4gW1xuICAgIC8vIHJldHVybiBldmVyeXRoaW5nIGFyb3VuZCB0aGlzIGNlbGxcblxuICAgIC8vIGFib3ZlXG4gICAgW2NlbGxbMF0gLSAxLCBjZWxsWzFdIC0gMV0sXG4gICAgW2NlbGxbMF0sIGNlbGxbMV0gLSAxXSxcbiAgICBbY2VsbFswXSArIDEsIGNlbGxbMV0gLSAxXSxcblxuICAgIC8vIHJpZ2h0XG4gICAgW2NlbGxbMF0gKyAxLCBjZWxsWzFdXSxcbiAgICAvL2xlZnRcbiAgICBbY2VsbFswXSAtIDEsIGNlbGxbMV1dLFxuXG4gICAgLy8gYmVsb3dcbiAgICBbY2VsbFswXSAtIDEsIGNlbGxbMV0gKyAxXSxcbiAgICBbY2VsbFswXSwgY2VsbFsxXSArIDFdLFxuICAgIFtjZWxsWzBdICsgMSwgY2VsbFsxXSArIDFdLFxuICBdXG59XG5cbmZ1bmN0aW9uIGdldFBlcnBlbmRpY3VsYXJDZWxscyhjZWxsKSB7XG4gIGxldCBjZWxsQWJvdmU7XG4gIGxldCBjZWxsQmVsb3c7XG4gIGxldCBjZWxsVG9UaGVMZWZ0O1xuICBsZXQgY2VsbFRvVGhlUmlnaHQ7XG4gIGxldCBwZXJwZW5kaWN1bGFyQ2VsbHMgPSBbXTtcblxuICBpZiAoY2VsbFsxXSA+IDEpIHtcbiAgICBjZWxsQWJvdmUgPSBbTnVtYmVyKGNlbGxbMF0pLCBOdW1iZXIoY2VsbFsxXSkgLSAxXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsQWJvdmUpO1xuICB9XG5cbiAgaWYgKGNlbGxbMV0gPCAxMCkge1xuICAgIGNlbGxCZWxvdyA9IFtOdW1iZXIoY2VsbFswXSksIE51bWJlcihjZWxsWzFdKSArIDFdO1xuICAgIHBlcnBlbmRpY3VsYXJDZWxscy5wdXNoKGNlbGxCZWxvdyk7XG4gIH1cblxuICBpZiAoY2VsbFswXSA8IDEwKSB7XG4gICAgY2VsbFRvVGhlUmlnaHQgPSBbTnVtYmVyKGNlbGxbMF0pICsgMSwgTnVtYmVyKGNlbGxbMV0pXTtcbiAgICBwZXJwZW5kaWN1bGFyQ2VsbHMucHVzaChjZWxsVG9UaGVSaWdodCk7XG4gIH1cblxuICBpZiAoY2VsbFswXSA+IDEpIHtcbiAgICBjZWxsVG9UaGVMZWZ0ID0gW051bWJlcihjZWxsWzBdKSAtIDEsIE51bWJlcihjZWxsWzFdKV07XG4gICAgcGVycGVuZGljdWxhckNlbGxzLnB1c2goY2VsbFRvVGhlTGVmdCk7XG4gIH1cblxuICByZXR1cm4gWy4uLnBlcnBlbmRpY3VsYXJDZWxsc107XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUVsZW1lbnRzKGFycikge1xuICByZXR1cm4gYXJyLm1hcChlbCA9PiBlbC50b1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gY29udmVydEVsZW1lbnRzVG9OdW1iZXJzKGFycikge1xuICByZXR1cm4gYXJyLm1hcChlbCA9PiBOdW1iZXIoZWwpKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbHNTdXJyb3VuZGluZ1NoaXAoc2hpcENvb3JkaW5hdGVzKSB7XG4gIGNvbnN0IGNlbGxzU3Vycm91bmRpbmdTaGlwID0gc2hpcENvb3JkaW5hdGVzXG4gICAgLm1hcChnZXRDZWxsc1N1cnJvdW5kaW5nQ2VsbClcbiAgICAuZmxhdCgpXG5cbiAgcmV0dXJuIGNlbGxzU3Vycm91bmRpbmdTaGlwO1xufVxuXG5leHBvcnQge1xuICBnZXRDZWxsc1N1cnJvdW5kaW5nQ2VsbCxcbiAgZ2V0UGVycGVuZGljdWxhckNlbGxzLFxuICBzdHJpbmdpZnlFbGVtZW50cyxcbiAgY29udmVydEVsZW1lbnRzVG9OdW1iZXJzLFxuICBnZXRDZWxsc1N1cnJvdW5kaW5nU2hpcCxcbn07IiwiaW1wb3J0IHsgY29udmVydEVsZW1lbnRzVG9OdW1iZXJzIH0gZnJvbSBcIi4vaGVscGVyXCI7XG5cbmNvbnN0IElucHV0ID0gKCgpID0+IHtcbiAgbGV0IF9sYXN0TW92ZTtcbiAgbGV0IF9zaGlwcyA9IFtdOyAvL3R3by1kaW1lbnNpb25hbC5cblxuICBmdW5jdGlvbiBzZXRMYXN0TW92ZShjb29yZGluYXRlKSB7XG4gICAgX2xhc3RNb3ZlID0gY29udmVydEVsZW1lbnRzVG9OdW1iZXJzKGNvb3JkaW5hdGUpO1xuICAgIGNvbnNvbGUubG9nKF9sYXN0TW92ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMYXN0TW92ZSgpIHtcbiAgICByZXR1cm4gX2xhc3RNb3ZlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwcyhzaGlwcykge1xuICAgIF9zaGlwcy5wdXNoKHNoaXBzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBsYXllclNoaXBzKCkge1xuICAgIHJldHVybiBfc2hpcHNbMF07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb21wdXRlclNoaXBzKCkge1xuICAgIHJldHVybiBfc2hpcHNbMV07XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICBfbGFzdE1vdmUgPSBudWxsO1xuICAgIF9zaGlwcyA9IFtdO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRMYXN0TW92ZSxcbiAgICBnZXRMYXN0TW92ZSxcbiAgICBnZXRQbGF5ZXJTaGlwcyxcbiAgICBnZXRDb21wdXRlclNoaXBzLFxuICAgIHBsYWNlU2hpcHMsXG4gICAgY2xlYXJcbiAgfVxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgSW5wdXQ7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge1xuICBmaWxsQmF0dGxlZmllbGRzV2l0aENlbGxzLFxuICBjbGVhckJhdHRsZWZpZWxkcyxcbiAgc2hvd1BsYXllclNoaXBzLFxufSBmcm9tIFwiLi9tb2R1bGVzL2RvbS9iYXR0bGVmaWVsZFwiO1xuaW1wb3J0IHsgYWRkRXZlbnRzVG9TdGFydE1lbnVCdXR0b25zIH0gZnJvbSBcIi4vbW9kdWxlcy9kb20vc3RhcnRfbWVudVwiO1xuaW1wb3J0IHsgYWRkUmVzdGFydEV2ZW50IH0gZnJvbSBcIi4vbW9kdWxlcy9kb20vcmVzdGFydFwiO1xuXG5pbXBvcnQgVUlHYW1lU3RhdGUgZnJvbSBcIi4vbW9kdWxlcy9kb20vZ2FtZV9zdGF0ZVwiO1xuaW1wb3J0IEdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vbW9kdWxlcy91dGlscy9pbnB1dFwiO1xuaW1wb3J0IGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycyBmcm9tIFwiLi9tb2R1bGVzL3JhbmRvbV9zaGlwc1wiO1xuXG4oKCkgPT4ge1xuICBpbml0R2FtZSgpO1xuICBhZGRSZXN0YXJ0RXZlbnQocmVjZWl2ZVJlc3RhcnQpO1xufSkoKTtcblxuZnVuY3Rpb24gaW5pdEdhbWUoKSB7XG4gIElucHV0LmNsZWFyKCk7XG4gIC8qIFVwZGF0ZSBiYXR0bGVmaWVsZHMgKi9cbiAgY2xlYXJCYXR0bGVmaWVsZHMoKTtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpO1xuXG4gIGdlbmVyYXRlU2hpcHNGb3JCb3RoUGxheWVycygpO1xuICBzaG93UGxheWVyU2hpcHMoKTtcblxuICBhZGRFdmVudHNUb1N0YXJ0TWVudUJ1dHRvbnMocmVjZWl2ZVN0YXJ0LCByZWNlaXZlUmFuZG9tKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVN0YXJ0KCkge1xuICBHYW1lLnN0YXJ0KCk7XG59XG5cbmZ1bmN0aW9uIHJlY2VpdmVSZXN0YXJ0KCkge1xuICBVSUdhbWVTdGF0ZS50b2dnbGVSZXN1bHQoKTtcbiAgVUlHYW1lU3RhdGUuc2hvd1Jlc3RhcnQoKTtcbiAgaW5pdEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gcmVjZWl2ZVJhbmRvbSgpIHtcbiAgSW5wdXQuY2xlYXIoKTtcbiAgY2xlYXJCYXR0bGVmaWVsZHMoKTtcbiAgZmlsbEJhdHRsZWZpZWxkc1dpdGhDZWxscygpO1xuICBnZW5lcmF0ZVNoaXBzRm9yQm90aFBsYXllcnMoKTtcbiAgc2hvd1BsYXllclNoaXBzKCk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9