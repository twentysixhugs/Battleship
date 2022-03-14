import {
  validateRelativeShipPlacement, getValidPlacementCells
} from "./ship_validator";

import Input from "./input";
import Ship from "./ship";

function generateShipsRandomly() {
  const generatedShips = [
    getValidShip(4),
    getValidShip(3),
    getValidShip(3),
    getValidShip(2),
    getValidShip(2),
    getValidShip(2),
    getValidShip(1),
    getValidShip(1),
    getValidShip(1),
    getValidShip(1),
  ];

  Input.placeShips(generatedShips);
}

function getValidShip(shipLength) {
  while (true) {
    const generatedShip = generateShip(shipLength);

    if (validateRelativeShipPlacement(generateShip)) {
      return generatedShip;
    }
  }
}

function generateShip(shipLength) {
  const firstCoordinate = getValidPlacementCells(shipLength);
  const coordinateX = firstCoordinate[0];
  const coordinateY = firstCoordinate[1];

  const shipCoordinates = [[...firstCoordinate]];

  for (let i = 1; i < shipLength; i++) { // go from the second coordinate
    shipCoordinates.push([coordinateX + i, coordinateY]);
  }

  return new Ship(...shipCoordinates);
}

export default generateShipsRandomly;