import { hitShip } from "./manager";

function GameboardFactory() {
  const _length = 10; // 10 x 10 board
  const _ships = []; // only ships are stored here

  this.placeShip = function (ship) {
    _ships.push(ship);
  }

  this.receiveAttack = function (attackCoordinate) {
    for (const ship of _ships) {
      for (const shipCoordinate of ship.coordinates) {
        if (shipCoordinate === attackCoordinate) {
          hitShip(ship, ship.coordinates.indexOf(shipCoordinate)); // hit the ship at this position
        }
      }
    }
  }
}

export default GameboardFactory;