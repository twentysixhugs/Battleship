import Gameboard from "./gameboard";
import PlayerManager from "./player_manager";
import { getCellsSurroundingCell } from "./helper";

class Player {
  #gameboard;

  constructor(name) {
    this.name = name;
    this.#gameboard = new Gameboard();
    PlayerManager.addPlayer(this);
  }

  get gameboard() {
    return this.#gameboard;
  }

}

class Computer extends Player {
  constructor() {
    super('Computer');
  }

  makeMove() {
    const possibleAttacks = PlayerManager.getPlayerPossibleAttacks(this);
  }

  findAdjacentCell() {

  }
}


export default Player;