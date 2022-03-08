class Computer {
  #gameboard;

  constructor() {
    this.name = 'Computer';
    this.#gameboard = new Gameboard();
  }

  get gameboard() {
    return this.#gameboard;
  }

  makeMove() {

  }
}