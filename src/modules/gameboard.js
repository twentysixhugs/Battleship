import { hitShip } from "./manager";


function Gameboard() {
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

  this.isLastAttackSucessful = function () {
    return _lastAttackSucessful;
  }

  let _lastAttackSucessful;

  this.receiveAttack = function (attackCoordinate) {
    /* Check if it does not attack an already attacked coordinate */
    const attackCoordinateStr = attackCoordinate.toString();

    for (const attack of _attacks) {
      if (attack.toString() === attackCoordinateStr) {
        _lastAttackSucessful = false;
        return;
      }
    }

    _placeAttack(attackCoordinate);

    for (const ship of _ships) {
      for (const shipCoordinate of ship.getCoordinates()) {
        if (shipCoordinate.toString() === attackCoordinateStr) {
          hitShip(ship, ship.getCoordinates().indexOf(shipCoordinate)); // hit the ship at this position
          _lastAttackSucessful = true;
          return;
        }
      }
    }

    _placeMissedAttack(attackCoordinate);
    _lastAttackSucessful = true;
    return;
  }
}

export default Gameboard;