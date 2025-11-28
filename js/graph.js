import { Game } from './game.js';
import { Fish } from './fish.js';

export class Graph {
    static canvas = document.getElementById('graph');
    static ctx = this.canvas.getContext("2d");
    static fishToDraw = {};

    static draw() {
        const cols = 200;    // days
        const rows = 77;   // price
        const border = 10;
        const history = getFishHistories(cols);
        // console.log(history);

        const historyKeys = Object.keys(history);


        const w = this.canvas.clientWidth - border * 2;
        const h = this.canvas.clientHeight - border * 2;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < historyKeys.length; i++) {
            const fishType = historyKeys[i];
            const fishPrices = history[historyKeys[i]];
            const clr = Fish.fishes[fishType].color;
            const maxPrice = rows;
            const draw = Fish.fishes[fishType].drawToGraph;

            

            // --- DRAW LINE ---
            this.ctx.beginPath();
            this.ctx.strokeStyle = clr;
            this.ctx.lineWidth = 12;
            if(!draw) {
                this.ctx.lineWidth = 1;
                // this.ctx.strokeStyle = 'hsla(0, 0%, 95%, 0.25)';
            };

            for (let j = 0; j < fishPrices.length; j++) {
                const price = fishPrices[j];
                const x = (j / (fishPrices.length - 1)) * (w + 2) + border;
                const y = h - (price / maxPrice) * h + border;

                if (j === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }

            this.ctx.stroke();

            // --- DRAW POINTS ---
            for (let j = 0; j < fishPrices.length; j++) {

                const price = fishPrices[j];
                const x = (j / (fishPrices.length - 1)) * (w + 2) + border;
                const y = h - (price / maxPrice) * h + border;

                this.ctx.beginPath();

                // --- DRAW FISH TYPE ---
                if ((j === 0 || j == fishPrices.length - 1) && draw) {
                    this.ctx.font = '24px system-ui, Arial';
                    this.ctx.textAlign = 'center';
                    const finalX = (j === 0) ? x + 4 : x - 8;
                    const finalY = y + 8;

                    const icon = Fish.fishes[fishType].img;
                    // const icon = '🐠';
                    this.ctx.fillText(icon, finalX, finalY)
                    continue
                }

                // this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = clr;
                this.ctx.fill();
                this.ctx.strokeStyle = clr;
                this.ctx.stroke();
            }
        }
    }
}






export function resizeCanvas() {
    const canvas = document.getElementById("graph");

    // set internal resolution to match CSS
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", () => {
    resizeCanvas();
    Graph.draw();
});
resizeCanvas();

function getFishHistories(maxDays = 10) {
    const fishHistory = {};

    if (Game.priceHistory.length === 0) return fishHistory;

    // get all fish types
    const types = Object.keys(Game.priceHistory[0]);

    for (let type of types) {
        fishHistory[type] = Game.priceHistory
            .slice(-maxDays)                  // last maxDays
            .map(day => day[type]);           // extract price for this fish
    }

    return fishHistory;
}