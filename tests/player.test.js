import { Player } from '../src/modules/player';
import { Computer } from '../src/modules/player';
import PlayerManager from '../src/modules/player_manager';
import Ship from '../src/modules/ship';

describe('Human player', () => {
  test('Current player is changed after attack NOT at ship', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');

    PlayerManager.setCurrent(player1);
    PlayerManager.handleGameboardAttack([2, 5]);

    expect(PlayerManager.getCurrent()).toBe(player2); // Check it's the same object
  });

  test('Current player is changed after attack at ship', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');
    player2.gameboard.placeShip(new Ship([2, 2], [2, 3], [2, 4], [2, 5]));

    PlayerManager.setCurrent(player1);
    PlayerManager.handleGameboardAttack([2, 5]);

    expect(PlayerManager.getCurrent()).toBe(player1); // Check it's the same object
  });
});

describe('Computer player', () => {
  test('computer stops attacking the ship once it is sunk', () => {
    const player = new Player('1');
    const computer = new Computer();

    player.gameboard.placeShip(new Ship([2, 2], [2, 3], [2, 4], [2, 5]));

    PlayerManager.setCurrent(computer);

    player.gameboard.receiveAttack([2, 5]); // hit a ship
    computer.tryingToSinkShip = true;
    computer.firstHitAtShip = [2, 5];
    player.gameboard.receiveAttack([2, 4]); // sink it
    player.gameboard.receiveAttack([2, 3]);
    player.gameboard.receiveAttack([2, 2]);

    computer.defineNextMove();

    expect(computer.tryingToSinkShip).toBeFalsy();
    expect(computer.firstHitAtShip).toBeFalsy();
  });

  test('Computer starts attacking a ship once it has hit one of ship\'s positions', () => {
    const player = new Player('1');
    const computer = new Computer();

    PlayerManager.setCurrent(computer);

    player.gameboard.placeShip(new Ship([2, 2], [2, 3], [2, 4], [2, 5]));
    player.gameboard.receiveAttack([2, 5]);

    computer.defineNextMove();

    expect(computer.tryingToSinkShip).toBeTruthy();
    expect(computer.firstHitAtShip).toBeTruthy();
  });
  test('When trying to sink a ship, computer does not attack the surrounding and same cells if they are already attacked', () => {
    const player = new Player('1');
    const computer = new Computer();

    player.gameboard.placeShip(new Ship([2, 2], [2, 3], [2, 4], [2, 5]));

    PlayerManager.setCurrent(computer);

    player.gameboard.receiveAttack([2, 5]); // hit a ship
    computer.tryingToSinkShip = true;
    computer.firstHitAtShip = [2, 5];

    player.gameboard.receiveAttack([2, 6]); // hit nearby empty cells
    player.gameboard.receiveAttack([1, 5]);
    player.gameboard.receiveAttack([3, 5]);

    computer.makeMove();

    const validAttacks = [
      [2, 4],
      [2, 3],
      [2, 2]
    ];

    expect(validAttacks).toContainEqual(player.gameboard.getLastAttack());
  });
});