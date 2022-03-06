import { hitShip } from "./manager";

function GameboardFactory() {
  const _length = 10; // 10 x 10 board
  const _ships = [];
  const _missedAttacks = [];

  function _placeMissedAttack(attackCoordinate) {
    _missedAttacks.push(attackCoordinate);
  }

  this.placeShips = function (...receivedShips) {
    _ships.push(...receivedShips);
  }

  this.getShips = function () {
    return [..._ships];
  }

  this.getMissedAttacks = function () {
    return [..._missedAttacks];
  }

  this.receiveAttack = function (attackCoordinate) {
    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate === attackCoordinate) {
          hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
          return;
        }
      }
    }

    if (!_missedAttacks.includes(attackCoordinate)) {
      _placeMissedAttack(attackCoordinate);
    }
  }
}

export default GameboardFactory;