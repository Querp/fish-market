import { Game } from "./game.js";

export class Tank {
    static tankEl;
    static fishEl = []

    static init() {
        this.tankEl = document.getElementById('tank');
    }

    static update() {
        this.moveFish();
    }

    static moveFish() {
        for (let fish of Game.inventory) {
            // skip movement 70%
            // if (Math.random() > 0.3) continue

            const fishE = this.fishEl.find(f => Number(f.dataset.id) === fish.id);

            if (!fishE) {
                console.warn("Missing fish element:", fish.id, this.fishEl);
                continue;
            }

            const titleE = fishE.querySelector('.title');
            const imgE = fishE.querySelector('img');

            // update vel
            const speed = fish.moveSpeed * 2;
            fish.vel.x += Math.random() * speed - speed / 2;
            fish.vel.y += Math.random() * speed - speed / 2;

            // constrain vel

            // unique fish modifiers
            if (fish.type === 'Bluefin' && fish.pos.y > 25) {
                fish.vel.y -= 1.5;
            };
            if (fish.type === 'Abelone' && fish.pos.y < 98) fish.vel.y = 5;
            if (fish.type === 'Sunfish' && fish.pos.y < 80) {
                fish.vel.y = 1;
            };

            // update pos
            fish.pos.x += fish.vel.x
            fish.pos.y += fish.vel.y

            // constrain pos
            const offset = 2;
            if (fish.pos.x > 100 - offset) {
                fish.pos.x = 100 - offset;
                fish.vel.x *= -0.5;
            }
            if (fish.pos.x < offset) {
                fish.pos.x = offset;
                fish.vel.x *= -0.5;

            }
            if (fish.pos.y > 100 - offset) {
                fish.pos.y = 100 - offset;
                fish.vel.y = 0;
            }
            if (fish.pos.y < offset) {
                fish.pos.y = offset;
                fish.vel.y = 0;
            }

            // move DOM element
            fishE.style.setProperty('--x', `${fish.pos.x}%`);
            fishE.style.setProperty('--y', `${fish.pos.y}%`);

            // add vel text to DOM title
            // titleE.textContent = `x:${fish.vel.x.toFixed(0)} y:${fish.vel.y.toFixed(0)}`;

            // add datatype for rotation
            const rotation = fish.vel.x >= 0 ? 0 : 180; // this is not accurate
            imgE.style.setProperty('--rotate-y', `${rotation}deg`);

            // only apply rotation at min speed?
            if (Math.abs(fish.vel.x) > 0.5) { }
        }

    }

    static addFish(fish) {
        console.log(fish.pos);

        const el = document.createElement('div');
        el.classList.add('fish');
        el.id = `tank-fish-${fish.id}`;
        el.dataset.id = fish.id;
        el.dataset.type = fish.type;

        const titleEl = document.createElement('div');
        titleEl.textContent = fish.name;
        titleEl.classList.add('title');

        const imgEl = document.createElement('img');
        imgEl.src = `img/fish/${fish.type}.webp`

        el.appendChild(imgEl)
        el.appendChild(titleEl)
        this.fishEl.push(el);
        this.tankEl.appendChild(el)
    }

    static removeFish(fish) {
        const index = this.fishEl.findIndex(f => Number(f.dataset.id) === fish.id);

        if (index !== -1) {
            this.fishEl[index].remove();
            this.fishEl.splice(index, 1)
        }
    }
}