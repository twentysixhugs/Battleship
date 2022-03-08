const PlayerManager = (() => {
  let _current;

  function _toggleCurrent(p1, p2) {
    _current = (_current === p1) ? p2 : p1;
  }

  function setCurrent(player) {
    _current = player;
  }

  function getCurrent() {
    return _current;
  }

  function handleGameboardAttack(attacker, attacked, coordinates) {
    attacked.gameboard.receiveAttack(coordinates);
    _toggleCurrent(attacker, attacked);
  }

  return {
    setCurrent,
    getCurrent,
    handleGameboardAttack,
  }
})();

export default PlayerManager;