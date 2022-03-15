import {
  fillBattlefieldsWithCells,
  clearBattlefields,
  showPlayerShips,
} from "./modules/dom/battlefield";
import { addEventsToStartMenuButtons } from "./modules/dom/start_menu";
import { addRestartEvent } from "./modules/dom/restart";

import UIGameState from "./modules/dom/game_state";
import Game from "./modules/game";
import Input from "./modules/utils/input";
import generateShipsForBothPlayers from "./modules/random_ships";
import initDragAndDrop from "./modules/dom/drag_and_drop";

(() => {
  initGame();
  addRestartEvent(receiveRestart);
})();

function initGame() {
  Input.clear();
  clearBattlefields();
  fillBattlefieldsWithCells();
  generateShipsForBothPlayers();
  showPlayerShips();
  initDragAndDrop();
  addEventsToStartMenuButtons(receiveStart, receiveRandom);
}

function receiveStart() {
  Game.start();
}

function receiveRestart() {
  UIGameState.toggleResult();
  UIGameState.showRestart();
  initGame();
}

function receiveRandom() {
  Input.clear();
  clearBattlefields();
  fillBattlefieldsWithCells();
  generateShipsForBothPlayers();
  showPlayerShips();
  initDragAndDrop();
}