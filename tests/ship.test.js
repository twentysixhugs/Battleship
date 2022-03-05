import ShipFactory from '../src/modules/ship'

test('ship hit is marked', () => {
  const ship = ShipFactory(4); // create a ship with length 4
  ship.hit(2); // hit the third position

  expect(ship.getPosition(2)).toHaveProperty('isHit', true);
});

