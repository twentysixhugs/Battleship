import GameboardFactory from '../src/modules/gameboard';
import ShipFactory from '../src/modules/ship';


describe('attack receiving and handling', () => {
  test('hits the ship cell when attacked', () => {
    const gameboard = new GameboardFactory();

    const ship = new ShipFactory(['F1', 'F2', 'F3', 'F4']);
    gameboard.placeShips(ship);

    const attackCoordinate = 'F2';
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(1)).toHaveProperty('isHit', true);
  });

  test('not attacked cells are not affected', () => {
    const gameboard = new GameboardFactory();

    const ship = new ShipFactory(['F1', 'F2', 'F3', 'F4']);
    gameboard.placeShips(ship);

    const attackCoordinate = 'F2';
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(2)).toHaveProperty('isHit', false);
  });
});

describe('ships storing', () => {
  test('multiple ships are saved and can be accessed', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory(['F1', 'F2', 'F3', 'F4']),
      new ShipFactory(['A2', 'A3']),
      new ShipFactory(['B3'])
    ]

    gameboard.placeShips(...ships);

    expect(gameboard.getShips()).toEqual(ships);
  });

  // test('works when adding one ship only', () => {

  // })
});

