import { Graph } from './graph.js';
import { Fish } from './fish.js';
import { Game } from './game.js';
import { Document } from './document.js';

Document.init();
Fish.init();
Game.init();
Document.clickNextDay();


for (let i = 0; i < 0; i++) {
    Document.clickNextDay();
}

setInterval(() => {
    Fish.update();
}, 100);

// Graph.log()
// Fish.log()
// Game.log();
// Document.log();

