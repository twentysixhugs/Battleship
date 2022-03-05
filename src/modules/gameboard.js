import ShipFactory from "./ship";

function GameboardFactory() {
  const _length = 10; // 10 x 10 board
  const _gameboard = []; // only ships are stored here

  this.placeShip = function (ship) {
    _gameboard.push(ship);
  }

  //get it

  this.Ship = function (coordinates) {
    const shipLength = coordinates.length;
    const prototype = new ShipFactory(shipLength);

    return Object.assign(Object.create(prototype), { coordinates });
  }

}

/* class GameboardShipFactory extends ShipFactory {
  constructor(coordinates) {
    const shipLength = coordinates.length;
    super(shipLength);

    this.coordinates = coordinates;
  }
} */


export default GameboardFactory;