import {
  fillBattlefieldsWithCells,
  clearBattlefields,
} from "./modules/dom/battlefield";
import { addEventsToStartMenuButtons } from "./modules/dom/start_menu";
import { addRestartEvent } from "./modules/dom/restart";
import UIGameState from "./modules/dom/game_state";
import Game from "./modules/game";
import Input from "./modules/input";

(() => {
  initGame();
  addRestartEvent(receiveRestart);
})();

function initGame() {
  clearBattlefields();
  fillBattlefieldsWithCells();
  addEventsToStartMenuButtons(receiveStart, receiveShuffle);
}

function receiveStart() {
  Game.start();
}

function receiveRestart() {
  UIGameState.toggleResult();
  UIGameState.showRestart();
  initGame();
}

function receiveShuffle() {

}