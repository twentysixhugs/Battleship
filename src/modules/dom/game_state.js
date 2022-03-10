import { playerTurn, computerTurn } from "./current_player";

const UIGameState = (() => {
  let _currentPlayer;

  function startGame() {
    _currentPlayer = 'player';
    playerTurn();
  }

  function stopGame() {

  }

  function showGameResult() {

  }

  function toggleCurrentPlayer() {
    if (_currentPlayer === 'player') {
      _currentPlayer = 'computer';
      computerTurn();
    } else {
      _currentPlayer = 'player';
      playerTurn();
    }
  }

  return {
    startGame,
    stopGame,
    showGameResult,
    toggleCurrentPlayer,
  }
})();

export default UIGameState;