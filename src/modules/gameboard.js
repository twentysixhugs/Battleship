import { hitShip } from "./manager";


function GameboardFactory() {
  const _length = 10; // 10 x 10 board
  const _ships = [];
  const _missedAttacks = [];

  this.getLength = function () {
    return _length;
  }

  this.getShips = function () {
    return [..._ships];
  }

  this.getMissedAttacks = function () {
    return [..._missedAttacks];
  }


  function _placeMissedAttack(attackCoordinate) {
    _missedAttacks.push(attackCoordinate);
  }

  this.placeShip = function (ship) {
    _ships.push(ship);
  }

  this.areAllShipsSunk = function () {
    return _ships.every(ship => ship.isSunk);
  }


  this.receiveAttack = function (attackCoordinate) {
    const attackCoordinateStr = attackCoordinate.toString();
    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate.toString() === attackCoordinateStr) {
          hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
          return;
        }
      }
    }

    for (const missedAttack of _missedAttacks) {
      if (missedAttack.toString() === attackCoordinateStr) {
        return;
      }
    }

    _placeMissedAttack(attackCoordinate);
  }
}

export default GameboardFactory;