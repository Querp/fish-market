import { Document } from './document.js';
import { Fish } from './fish.js';
import { Tank } from './tank.js';
import { Sound } from './sound.js';

export class Game {
    static dayCount = 0;
    static balance = 100;
    static inventory = [];
    static food = 0;
    static market = [];
    static mutations = [[]];
    static priceHistory = [];
    static dailyPrice = 0;

    static init() {
        this.dayCount = 0;
        this.balance = 500;
        this.inventory = [];
        this.food = 0;
        this.market = [];
        this.mutations = [[]];      // no mutations on day 1;
        this.priceHistory = [getCurrentPrices()];
        this.dailyPrice = 0;
        this.initStockPrices(100);
    }

    static initStockPrices(amount) {
        for (let i = 0; i < amount; i++) {
            this.mutateStockPrices();
        }
    }

    static updateBalance(mutation) {
        this.balance -= mutation;
        Document.updateBalance();
    }

    static buy(e) {
        const type = e.target.dataset.type;
        const id = parseInt(e.target.dataset.id);
        const fish = this.market.find(f => f.id === id);

        if (fish.price > this.balance) {
            const diff = Math.abs(this.balance - fish.price).toFixed(2);
            Document.message(`You are $${diff} short`, 'warning')
            new Sound('warning');
            
            return
        }

        const msg = `Buying ${type} "${fish.name}" ${fish.img} at $${fish.price.toFixed(2)}`;

        this.updateBalance(fish.price);
        Document.message(msg, 'success');
        this.inventory.push(fish);
        Document.updateInventory();

        const index = this.market.findIndex(f => f.id === id);
        if (index !== -1) {
            this.market.splice(index, 1);
        } else {
            console.warn("Market item not found:", id);
            console.log(this.market);
        }
        Document.updateMarket();
        Tank.addFish(fish)
        new Sound('buy');
    }

    static sell(e) {
        const id = parseInt(e.target.dataset.id);
        const fish = this.inventory.find(f => f.id === id);

        Tank.removeFish(fish);
        Game.updateBalance(fish.price * -1);

        const index = this.inventory.findIndex(f => f.id === fish.id);
        if (index !== -1) this.inventory.splice(index, 1);
        Document.updateInventory();

        const msg = `Selling ${fish.type} "${fish.name}" ${fish.img} at $${fish.price.toFixed(2)}`;
        Document.message(msg, "info");
        new Sound('sell');
    }

    static log() {
        console.log('');
        console.log('---- Game Log ----');
        console.log(`Day: ${this.dayCount}`);
        console.log(`Balance: ${this.balance.toFixed(2)}`);
        console.log(`Inventory: ${this.inventory.length}`);
        console.log(`Market: ${this.market.length}`);
    }

    static handleNextDay() {
        this.dayCount += 1;
        this.updateNextDayPrice();
        this.mutateStockPrices();
        this.resetInventoryEatenToday();
        if (this.dayCount !== 1) new Sound('next-day');
    }

    static mutateStockPrices() {
        const newMutations = {};
        const newPrices = {};

        const fishes = Object.values(Fish.fishes)
            .sort((a, b) => b.price - a.price);

        for (let i = 0; i < fishes.length; i++) {
            const fish = fishes[i];

            const mutation = this.calcMutation(fish);

            // update fish defenition
            fish.price += mutation;

            // flip vector if price out of range             
            if (fish.price < fish.priceMin || fish.price > fish.priceMax) {
                fish.priceVector *= -0.2;
            }
            // constrain price
            fish.price = Math.max(
                fish.priceMin,
                Math.min(fish.priceMax, fish.price)
            );


            newMutations[fish.type] = mutation;
            newPrices[fish.type] = fish.price;
        }

        // update fish in inventoy
        this.mutateInventory(newMutations);


        this.mutations.push(newMutations);
        this.priceHistory.push(newPrices);
    }

    static mutateInventory(mutations) {
        for (let i = 0; i < this.inventory.length; i++) {
            const fish = this.inventory[i];
            const mutation = mutations[fish.type];
            fish.price += mutation;
        }
    }

    static calcMutation(fish) {
        const randomV = fish.priceVectorAccMax * Math.random() - fish.priceVectorAccMax * 0.5;

        fish.priceVector += randomV;

        // constrain vector to priceVectorMax
        fish.priceVector = Math.max(
            -fish.priceVectorMax,
            Math.min(fish.priceVectorMax, fish.priceVector)
        );

        return fish.priceVector
    }

    static updateNextDayPrice() {
        const basePrice = 0;
        const interval = 5;
        const increment = 0.25

        this.dailyPrice = basePrice + Math.floor(this.dayCount / interval) * increment;
        this.balance -= this.dailyPrice;
    }

    static getNextDayPrice() {
        const basePrice = 0;
        const interval = 5;
        const increment = 0.25

        return basePrice + Math.floor((this.dayCount + 1) / interval) * increment;
    }

    static feedFish(e) {
        const id = parseInt(e.target.dataset.id);
        const fish = this.inventory.find(f => f.id === id);
        if (fish.eatenToday) {
            Document.message(`"${fish.name}" is full!`, 'warning')
            return
        }

        const extraWeight = 1;
        const extraValue = extraWeight * fish.gramPrice;

        fish.foodEaten += extraWeight;
        fish.weight += extraWeight;
        fish.price = +fish.price + extraValue;
        fish.eatenToday = true;

        Document.message(`Feeding "${fish.name}" 1 gram of food. \nPrice + $${fish.gramPrice.toFixed(2)}.`);
        Document.updateInventory();
        Document.updatePlayerValue();
        new Sound('feed');
    }

    static resetInventoryEatenToday() {
        for (let f of this.inventory) {
            f.eatenToday = false;
        }
    }
}

function getCurrentPrices() {
    const result = {};
    for (let type of Object.keys(Fish.fishes)) {
        result[type] = Fish.fishes[type].price;
    }
    return result;
}