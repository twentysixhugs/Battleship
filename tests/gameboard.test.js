import Gameboard from '../src/modules/gameboard';
import ShipFactory from '../src/modules/ship';


describe('attack receiving and handling', () => {
  test('hits the ship cell when attacked', () => {
    const gameboard = new Gameboard();

    const ship = new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]);
    gameboard.placeShip(ship);

    const attackCoordinate = [6, 2];
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(1)).toHaveProperty('isHit', true);
  });

  test('not attacked cells are not affected', () => {
    const gameboard = new Gameboard();

    const ship = new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]);
    gameboard.placeShip(ship);

    const attackCoordinate = [6, 2];
    gameboard.receiveAttack(attackCoordinate);

    expect(ship.getPosition(2)).toHaveProperty('isHit', false);
  });

  test('cannot attack the same ship cell once again', () => {
    const gameboard = new Gameboard();

    const ship = new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]);
    gameboard.placeShip(ship);

    const attackCoordinate = [6, 2];
    gameboard.receiveAttack(attackCoordinate);
    gameboard.receiveAttack(attackCoordinate);
    expect(gameboard.isLastAttackSucessful()).toBeTruthy;
    expect(gameboard.isLastAttackSucessful()).toBeFalsy;
    expect(gameboard.getAllAttacks()).toEqual([[6, 2]]);
  });

  test('cannot attack the same empty cell once again', () => {
    const gameboard = new Gameboard();
    const attackCoordinate = [6, 2];
    gameboard.receiveAttack(attackCoordinate)
    gameboard.receiveAttack(attackCoordinate)
    expect(gameboard.isLastAttackSucessful()).toBeTruthy;
    expect(gameboard.isLastAttackSucessful()).toBeFalsy;
    expect(gameboard.getAllAttacks()).toEqual([[6, 2]]);
  })
});

describe('ships storing and accessing', () => {
  test('multiple ships are saved and can be accessed', () => {
    const gameboard = new Gameboard();
    const ships = [
      new ShipFactory([6, 1], [6, 2], [6, 3], [6, 4]),
      new ShipFactory([1, 2], [1, 3]),
    ]

    ships.forEach(ship => gameboard.placeShip(ship));

    expect(gameboard.getShips()).toEqual(ships);
  });

  test('a single ship is added and can be accessed', () => {
    const gameboard = new Gameboard();
    const ship = new ShipFactory([6, 1], [6, 2]);

    gameboard.placeShip(ship);

    expect(gameboard.getShips()).toEqual([ship])
  });

  test('array of ships cannot be modified', () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new ShipFactory([6, 1], [6, 2]));

    const obtainedShips = gameboard.getShips();
    obtainedShips[0] = 'not a ship';

    expect(obtainedShips).not.toEqual(gameboard.getShips());
  })

});

describe('missed attacks handling', () => {
  test('missed attack is caught and stored', () => {
    const gameboard = new Gameboard();
    const ships = [
      new ShipFactory([6, 1], [6, 2]),
      new ShipFactory([6, 3], [6, 4]),
      new ShipFactory([1, 6], [1, 7], [1, 8])
    ];

    ships.forEach(ship => gameboard.placeShip(ship));

    // hit where there's no ship
    gameboard.receiveAttack([2, 8]);
    gameboard.receiveAttack([2, 7]);

    expect(gameboard.getMissedAttacks()).toEqual([[2, 8], [2, 7]])
  });

  test('no duplicate coordinates', () => {
    const gameboard = new Gameboard();
    const ships = [
      new ShipFactory([6, 1], [6, 2]),
      new ShipFactory([6, 3], [6, 4]),
      new ShipFactory([1, 5], [1, 6], [1, 7])
    ];

    ships.forEach(ship => gameboard.placeShip(ship));

    gameboard.receiveAttack([2, 8]);
    gameboard.receiveAttack([2, 8]);

    expect(gameboard.getMissedAttacks()).toEqual([[2, 8]])
  });
});

describe('report whether or not all ships have been sunk.', () => {
  test('reports that all ships are sunk', () => {
    const gameboard = new Gameboard();
    const ships = [
      new ShipFactory([5, 3], [6, 3], [7, 3]),
      new ShipFactory([5, 5], [6, 5], [7, 5]),
    ]

    ships.forEach(ship => {
      gameboard.placeShip(ship);
      ship.hit(0);
      ship.hit(1);
      ship.hit(2);
    });

    expect(gameboard.areAllShipsSunk()).toBeTruthy;
  })

  test('returns true if not all ships are sunk', () => {
    const gameboard = new Gameboard();
    const ships = [
      new ShipFactory([5, 3], [6, 3], [7, 3]),
      new ShipFactory([5, 5], [6, 5], [7, 5]),
    ]

    ships.forEach(ship => {
      gameboard.placeShip(ship);
    });

    ships[0].hit(0);
    ships[0].hit(1);
    ships[0].hit(2);

    expect(gameboard.areAllShipsSunk()).toBeFalsy;
  })

  test('returns true if no ships are sunk', () => {
    const gameboard = new Gameboard();
    const ships = [
      new ShipFactory([5, 3], [6, 3], [7, 3]),
      new ShipFactory([5, 5], [6, 5], [7, 5]),
    ]

    ships.forEach(ship => {
      gameboard.placeShip(ship);
    });

    expect(gameboard.areAllShipsSunk()).toBeFalsy;
  })

  // test('reports that not all ships are sunk')
});

