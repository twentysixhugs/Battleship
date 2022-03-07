import GameboardFactory from "./gameboard";

class Player {
  #isCurrent;
  constructor(name) {
    this.#isCurrent = false;
    this.gameboard = new GameboardFactory();
  }

  makeCurrent() {
    this.#isCurrent = true;
  }

  get isCurrent() {
    return this.#isCurrent;
  }

  static handleGameboardAttack(attacker, attacked, coordinates) {
    attacked.gameboard.receiveAttack(coordinates);
  }
}

export default Player;