import { Computer, Player } from "./player";
import { addEventsToCells } from "./dom/battlefield";
import PlayerManager from "./player_manager";
import Input from "./input";
import Ship from "./ship";
import UIGameState from "./dom/game_state";

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
  }

  function stop() {
    _gameGoing = false;
  }

  function _initPlayers() {
    player = new Player();
    computer = new Computer();

    PlayerManager.addPlayer(player);
    PlayerManager.addPlayer(computer);
    PlayerManager.setCurrent(player);
  }

  function _initUI() {
    addEventsToCells(_receiveComputerMove, _receivePlayerMove);
    UIGameState.startGame();
  }

  function _receivePlayerMove(e) {
    Input.setLastMove(e.target.dataset.coordinate.split(','));
    respondToMove();
    computer.makeMove();
  }

  function _receiveComputerMove(e) {
    Input.setLastMove(e.target.dataset.coordinate.split(','));
    respondToMove();
  }

  function respondToMove() {
    const attacker = PlayerManager.getCurrent();
    const attacked = PlayerManager.getNotCurrent();

    PlayerManager.handleGameboardAttack(Input.getLastMove());

    if (!attacked.gameboard.isLastAttackSuccessful()) {
      return;
    }

    if (attacked.isGameOver()) {
      stop();
      _winner = attacker;
      console.log(_winner);
      return;
    }

    if (!attacked.gameboard.lastAttackHitShip()) {
      console.log('last attack did not hit ship')
      PlayerManager.toggleCurrent();
      UIGameState.toggleCurrentPlayer();
    }
  }

  function isGoing() {
    return _gameGoing;
  }

  function getWinner() {
    return _winner;
  }

  function _placeShips(player1, player2) {
    // TODO: 
    // Loop over data from the input
    // Place it.
    /* Validation must be done in input, this function should only place valid data */
    player1.gameboard.placeShip(new Ship([1, 1], [1, 2], [1, 3], [1, 4]));

    player2.gameboard.placeShip(new Ship([1, 1], [1, 2], [1, 3], [1, 4]));
  }

  return {
    start,
    stop,
    respondToMove,
    isGoing,
    getWinner,
  }
})();

export default Game;