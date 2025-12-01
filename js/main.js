import { Graph } from './graph.js';
import { Fish } from './fish.js';
import { Game } from './game.js';
import { Document } from './document.js';
import { Tank } from './tank.js';

Document.init();
Fish.init();
Game.init();
Tank.init();
Document.clickNextDay();


for (let i = 0; i < 0; i++) {
    Document.clickNextDay();
}



setInterval(() => {
    Tank.update();
}, 300);




// Graph.log()
// Fish.log()
// Game.log();
// Document.log();

