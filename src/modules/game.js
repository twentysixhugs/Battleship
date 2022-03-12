import { Computer, Player } from "./player";
import PlayerManager from "./player_manager";
import Input from "./input";
import Ship from "./ship";
import UIGameState from "./dom/game_state";
import { playerMove, computerMove } from "./dom/battlefield";

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
    gameloop();
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
    UIGameState.startGame();
  }

  async function gameloop() {
    while (_gameGoing) {
      await nextMove();

      const attacker = PlayerManager.getCurrent();
      const attacked = PlayerManager.getNotCurrent();

      if (!attacked.gameboard.isLastAttackSuccessful()) {
        continue;
      }

      if (attacked.isGameOver()) {
        stop();
        _winner = attacker;
        console.log("winner: ", _winner);
        UIGameState.showGameResult(winner === player ? 'win' : 'lose');
        break;
      }

      if (!attacked.gameboard.lastAttackHitShip()) {
        console.log('last attack did not hit ship')
        PlayerManager.toggleCurrent();
        UIGameState.toggleCurrentPlayer();
      }
    }

    async function nextMove() {
      if (PlayerManager.getCurrent() === player) {
        await playerMove(player);
      }
      else if (PlayerManager.getCurrent() === computer) {
        await computerMove(computer);
      }
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
    isGoing,
    getWinner,
  }
})();

export default Game;