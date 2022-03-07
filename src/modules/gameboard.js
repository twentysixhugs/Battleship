import { hitShip } from "./manager";


function GameboardFactory() {
  const _length = 10; // 10 x 10 board
  const _ships = [];
  const _missedAttacks = [];
  const _attacks = [];

  this.getLength = function () {
    return _length;
  }

  this.getShips = function () {
    return [..._ships];
  }

  this.getMissedAttacks = function () {
    return [..._missedAttacks];
  }

  this.getAllAttacks = function () {
    return [..._attacks];
  }


  function _placeMissedAttack(attackCoordinate) {
    _missedAttacks.push(attackCoordinate);
  }

  function _placeAttack(attackCoordinate) {
    _attacks.push(attackCoordinate);
  }

  this.placeShip = function (ship) {
    _ships.push(ship);
  }

  this.areAllShipsSunk = function () {
    return _ships.every(ship => ship.isSunk);
  }


  this.receiveAttack = function (attackCoordinate) {
    /* Check if it does not attack an already attacked coordinate */
    const attackCoordinateStr = attackCoordinate.toString();

    for (const attack of _attacks) {
      if (attack.toString() === attackCoordinateStr) {
        return false;
      }
    }

    _placeAttack(attackCoordinate);

    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate.toString() === attackCoordinateStr) {
          hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
          return true;
        }
      }
    }
    _placeMissedAttack(attackCoordinate);
    return true;
  }
}

export default GameboardFactory;