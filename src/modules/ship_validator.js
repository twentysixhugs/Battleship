function validateShipPlacement(ship, ships) {
  const shipCells = ship.getCoordinates();
  const forbiddenCells = getForbiddenCoordinates(ships).map(cell => cell.toString());

  if (shipCells.some(cell => forbiddenCells.includes(cell.toString()))) {
    return false;
  }

  return true;
}

export default validateShipPlacement;


function getForbiddenCoordinates(ships) {
  const forbiddenCoordinates = ships
    .map(ship => getShipSurrounding(ship))
    .flat();

  return forbiddenCoordinates;
}

function getShipSurrounding(ship) {
  const shipCoordinates = ship.getCoordinates();
  const shipCoordinatesStr = shipCoordinates.map(coordinate => coordinate.toString())

  const shipSurrounding = shipCoordinates
    .map(getCellSurrounding)
    .flat()

  return shipSurrounding;
}

function getCellSurrounding(coordinate) {
  // It may return negative coordinates that are not on board,
  // but it doesn't matter since they are not used at all
  // and all we need to check is whether we can place a ship on
  // an existing coordinate or not
  return [
    // return everything around this coordinate

    // above
    [coordinate[0] - 1, coordinate[0] - 1],
    [coordinate[0], coordinate[0] - 1],
    [coordinate[0] + 1, coordinate[0] - 1],

    // right
    [coordinate[0] + 1, coordinate[0]],
    //left
    [coordinate[0] - 1, coordinate[0]],

    // below
    [coordinate[0] - 1, coordinate[0] + 1],
    [coordinate[0], coordinate[0] + 1],
    [coordinate[0] + 1, coordinate[0] + 1],
  ]
}