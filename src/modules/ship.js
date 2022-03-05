function ShipFactory(length) {
  const _positions = _createPositions(length);

  this.getPosition = function (position) {
    return _positions[position];
  }

  this.isSunk = function () {
    if (_positions.every(position => position.isHit)) {
      return true;
    }

    return false;
  }

  /* Hit one of ship's positions */
  this.hit = function (position) {
    _positions[position].isHit = true;
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