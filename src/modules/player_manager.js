import { Player, Computer } from "./player";

const PlayerManager = (() => {
  let _current;
  let _players = [];

  function addPlayer(player) {
    if (_players.length === 2) {
      _players = []; // no more than two players are stored
    }
    _players.push(player);
  }

  function toggleCurrent() {
    _current = getNotCurrent();
  }

  function setCurrent(player) {
    _current = player;
  }

  function getCurrent() {
    return _current;
  }

  function getPlayer() {
    return (_players[0] instanceof Player) ? _players[0] : _players[1];
  }

  function getNotCurrent() {
    return (_current === _players[0]) ? _players[1] : _players[0];
  }

  function getPlayerPossibleAttacks(player) {
    // Finds the enemy player and gets the possible attacks from their gameboard
    return _players.find(_player => _player !== player).gameboard.getPossibleAttacks();
  }

  function getLastAttackAtEnemy() {
    const enemy = getNotCurrent();
    return enemy.gameboard.getLastAttack();
  }

  function checkLastAttackAtEnemyHitShip() {
    const enemy = getNotCurrent();
    return enemy.gameboard.lastAttackHitShip();
  }

  function checkLastAttackAtEnemySankShip() {
    const enemy = getNotCurrent();
    return enemy.gameboard.lastAttackSankShip();
  }

  function handleGameboardAttack(coordinates) {
    const enemy = getNotCurrent();
    enemy.gameboard.receiveAttack(coordinates.split(','));
  }

  return {
    setCurrent,
    getCurrent,
    getPlayer,
    getNotCurrent,
    toggleCurrent,
    addPlayer,
    getPlayerPossibleAttacks,
    handleGameboardAttack,
    checkLastAttackAtEnemyHitShip,
    checkLastAttackAtEnemySankShip,
    getLastAttackAtEnemy
  }
})();

export default PlayerManager;