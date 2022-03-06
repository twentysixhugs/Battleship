import { hitShip } from "./manager";

function GameboardFactory() {
  const _length = 10; // 10 x 10 board
  const _ships = []; // only ships are stored here

  this.placeShips = function (...receivedShips) {
    _ships.push(...receivedShips);
  }

  this.getShips = function () {
    return [..._ships];
  }

  this.receiveAttack = function (attackCoordinate) {
    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate === attackCoordinate) {
          hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
        }
      }
    }
  }
}

export default GameboardFactory;