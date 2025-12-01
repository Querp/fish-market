import { Game } from './game.js';
import { Fish } from './fish.js';

// add slider to change the amount of days visible (Graph.cols)

export class Graph {
    static canvas = document.getElementById('graph');
    static ctx = this.canvas.getContext("2d");
    static cols = 4; // days

    static draw() {
        const rows = 77;   // price
        const border = 10;
        const history = getFishHistories(this.cols);
        // console.log(history);

        const historyKeys = Object.keys(history);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid
        const w = this.canvas.width - border * 2;
        const h = this.canvas.height - border * 2;

        const rowHeight = (h / rows) * 0.5;

        this.ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.08)';
        this.ctx.lineWidth = 5;
        this.ctx.font = '14px system-ui';
        this.ctx.fillStyle = '#888';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = rows * 2; i >= 0; i--) {
            // const y = i * rowHeight;
            const y = border + h - i * rowHeight;
            //grid line 

            if (i % 20 === 0) {
                this.ctx.lineWidth = 2;
                this.ctx.font = '28px system-ui';
            } else if (i % 10 === 0) {
                this.ctx.font = '16px system-ui';
            } else {
                this.ctx.lineWidth = 1;
                this.ctx.font = '8px system-ui';
            }

            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(w, y);
            this.ctx.closePath();


            // if (i % 1 !== 0) continue;
            if ((i / 2) % 2.5 !== 0) continue;



            // grid marking
            const rowTxt = i * 0.5;
            this.ctx.fillStyle = '#cdcdcdff';
            this.ctx.fillText(rowTxt, w / 2, y);

            this.ctx.stroke();
        }

        // Draw Fish
        for (let i = 0; i < historyKeys.length; i++) {
            const fishType = historyKeys[i];
            const fishPrices = history[historyKeys[i]];
            const clr = Fish.fishes[fishType].color;
            const maxPrice = rows;
            const draw = Fish.fishes[fishType].drawToGraph;

            if (!draw) continue

            // --- DRAW LINE ---
            this.ctx.beginPath();
            this.ctx.strokeStyle = clr;
            this.ctx.lineWidth = 2;


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

                this.ctx.arc(x, y, 1, 0, Math.PI * 2);
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