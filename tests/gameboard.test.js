import GameboardFactory from '../src/modules/gameboard';
import ShipFactory from '../src/modules/ship';


describe('new ship creation', () => {
  const gameboard = new GameboardFactory();
  const coordinates = ['F5', 'F6', 'F7', 'F8'];
  const ship = gameboard.Ship(coordinates);

  test('creates an extended ship that inherits from ShipFactory', () => {
    expect(ship).toBeInstanceOf(ShipFactory);
  });

  test('creates an extended ship that has coordinates', () => {
    expect(ship).toHaveProperty('coordinates', coordinates);
  });
})



