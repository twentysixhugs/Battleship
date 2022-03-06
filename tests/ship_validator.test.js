import validateShipPlacement from "../src/modules/ship_validator";
import ShipFactory from "../src/modules/ship";

describe('ship placement validation', () => {
  const ships = [
    new ShipFactory([1, 2], [1, 3], [1, 4], [1, 5]),
    new ShipFactory([3, 2], [3, 3], [3, 4]),
  ];

  test('can place ship on valid coordinates', () => {
    const ship = new ShipFactory([6, 6], [6, 7]);

    expect(validateShipPlacement(ship, ships)).toBeTruthy;
  });

  test('cannot place a ship on another ship', () => {
    const ship = new ShipFactory([1, 2], [1, 3]);

    expect(validateShipPlacement(ship, ships)).toBeFalsy;
  })

  test('cannot place a ship when crossing the ship', () => {
    const ship = new ShipFactory([2, 3], [3, 3], [4, 3]);

    expect(validateShipPlacement(ship, ships)).toBeFalsy;
  })

  test('cannot place a ship adjacent to another ship of the same length', () => {
    const ship = new ShipFactory([2, 2], [2, 3], [2, 4]);

    expect(validateShipPlacement(ship, ships)).toBeFalsy;
  })

  test('cannot place a shorter ship adjacent to a longer ship', () => {
    const ship = new ShipFactory([2, 2], [2, 3]);

    expect(validateShipPlacement(ship, ships)).toBeFalsy;
  })

  test('cannot place a longer ship adjacent to a shorter ship', () => {
    const ship = new ShipFactory([2, 2], [2, 3], [2, 4], [2, 5]);

    expect(validateShipPlacement(ship, ships)).toBeFalsy;
  })
})


