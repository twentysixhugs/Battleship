import PlayerManager from "../player_manager";

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


function playerMove(player) {
  _disableClicksForBattlefields('player');

  return new Promise((resolve, reject) => {
    const enemyCells = document.querySelectorAll('.js-cell--computer');
    enemyCells.forEach(cell => cell.addEventListener('click', (e) => {
      PlayerManager.handleGameboardAttack(e.target.dataset.coordinate);
      resolve();
    }));
  });
}

function computerMove(computer) {
  _disableClicksForBattlefields();

  return new Promise((resolve, reject) => {
    const enemyCells = document.querySelectorAll('.js-cell--player');
    enemyCells.forEach(cell => cell.addEventListener('click', (e) => {
      PlayerManager.handleGameboardAttack(e.target.dataset.coordinate);
      resolve();
    }));

    computer.makeMove();
  });
}

function _disableClicksForBattlefields() {
  const cellsWithListeners = document.querySelectorAll(`.js-cell--player, .js-cell-computer`);

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