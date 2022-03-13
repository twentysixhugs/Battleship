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



export {
  fillBattlefieldsWithCells,
}