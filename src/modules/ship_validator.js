function validateShipPlacement(validatedShip, ships) {
  const shipCells = stringifyElements(validatedShip.getCoordinates());
  const forbiddenCoordinates = getForbiddenCoordinates(ships);

  if (shipCells.some(cell => forbiddenCoordinates.includes(cell))) {
    return false;
  }

  return true;
}

export default validateShipPlacement;


function getForbiddenCoordinates(ships) {
  const forbiddenCoordinates = ships
    .map(ship => {
      const shipCoordinates = stringifyElements(ship.getCoordinates());
      return getCellsSurroundingShip(shipCoordinates);
    })
    .flat();

  return forbiddenCoordinates;
}

function getCellsSurroundingShip(shipCoordinates) {
  const cellsSurroundingShip = shipCoordinates
    .map(getCellsSurroundingCell)
    .flat()

  return cellsSurroundingShip;
}

function getCellsSurroundingCell(cell) {
  // It may return negative cells that are not on board,
  // but it doesn't matter since they are not used at all
  // All we need to check is whether we can place a ship on
  // an existing cell or not
  return [
    // return everything around this cell

    // above
    [cell[0] - 1, cell[0] - 1],
    [cell[0], cell[0] - 1],
    [cell[0] + 1, cell[0] - 1],

    // right
    [cell[0] + 1, cell[0]],
    //left
    [cell[0] - 1, cell[0]],

    // below
    [cell[0] - 1, cell[0] + 1],
    [cell[0], cell[0] + 1],
    [cell[0] + 1, cell[0] + 1],
  ]
}

function stringifyElements(arr) {
  return arr.map(el => el.toString());
}