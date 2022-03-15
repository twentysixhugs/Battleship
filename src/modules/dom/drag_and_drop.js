const Highlighter = (() => {
  let highlightedCellsCoordinates;

  function addHighlight() {
    highlightedCellsCoordinates.forEach(coordinate => {
      const cell = document.querySelector(`.js-cell--player[data-coordinate="${coordinate}"]`);
      if (!cell) return;
      cell.classList.add('drag-over');
    });
  }

  function removeHighlight() {
    if (!highlightedCellsCoordinates) return;

    highlightedCellsCoordinates.forEach(coordinate => {
      const cell = document.querySelector(`.js-cell--player[data-coordinate="${coordinate}"]`);
      if (!cell) return;
      cell.classList.remove('drag-over');
    });
  }

  function setHighlightedCells(value) {
    highlightedCellsCoordinates = value;
  }

  function getHighlightedCells() {
    return highlightedCellsCoordinates
  }

  return {
    addHighlight,
    removeHighlight,
    setHighlightedCells,
    getHighlightedCells
  }
})();

let dragged;

function initDragAndDrop() {
  addDragEventToShips();
  addDragEventsToBattlefieldCells();
}

export default initDragAndDrop;

function addDragEventToShips() {
  const ships = document.querySelectorAll('.ship');
  ships.forEach(ship => ship.addEventListener('dragstart', onDragStart));
}

function addDragEventsToBattlefieldCells() {
  const cells = document.querySelectorAll('.js-cell--player');
  cells.forEach(cell => {
    cell.addEventListener('dragenter', onDragEnter);
    cell.addEventListener('dragover', onDragOver);
    cell.addEventListener('dragleave', onDragLeave);
    cell.addEventListener('drop', onDrop);
  });
}

/* Event handlers */

function onDragStart(e) {
  dragged = e.target;

  setTimeout(() => {
    dragged.classList.add('hide');
  }, 0);

}

function onDragEnter(e) {
  e.preventDefault();
  console.log('dragenter', e);
}

function onDragOver(e) {
  e.preventDefault();
  Highlighter.setHighlightedCells(getShipCells(e));

  if (!Highlighter.getHighlightedCells()) return;

  Highlighter.addHighlight();
}

function onDragLeave(e) {
  if (!Highlighter.getHighlightedCells()) return;

  Highlighter.removeHighlight();
}

function onDrop(e) {
  const dropzone = e.target;
  dropzone.appendChild(dragged);

  Highlighter.removeHighlight();
}

/* Defines what cells to highlight when placing a ship */
function getShipCells(e) {
  if (!e.target.dataset.coordinate) return;
  const length = dragged.dataset.length;
  const coordinates = [e.target.dataset.coordinate];

  const firstCoordinate = e.target.dataset.coordinate.split(',');

  switch (length) {
    case '2': {
      coordinates.push(
        [+firstCoordinate[0] + 1, firstCoordinate[1]].toString()
      )
      break;
    }
    case '3': {
      coordinates.push(
        [+firstCoordinate[0] + 1, firstCoordinate[1]].toString(),
        [+firstCoordinate[0] + 2, firstCoordinate[1]].toString()
      )
      break;
    }
    case '4': {
      coordinates.push(
        [+firstCoordinate[0] + 1, firstCoordinate[1]].toString(),
        [+firstCoordinate[0] + 2, firstCoordinate[1]].toString(),
        [+firstCoordinate[0] + 3, firstCoordinate[1]].toString(),
      )
      break;
    }
  }

  return coordinates;
}
