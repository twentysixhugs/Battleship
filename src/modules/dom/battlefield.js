import PlayerManager from "../player_manager";

/* Cells generation */

function fillBattlefieldsWithCells() {
  const playerBattlefield = document.querySelector('.js-player-battlefield');
  const computerBattlefield = document.querySelector('.js-computer-battlefield');

  fillWithCells(playerBattlefield, 'js-cell--player');
  fillWithCells(computerBattlefield, 'js-cell--computer');
}

function fillWithCells(battlefield, jsClassName) {
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      battlefield.appendChild(_createCell([j, i], jsClassName));
    }
  }

  function _createCell(coordinate, jsClassName) {
    const cell = document.createElement('div');
    cell.classList.add('gameboard__cell', jsClassName);
    cell.dataset.coordinate = coordinate;

    return cell;
  }
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
    computer.makeMove();
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

export {
  fillBattlefieldsWithCells,
  playerMove,
  computerMove,
}