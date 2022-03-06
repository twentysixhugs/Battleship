import GameboardFactory from '../src/modules/gameboard';
import ShipFactory from '../src/modules/ship';


describe('attack receiving and handling', () => {
  test('hits the ship cell when attacked', () => {
    const gameboard = new GameboardFactory();

    const ship = new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]);
    gameboard.placeShips(ship);

    const attackCoordinate = [6, 2];
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(1)).toHaveProperty('isHit', true);
  });

  test('not attacked cells are not affected', () => {
    const gameboard = new GameboardFactory();

    const ship = new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]);
    gameboard.placeShips(ship);

    const attackCoordinate = [6, 2];
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(2)).toHaveProperty('isHit', false);
  });
});

describe('ships storing and accessing', () => {
  test('multiple ships are saved and can be accessed', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]),
      new ShipFactory([1, 2], [1, 3]),
    ]

    gameboard.placeShips(...ships);

    expect(gameboard.getShips()).toEqual(ships);
  });

  test('a single ship is added and can be accessed', () => {
    const gameboard = new GameboardFactory();
    const ship = new ShipFactory([6, 1], [6, 2]);

    gameboard.placeShips(ship);

    expect(gameboard.getShips()).toEqual([ship])
  });

  test('ships can be added once again', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory([6, 1], [6, 2]),
      new ShipFactory([8, 3], [8, 4]),
      new ShipFactory([1, 1])
    ];

    gameboard.placeShips(ships[0], ships[1]);

    gameboard.placeShips(ships[2]);

    expect(gameboard.getShips()).toEqual(ships);
  });

  test('array of ships cannot be modified', () => {
    const gameboard = new GameboardFactory();
    gameboard.placeShips(new ShipFactory([6, 1], [6, 2]));

    const obtainedShips = gameboard.getShips();
    obtainedShips[0] = 'not a ship';

    expect(obtainedShips).not.toEqual(gameboard.getShips());
  })

  test('cannot place a ship near other ships', () => {
    const gameboard = new GameboardFactory();
    gameboard.placeShips(new ShipFactory([6, 1], [6, 2]));
    expect(gameboard.placeShips(new ShipFactory([10, 1], [10, 2]))).toBeFalsy;
  })
});

describe('missed attacks handling', () => {
  test('missed attack is caught and stored', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory([6, 1], [6, 2]),
      new ShipFactory([6, 3], [6, 4]),
      new ShipFactory([1, 6], [1, 7], [1, 8])
    ];

    gameboard.placeShips(...ships);

    // hit where there's no ship
    gameboard.receiveAttack([2, 8]);
    gameboard.receiveAttack([2, 7]);

    expect(gameboard.getMissedAttacks()).toEqual([[2, 8], [2, 7]])
  });

  test('no duplicate coordinates', () => {
    const gameboard = new GameboardFactory();
    const ships = [
      new ShipFactory([6, 1], [6, 2]),
      new ShipFactory([6, 3], [6, 4]),
      new ShipFactory([1, 5], [1, 6], [1, 7])
    ];

    gameboard.placeShips(...ships);

    gameboard.receiveAttack([2, 8]);
    gameboard.receiveAttack([2, 8]);

    expect(gameboard.getMissedAttacks()).toEqual([[2, 8]])
  });
});

// describe('report whether or not all ships have been sunk.', () => {
//   test('reports that all ships are sunk', () => {
//     const gameboard
//   })

//   // test('reports that not all ships are sunk')
// });