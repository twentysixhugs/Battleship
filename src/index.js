import {
  fillBattlefieldsWithCells,
  clearBattlefields,
} from "./modules/dom/battlefield";
import { addEventsToButtons } from "./modules/dom/start_menu";
import { addRestartEvent } from "./modules/dom/restart";
import UIGameState from "./modules/dom/game_state";
import Game from "./modules/game";
import Input from "./modules/input";

(() => {
  fillBattlefieldsWithCells();
  addEventsToButtons(receiveStart);
  addRestartEvent(receiveRestart);
})();


function receiveStart() {
  Game.start();
}

function receiveRestart() {
  clearBattlefields();
  fillBattlefieldsWithCells();
  addEventsToButtons(receiveStart);

  UIGameState.toggleResult();
  UIGameState.showRestart();
}