import { fillBattlefieldsWithCells, addEventsToCells } from "./modules/dom/battlefield";
import { addEventsToButtons } from "./modules/dom/start_menu";
import UIGameState from "./modules/dom/game_state";
import Game from "./modules/game";
import Input from "./modules/input";

(() => {
  fillBattlefieldsWithCells();
  addEventsToButtons(receiveStart, receiveStart, receiveStart);
})();


function receiveMove(e) {
  Input.setLastMove(e.target.dataset.coordinate.split(','));
  Game.respondToMove();
}

function receiveStart() {
  Game.start();
  addEventsToCells(undefined, receiveMove);
}