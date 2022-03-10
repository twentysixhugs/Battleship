import { convertElementsToNumbers } from "./helper";

const Input = (() => {
  let _lastMove;

  function setLastMove(coordinate) {
    _lastMove = convertElementsToNumbers(coordinate);
    console.log(_lastMove);
  }

  function getLastMove() {
    return _lastMove;
  }

  return {
    setLastMove,
    getLastMove
  }
})();

export default Input;