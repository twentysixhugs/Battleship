import GameboardFactory from "./gameboard";

class Player {
  static #current;

  constructor(name) {
    this.gameboard = new GameboardFactory();
  }

  static setCurrent(player) {
    Player.#current = player;
  }

  static toggleCurrent(p1, p2) {
    Player.#current = (Player.#current === p1) ? p2 : p1;
  }

  static getCurrent() {
    return Player.#current;
  }

  static handleGameboardAttack(attacker, attacked, coordinates) {
    attacked.gameboard.receiveAttack(coordinates);
    Player.toggleCurrent(attacker, attacked);
  }
}

export default Player;