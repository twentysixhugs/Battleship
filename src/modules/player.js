import Gameboard from "./gameboard";
import PlayerManager from "./player_manager";
import { getPerpendicularCells } from "./helper";
import { stringifyElements } from "./helper";

class Player {
  #gameboard;

  constructor() {
    this.#gameboard = new Gameboard();
    PlayerManager.addPlayer(this);
  }

  get gameboard() {
    return this.#gameboard;
  }

  isGameOver() {
    return this.#gameboard.areAllShipsSunk();
  }
}

class Computer extends Player {
  constructor() {
    super('Computer');
    this.lastHitAtShip = null;
    this.tryingToSinkShip = false;
  }

  makeMove() {
    const possibleAttacks = PlayerManager.getPlayerPossibleAttacks(this);

    if (this.tryingToSinkShip) {
      this.currentAttack = this.#getPotentialAttackToSinkShip(possibleAttacks);
    } else {
      // this.currentAttack = this.#getRandomCoordinates(possibleAttacks);
      this.currentAttack = '1,1';
    }

    this.#attackInDOM(this.currentAttack);
    this.defineNextMove();
  }

  #getRandomCoordinates(possibleAttacks) {
    return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
  }

  #getPotentialAttackToSinkShip(possibleAttacks) {
    const potentialShipCells = getPerpendicularCells(this.lastHitAtShip); // Where there might be a ship

    possibleAttacks = stringifyElements(possibleAttacks);

    const notAttackedPotentialShipCells = potentialShipCells.filter(
      cell => possibleAttacks.includes(cell.toString())
    );

    return notAttackedPotentialShipCells[Math.floor(Math.random() * notAttackedPotentialShipCells.length)];
  }

  #attackInDOM(attack) {
    document.querySelector(`.js-cell--player[data-coordinate="${attack}"]`).click();
    console.log('computer clicked on ' + attack);
  }

  defineNextMove() {
    const enemy = PlayerManager.getNotCurrent();
    if (enemy.gameboard.lastAttackHitShip() && !enemy.gameboard.lastAttackSankShip()) {
      this.tryingToSinkShip = true;
      this.lastHitAtShip = enemy.gameboard.getLastAttack();
    } else if (enemy.gameboard.lastAttackSankShip()) {
      this.tryingToSinkShip = false;
      this.lastHitAtShip = null;
    }
  }
}


export { Player, Computer }