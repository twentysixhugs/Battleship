import { getCellsSurroundingShip, stringifyElements } from './utils/helper';

/* The purpose of this module is to not allow to place ships */
/* Adjacent to each other. There must be some space between them */

/* First, it defines whether or not the placement is valid relative to other ships on board */
/* Second, it checks whether or not the coordinates are not outside the battlefield */

function validateRelativeShipPlacement(validatedShip, ships) {
  /* Validate against other ships */

  const shipCells =
    stringifyElements(validatedShip.getCoordinates());

  const adjacentShipCoordinates =
    stringifyElements(getAdjacentShipCoordinates(ships));

  if (shipCells.some(cell => adjacentShipCoordinates.includes(cell))) {
    return false;
  }

  return true;
}


function getAdjacentShipCoordinates(ships) {
  const adjacentShipCoordinates = ships
    .map(ship => {
      const shipCoordinates = ship.getCoordinates();
      return getCellsSurroundingShip(shipCoordinates);
    })
    .flat();

  ships.forEach(ship => {
    const shipCoordinates = ship.getCoordinates();
    shipCoordinates.forEach(coordinate => adjacentShipCoordinates.push(stringifyElements(coordinate)));
  });

  return adjacentShipCoordinates;
}

function getValidPlacementCells(validatedShipLength) {
  const validPlacementCells = [];

  switch (validatedShipLength) {
    case 4: {
      validPlacementCells.push(...getCellsValidForShipFour());
      break;
    }
    case 3: {
      validPlacementCells.push(...getCellsValidForShipThree());
      break;
    }
    case 2: {
      validPlacementCells.push(...getCellsValidForShipTwo());
      break;
    }
    case 1: {
      validPlacementCells.push(...getAllBoard());
      break;
    }
  }

  return validPlacementCells;
}

function getCellsValidForShipFour() {
  const validCells = [];

  for (let x = 1; x <= 7; x++) {
    for (let y = 1; y < 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipThree() {
  const validCells = [];

  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y < 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getCellsValidForShipTwo() {
  const validCells = [];

  for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 10; y++) {
      validCells.push([x, y]);
    }
  }

  return validCells;
}

function getAllBoard() {
  const allBoard = [];

  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      allBoard.push([x, y]);
    }
  }

  return allBoard;
}


export { validateRelativeShipPlacement, getValidPlacementCells }