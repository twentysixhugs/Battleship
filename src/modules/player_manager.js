const PlayerManager = (() => {
  let _current;
  let _players = [];

  function addPlayer(player) {
    if (_players.length === 2) {
      players = []; // no more than two players are stored
    }
    _players.push(player);
  }

  function _toggleCurrent() {
    _current = (_current === _players[0]) ? _players[1] : _players[0];
  }

  function setCurrent(player) {
    _current = player;
  }

  function getCurrent() {
    return _current;
  }

  function getPlayerPossibleAttacks(player) {
    return _players.find(_player => _player === player).gameboard.getPossibleAttacks();
  }

  function handleGameboardAttack(attacker, attacked, coordinates) {
    attacked.gameboard.receiveAttack(coordinates);
    _toggleCurrent(attacker, attacked);
  }

  return {
    setCurrent,
    getCurrent,
    handleGameboardAttack,
    addPlayer,
    getPlayerPossibleAttacks
  }
})();

export default PlayerManager;