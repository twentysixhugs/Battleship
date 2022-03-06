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

  function _validateShipCoordinates(ship) {
    // аски значение?

  }

  function _addForbiddenCoordinates(ship) {
    const shipCoordinates = ship.getCoordinates();

    shipCoordinates.forEach(_getForbiddenCoordinates);
  }

  function _getForbiddenCoordinates(coordinate) {

  }

  this.placeShips = function (...receivedShips) {
    // if can push return true else return false
    _ships.push(...receivedShips);
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