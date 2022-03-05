import ShipFactory from '../src/modules/ship';

test('ship hit is marked', () => {
  const ship = ShipFactory(4); // create a ship with length 4
  ship.hit(2); // hit the third position

  expect(ship.getPosition(2)).toHaveProperty('isHit', true);
});

test('ship is sunk when all positions are hit', () => {
  const len = 4;
  const ship = ShipFactory(len);

  for (let i = 0; i < len; i++) {
    ship.hit(i);
  }

  expect(ship.isSunk()).toBeTruthy();
});