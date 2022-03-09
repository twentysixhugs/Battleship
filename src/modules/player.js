import Gameboard from "./gameboard";
import PlayerManager from "./player_manager";
import { getPerpendicularCells } from "./helper";
import { stringifyElements } from "./helper";

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
      this.attackNearShip(possibleAttacks);
    } else {
      this.attackRandomCell(possibleAttacks);
    }

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

  attackRandomCell(possibleAttacks) {
    const attack = this.#getRandomCoordinates(possibleAttacks);
    PlayerManager.handleGameboardAttack(attack);
  }

  attackNearShip(possibleAttacks) {
    const attack = this.#getPotentialAttackToSinkShip(possibleAttacks);
    PlayerManager.handleGameboardAttack(attack);
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