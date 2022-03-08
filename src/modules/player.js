import Gameboard from "./gameboard";

class Player {
  #gameboard;

  constructor(name) {
    this.name = name;
    this.#gameboard = new Gameboard();
  }

  get gameboard() {
    return this.#gameboard;
  }

}


export default Player;