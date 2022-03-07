import Player from '../src/modules/player';

test('Current player is changed after attack', () => {
  const player1 = new Player('1');
  const player2 = new Player('2');

  Player.setCurrent(player1);
  Player.handleGameboardAttack(player1, player2, [2, 5]);

  expect(Player.getCurrent()).toBe(player2); // Check it's the same object
});