import Player from '../src/modules/player';
import ComputerPlayer from '../src/modules/player';

test('Current player is changed after attack', () => {
  const player1 = new Player('1');
  const player2 = new Player('2');

  Player.setCurrent(player1);
  Player.handleGameboardAttack(player1, player2, [2, 5]);

  expect(Player.getCurrent()).toBe(player2); // Check it's the same object
});

test('There are no already attacked cells in possible computer attacks', () => {
  const player = new Player('Human');
  const computer = new ComputerPlayer('Computer');

  Player.setCurrent(computer);

  Player.handleGameboardAttack(player, computer, [2, 4]);
  Player.handleGameboardAttack(player, computer, [4, 6]);
  Player.handleGameboardAttack(player, computer, [8, 9]);

  expect(computer.getPossibleAttacks()).not.toContainEqual([2, 4], [4, 6], [8, 9]);
});