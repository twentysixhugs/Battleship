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

function clearBattlefields() {
  const playerBattlefield = document.querySelector('.js-player-battlefield');
  const computerBattlefield = document.querySelector('.js-computer-battlefield');

  playerBattlefield.textContent = "";
  computerBattlefield.textContent = "";
}

function showMissedAttack(coordinate, enemy) {
  const missedAttackDiv = _createAttack('missed');
  const attackedCell = document.querySelector(`.js-cell--${enemy}[data-coordinate="${coordinate}"]`);

  attackedCell.appendChild(missedAttackDiv);
}

function showHitAtShip(coordinate, enemy) {
  const shipAttackDiv = _createAttack('hit');
  const attackedCell = document.querySelector(`.js-cell--${enemy}[data-coordinate="${coordinate}"]`);

  attackedCell.appendChild(shipAttackDiv);
}

function showSunkShip(coordinate) {

}

function _createAttack(attackResult) {
  const div = document.createElement('div');
  div.classList.add(`gameboard__${attackResult}`);

  return div;
}

export {
  fillBattlefieldsWithCells,
  clearBattlefields,
  showMissedAttack,
  showHitAtShip,
  showSunkShip,
}