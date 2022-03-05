function ShipFactory(length) {
  const _positions = _createPositions(length);

  function getPosition(position) {
    return _positions[position];
  }

  function isSunk() {
    if (_positions.every(position => position.isHit)) {
      return true;
    }

    return false;
  }

  /* Hit one of ship's positions */
  function hit(position) {
    _positions[position].isHit = true;
  }

  return {
    getPosition,
    isSunk,
    hit,
  }
}

export default ShipFactory;


function _createPositions(length) {
  class Position {
    constructor() {
      this.isHit = false;
    }
  }

  const positions = new Array(length);
  positions.fill(new Position());

  return positions;
}