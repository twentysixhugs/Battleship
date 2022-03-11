import { playerTurn, computerTurn } from "./current_player";

const UIGameState = (() => {
  let _currentPlayer;
  let _isStartGame = true;

  function startGame() {
    _currentPlayer = 'player';
    _toggleStartGameInterface();
    _showBothBattlefields();
    _toggleBoardDescriptions();
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

  function _showBothBattlefields() {

  }

  function _toggleStartGameInterface() {
    _toggleStartGameInterfaceVisibility();

    if (_isStartGame) {
      _disableStartGameInterface();
      _isStartGame = false;
    } else {
      _enableStartGameInterface();
      _isStartGame = true;
    }
  }

  function _disableStartGameInterface() {
    const buttonsWithListeners = document.querySelectorAll('.js-random, js-reset, js-start');

    buttonsWithListeners.forEach(button => {
      let buttonWithoutListener = button.cloneNode(true);
      button.parentNode.replaceChild(buttonWithoutListener, button);
    });
  }

  function _enableStartGameInterface() {

  }

  function _toggleStartGameInterfaceVisibility() {
    const port = document.querySelector('.js-port');
    const computerGameboard = document.querySelector('.js-computer-gameboard');
    const gameboardButtons = document.querySelector('.js-gameboard-buttons');

    port.classList.toggle('is-visible');
    computerGameboard.classList.toggle('is-visible');
    gameboardButtons.classList.toggle('is-visible');
  }

  function _toggleBoardDescriptions() {
    const descriptions = document.querySelectorAll('.js-description');
    descriptions.forEach(node => node.classList.toggle('is-visible'));
  }

  return {
    startGame,
    stopGame,
    showGameResult,
    toggleCurrentPlayer,
  }
})();

export default UIGameState;