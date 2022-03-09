import { Computer, Player } from "./player";
import PlayerManager from "./player_manager";
import Input from "./user_input";
import Ship from "./ship";

const Game = (() => {
  let _gameGoing = false;
  let _winner = null;

  function start() {
    let player = new Player(Input.getPlayerName());
    let computer = new Computer();

    PlayerManager.addPlayer(player);
    PlayerManager.addPlayer(computer);
    PlayerManager.setCurrent(player);

    _placeShips(player, computer);

    _gameGoing = true;
  }

  function stop() {
    _gameGoing = false;
  }

  function respondToMove() {
    const attacker = PlayerManager.getCurrent();
    const attacked = PlayerManager.getNotCurrent();

    PlayerManager.handleGameboardAttack(Input.getLastMove());

    if (!attacked.gameboard.isLastAttackSuccessful()) {
      return;
    }

    if (!enemy.gameboard.lastAttackHitShip()) {
      PlayerManager.toggleCurrent();
    }

    if (attacked.isGameOver()) {
      stop();
      _winner = attacker;
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
    player1.gameboard.placeShip(new Ship([[1, 1], [1, 2], [1, 3], [1, 4]]));
    player1.gameboard.placeShip(new Ship([[3, 1], [3, 2], [3, 3]]));
    player1.gameboard.placeShip(new Ship([[2, 7], [3, 7], [4, 7]]));
    player1.gameboard.placeShip(new Ship([[7, 3], [8, 3]]));
    player1.gameboard.placeShip(new Ship([[1, 10], [2, 10]]));
    player1.gameboard.placeShip(new Ship([[8, 9], [9, 9]]));

    player2.gameboard.placeShip(new Ship([[1, 1], [1, 2], [1, 3], [1, 4]]));
    player2.gameboard.placeShip(new Ship([[3, 1], [3, 2], [3, 3]]));
    player2.gameboard.placeShip(new Ship([[2, 7], [3, 7], [4, 7]]));
    player2.gameboard.placeShip(new Ship([[7, 3], [8, 3]]));
    player2.gameboard.placeShip(new Ship([[1, 10], [2, 10]]));
    player2.gameboard.placeShip(new Ship([[8, 9], [9, 9]]));
  }

  return {
    start,
    respondToMove,
  }
})();

export default Game;