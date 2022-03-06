import GameboardFactory from '../src/modules/gameboard';
import ShipFactory from '../src/modules/ship';


describe('attack receiving and handling', () => {
  test('hits the ship cell when attacked', () => {
    const gameboard = new GameboardFactory();

    const ship = new ShipFactory('F1', 'F2', 'F3', 'F4');
    gameboard.placeShips(ship);

    const attackCoordinate = 'F2';
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(1)).toHaveProperty('isHit', true);
  });

  test('not attacked cells are not affected', () => {
    const gameboard = new GameboardFactory();

    const ship = new ShipFactory('F1', 'F2', 'F3', 'F4');
    gameboard.placeShips(ship);

    const attackCoordinate = 'F2';
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(2)).toHaveProperty('isHit', false);
  });
});

describe('ships storing and accessing', () => {
  test('multiple ships are saved and can be accessed', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory('F1', 'F2', 'F3', 'F4'),
      new ShipFactory('A2', 'A3'),
      new ShipFactory('B3')
    ]

    gameboard.placeShips(...ships);

    expect(gameboard.getShips()).toEqual(ships);
  });

  test('a single ship is added and can be accessed', () => {
    const gameboard = new GameboardFactory();
    const ship = new ShipFactory('F1', 'F2');

    gameboard.placeShips(ship);

    expect(gameboard.getShips()).toEqual([ship])
  });

  test('ships can be added once again', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory('F1', 'F2'),
      new ShipFactory('F3', 'F4'),
      new ShipFactory('A5', 'A6', 'A7')
    ];

    gameboard.placeShips(ships[0], ships[1]);

    gameboard.placeShips(ships[2]);

    expect(gameboard.getShips()).toEqual(ships);
  });

  test('array of ships cannot be modified', () => {
    const gameboard = new GameboardFactory();
    gameboard.placeShips(new ShipFactory('F1', 'F2'));

    const obtainedShips = gameboard.getShips();
    obtainedShips[0] = 'not a ship';

    expect(obtainedShips).not.toEqual(gameboard.getShips());
  })
});