import ShipFactory from '../src/modules/ship';

test('ship hit is marked', () => {
  const coordinates = ['F1', 'F2', 'F3', 'F4'];
  const ship = new ShipFactory(coordinates); // create a ship with length 4

  ship.hit(2); // hit the third position

  expect(ship.getPosition(2)).toHaveProperty('isHit', true);
});

test('creates an extended ship that has coordinates', () => {
  const coordinates = ['F1', 'F2', 'F3', 'F4'];
  const ship = new ShipFactory(coordinates); // create a ship with length 4

  expect(ship).toHaveProperty('coordinates', coordinates);
});

test('ship is sunk when all positions are hit', () => {
  const coordinates = ['F1', 'F2', 'F3', 'F4'];
  const ship = new ShipFactory(coordinates);

  for (let i = 0; i < coordinates.length; i++) {
    ship.hit(i);
  }

  expect(ship.isSunk()).toBeTruthy();
});