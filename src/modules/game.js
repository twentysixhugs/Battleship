import { Computer, Player } from "./player";
import PlayerManager from "./player_manager";
import Input from "./input";
import Ship from "./ship";
import UIGameState from "./dom/game_state";
import { showHitAtShip, showMissedAttack, showSunkShip } from "./dom/battlefield";

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
  }

  function _initPlayers() {
    player = new Player('player');
    computer = new Computer('computer');

    PlayerManager.addPlayer(player);
    PlayerManager.addPlayer(computer);
    PlayerManager.setCurrent(player);
  }

  function _initUI() {
    UIGameState.startGame();
  }

  async function _gameloop() {
    while (_gameGoing) {
      await nextMove();

      const attacker = PlayerManager.getCurrent();
      const attacked = PlayerManager.getNotCurrent();

      if (!attacked.gameboard.isLastAttackSuccessful()) {
        continue;
      }

      if (!attacked.gameboard.lastAttackHitShip()) {
        PlayerManager.toggleCurrent();
        UIGameState.toggleCurrentPlayer();
        showMissedAttack(attacked.gameboard.getLastAttack(), attacked.name);
      } else {
        showHitAtShip(attacked.gameboard.getLastAttack(), attacked.name);
      }

      if (attacked.isGameOver()) {
        _stop();
        _winner = attacker;
        console.log("winner: ", _winner);
        UIGameState.stopGame();
        UIGameState.showGameResult(_winner === player ? true : false);
        break;
      }
    }

    async function nextMove() {
      if (PlayerManager.getCurrent() === player) {
        await UIGameState.playerMove(player);
      }
      else if (PlayerManager.getCurrent() === computer) {
        await UIGameState.computerMove(computer);
      }
    }
  }

  function _placeShips(player1, player2) {
    // TODO: 
    // Loop over data from the input
    // Place it.
    /* Validation must be done in input, this function should only place valid data */
    player1.gameboard.placeShip(new Ship([1, 1], [1, 2], [1, 3], [1, 4]));
    player1.gameboard.placeShip(new Ship([5, 4], [5, 5], [5, 6]));

    player2.gameboard.placeShip(new Ship([1, 1], [1, 2], [1, 3], [1, 4]));
    player2.gameboard.placeShip(new Ship([5, 4], [5, 5], [5, 6]));
  }

  return {
    start,
  }
})();

export default Game;