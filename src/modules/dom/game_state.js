import { playerTurn, computerTurn } from "./current_player";
import PlayerManager from "../player_manager";

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
    _removeAllMoveListeners();
  }

  function showGameResult(isPlayerWinner) {
    if (isPlayerWinner) {
      _showPlayerVictory();
    } else {
      _showPlayerDefeat();
    }
  }

  function _showPlayerVictory() {
    _toggleResult();
    const result = document.querySelector('.js-result');
    result.textContent = 'Victory!';
  }

  function _showPlayerDefeat() {
    _toggleResult();
    const result = document.querySelector('.js-result');
    result.textContent = 'Defeat!';
  }

  function _toggleResult() {
    const resultContainer = document.querySelector('.js-container--result');
    resultContainer.classList.toggle('is-visible');
  }

  /* Player and computer move */

  /* The promises are resolved once the cell is clicked */
  /* The outer module, game, will await for the promise to resolve, */
  /* And the move captured in this module will be handled */

  function playerMove(player) {
    _removeAllMoveListeners();

    return new Promise((resolve, reject) => {
      _addMoveListenerForEnemyCells(resolve, '.js-cell--computer');
    });
  }

  function computerMove(computer) {
    _removeAllMoveListeners();

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
      PlayerManager.handleGameboardAttack(e.target.dataset.coordinate);
      promiseResolveCallback();
    }));
  }

  function _removeAllMoveListeners() {
    const cellsWithListeners = document.querySelectorAll(`.js-cell--player, .js-cell--computer`);

    cellsWithListeners.forEach(cell => {
      let cellWithoutListener = cell.cloneNode(true);
      cell.parentNode.replaceChild(cellWithoutListener, cell);
    });
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
    playerMove,
    computerMove,
  }
})();

export default UIGameState;