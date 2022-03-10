function initializeBattlefields() {
  const battlefields = document.querySelectorAll('.js-battlefield');
  battlefields.forEach(fillWithCells);
}

function fillWithCells(battlefield) {
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      battlefield.appendChild(_createCell([i, j]));
    }
  }

  function _createCell(coordinate) {
    const cell = document.createElement('div');
    cell.classList.add('gameboard__cell', 'js-cell');
    cell.dataset.coordinate = coordinate;

    return cell
  }
}

function addEvents() {
  const cells = document.querySelectorAll('')
}


export {
  initializeBattlefields,
}