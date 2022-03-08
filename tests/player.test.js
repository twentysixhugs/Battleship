import Player from '../src/modules/player';
import ComputerPlayer from '../src/modules/player';
import PlayerManager from '../src/modules/player_manager';

test('Current player is changed after attack', () => {
  const player1 = new Player('1');
  const player2 = new Player('2');

  PlayerManager.setCurrent(player1);
  PlayerManager.handleGameboardAttack(player1, player2, [2, 5]);

  expect(PlayerManager.getCurrent()).toBe(player2); // Check it's the same object
});