import { Fish } from './fish.js';
import { Game } from './game.js';
import { Graph, resizeCanvas } from './graph.js';

export class Document {
    static elements = {
        balanceE: document.getElementById('balance'),
        playerValueE: document.getElementById('player-value'),
        
        dayCounterE: document.getElementById('day-counter'),
        nextDayE: document.getElementById('next-day'),
        messagesE: document.getElementById('messages'),

        messagesLogToggleE: document.getElementById('log-toggle'),
        messagesLog: document.getElementById('messages-log'),
        graphE: document.getElementById('graph'),
    }
    static messages = [];

    static init() {
        this.initHandlers();
    }

    static initHandlers() {
        this.elements.nextDayE.addEventListener('click', () => this.clickNextDay());
        this.elements.graphE.addEventListener('click', () => this.clickCanvas());
        this.elements.messagesLogToggleE.addEventListener('click', () => this.clickLogToggle());

        document.getElementById('market-table')
            .addEventListener('click', (e) => {
                if (e.target.classList.contains('buy-button')) {
                    Game.buy(e);
                }
            });

        document.getElementById('inventory-table')
            .addEventListener('click', (e) => {
                if (e.target.classList.contains('sell-button')) {
                    Game.sell(e);
                }
            });

        document.getElementById('stats-table')
            .addEventListener('click', (e) => {
                const row = e.target.closest('.row');
                if (!row) return; // clicked outside a row
                row.classList.toggle('hide')

                const fishType = row.dataset.type
                const f = Fish.fishes[fishType];

                // flip bool
                f.drawToGraph = !f.drawToGraph;

                // redraw graph
                Graph.draw()
            });
    }

    static updateBalance() {
        this.elements.balanceE.innerText = `$${Game.balance.toFixed(2)}`;
    }

    static clickNextDay() {
        Game.handleNextDay();
        this.elements.dayCounterE.innerText = `Day ${Game.dayCount}`
        this.elements.nextDayE.innerText = `Next Day $${Game.getNextDayPrice()}`
        this.elements.balanceE.innerText = `$${Game.balance.toFixed(2)}`

        this.updateStats();
        this.updateInventory();
        this.newDayMarket();
        this.updateMarket();
        this.updatePlayerValue();


        resizeCanvas();
        Graph.draw();

        // this.message(`Inventory: ${Game.inventory.length}`);
        // this.message(`Balance: $${Game.balance.toFixed(2)}`);
        // this.message(`New Day: ${Game.dayCount}`);

        // this.message(`🛏 ${Game.dayCount} \n $${Game.balance.toFixed(2)}`);
    }

    static clickCanvas() {
        this.elements.graphE.classList.toggle('open');
        resizeCanvas();
        Graph.draw();
    }

    static clickLogToggle() {
        this.elements.messagesLogToggleE.classList.toggle('open');
        console.log('clcky logE');
    }

    static log() {
        this.message('---- Document Log ----');
        this.message(`BalanceE: ${this.elements.balanceE.innerText}`);
        this.message(`DayCounterE: ${this.elements.dayCounterE.innerText}`);
    }

    static message(msg, type = 'default') {
        const wrapperE = this.elements.messagesE;           // wrapper el

        const messageE = document.createElement('div');     // message el
        messageE.classList.add('message');

        const contentE = document.createElement('div');     // content el
        contentE.classList.add('content');
        if (type === "info") contentE.classList.add('info');
        if (type === "success") contentE.classList.add('success');
        if (type === "warning") contentE.classList.add('warning');
        contentE.innerText += msg + '\n';
        messageE.appendChild(contentE);

        // INSERT FIRST (collapsed)
        wrapperE.prepend(messageE);

        // NEXT TICK → expand
        requestAnimationFrame(() => {
            messageE.classList.add('show');
        });

        setTimeout(() => {
            messageE.classList.remove('show');
            setTimeout(() => {
                messageE.remove();
            }, 500);
        }, 3000);

        // Add to Log
        this.messages.push({ message: msg, type: type });
        // console.log(this.messages);

        // Add Element
        const el = `<div class=${type}>${msg}</div>`
        this.elements.messagesLog.innerHTML = el + this.elements.messagesLog.innerHTML;

    }

    static updatePlayerValue() {
        const el = this.elements.playerValueE;
        el.innerText = 'yo';
        console.log(el);
        
        //calc player value 
        let inventoryValue = 0;

        for (let f of Game.inventory) {
            console.log(f.price);
            inventoryValue += f.price;
        }
        
        
        const playerValue = (Game.balance + inventoryValue).toFixed(2);
        el.innerText = `$${playerValue}`
    }

    static updateInventory() {
        const tableE = document.getElementById('inventory-table');

        const header = `<div class="row"><div>Type</div><div>Weight</div><div>Price</div><div> </div></div>`;
        let rows = "";

        Game.inventory.sort((b, a) => a.price - b.price);
        Game.inventory.sort((a, b) => a.type.localeCompare(b.type));


        if (Game.inventory.length === 0) {
            tableE.innerHTML = `<div class="empty">Your inventory is empty</div>`;
            return
        }

        for (let f of Game.inventory) {
            rows += `
            <div class="row">
                <div>${f.name} ${f.img}</div>
                <div>${f.weight.toFixed(0)}</div>
                <div>${f.price.toFixed(2)}</div>
                <div class="sell-button" data-type="${f.type}" data-id="${f.id}">Sell</div>
            </div>
        `;
        }

        tableE.innerHTML = header + rows;
    }

    static newDayMarket() {
        Game.market = [];
        const keys = Object.keys(Fish.fishes);
        const shuffledKeys = keys.sort(() => Math.random() - 0.5);
        const randomAmount = Math.floor(Math.random() * keys.length) + 1;
        const marketKeys = shuffledKeys.slice(0, randomAmount);

        for (let key of marketKeys) {
            let randomAmount = Math.floor(Math.random() * 3) + 0;
            if (Math.random() > 0.85) randomAmount *= 2;

            for (let i = 0; i < randomAmount; i++) {
                const fishTemplate = Fish.fishes[key];
                const fish = fishTemplate.spawnNew()
                Game.market.push(fish);
            }
        }

    }
    static updateMarket() {
        const tableE = document.getElementById('market-table');
        const header = `<div class="row"><div>Type</div><div>Weight</div><div>Price</div><div> </div></div>`;
        let rows = "";

        if (Game.market.length === 0) {
            tableE.innerHTML = `<div class="empty">No fish for sale today. See you tomorow!</div>`;
            return
        }

        for (let f of Game.market) {
            rows += `
            <div class="row">
                <div>${f.name} ${f.img}</div>
                <div>${f.weight.toFixed(0)}</div>
                <div>${f.price.toFixed(2)}</div>
                <div class="buy-button" data-type="${f.type}" data-id=${f.id}>Buy</div>
            </div>
        `;
        }
        tableE.innerHTML = header + rows;
    }

    static updateStats() {
        const tableE = document.getElementById('stats-table');

        let rows = "";
        const fishes = Object.values(Fish.fishes)
            .sort((b, a) => b.price - a.price);

        for (let i = 0; i < fishes.length; i++) {
            const fish = fishes[i];
            const x = Game.mutations.length - 1;
            const mutation = Game.mutations[x][fish.type];
            const rowClass = fish.drawToGraph ? '' : 'hide';

            let mutationClass = '';
            if (Math.abs(mutation) > 0.2) {
                mutationClass = (mutation > 0) ? 'pos' : (mutation < 0) ? 'neg' : '';
                mutationClass += (Math.abs(mutation) > 1) ? ' double' : '';
            }

            let chartHeight = (
                (fish.price - fish.priceMin) /
                (fish.priceMax - fish.priceMin)
            ) * 100;
            chartHeight = chartHeight.toFixed(2);

            rows += `
            <div class="row ${rowClass}" data-type="${fish.type}">
                <div class="body">
                    <div class="type">${fish.type}</div>
                    <img src="${fish.imgSrc}" ></img>
                    <div class="stat-price">${fish.price.toFixed(2)}</div>
                    <div class="mutation ${mutationClass}" >${Math.abs(mutation).toFixed(2)}</div>
                </div>
                <div class="chart" style="height:${chartHeight}%"></div>
            </div>
        `;
        }

        tableE.innerHTML = rows;
    }
}