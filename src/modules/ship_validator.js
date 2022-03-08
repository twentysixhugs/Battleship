import { getCellsSurroundingCell, stringifyElements } from './helper';

function validateShipPlacement(validatedShip, ships) {
  const shipCells = stringifyElements(validatedShip.getCoordinates());
  const forbiddenCoordinates = stringifyElements(getForbiddenCoordinates(ships));
  ships.forEach(ship => {
    forbiddenCoordinates.push(stringifyElements(ship.getCoordinates()));
  });

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