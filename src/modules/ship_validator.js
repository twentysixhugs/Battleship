import { getCellsSurroundingCell, stringifyElements } from './helper';

/* The purpose of this module is to not allow to place ships */
/* Adjacent to each other. There must be some space between them */

function validateShipPlacement(validatedShip, ships) {
  const shipCells = stringifyElements(validatedShip.getCoordinates());
  const forbiddenCoordinates = stringifyElements(getForbiddenCoordinates(ships));


  if (shipCells.some(cell => forbiddenCoordinates.includes(cell))) {
    return false;
  }

  return true;
}

export default validateShipPlacement;


function getForbiddenCoordinates(ships) {
  const forbiddenCoordinates = ships
    .map(ship => {
      const shipCoordinates = ship.getCoordinates();
      return getCellsSurroundingShip(shipCoordinates);
    })
    .flat();

  ships.forEach(ship => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach(coordinate => forbiddenCoordinates.push(stringifyElements(coordinate)));
  });

  return forbiddenCoordinates;
}

function getCellsSurroundingShip(shipCoordinates) {
  const cellsSurroundingShip = shipCoordinates
    .map(getCellsSurroundingCell)
    .flat()

  return cellsSurroundingShip;
}