class Upgrades {
    constructor() {
        this.basePrices = {
            keyboard: 100,
            monitor: 250,
            developer: 1000,
            pc: 5000,
            dataCenter: 100000,
            ai: 250000,
            merge: 5000000
        };

        this.upgrades = {
            keyboard: 0,
            monitor: 0,
            developer: 0,
            pc: 0,
            dataCenter: 0,
            ai: 0,
            merge: 0
        };

        this.tooltips = {
            keyboard: "Earn $1 per deliverable",
            monitor: "Earn $3 per deliverable",
            developer: "Cost $10 per sprint, increases dollar per deliverable by $10",
            pc: "Cost $5 per sprint, earn $1 per deliverable per developer",
            dataCenter: "Cost $100 per sprint, lowers velocity by 5% ms, minimum 100ms",
            ai: "All revenue is now passive, cost $250 per sprint, lowers velocity by 20%, minimum 100ms",
            merge: "Absorb the competition"
        };
    }

    calculatePrice(type) {
        const basePrice = this.basePrices[type];
        const count = this.upgrades[type];
        // Calculate 5% increase for each purchase, rounded down
        const increase = Math.floor(basePrice * 0.05 * count);
        return basePrice + increase;
    }

    calculateClickValue() {
        if (this.upgrades.ai > 0) return 0;
        
        let value = 1;
        value += this.upgrades.keyboard;
        value += this.upgrades.monitor * 3;
        value += this.upgrades.developer * 10;
        value += this.upgrades.pc * this.upgrades.developer;
        return value;
    }

    calculatePassiveIncome() {
        let income = 0;
        income -= this.upgrades.developer * 10;
        income -= this.upgrades.pc * 5;
        income -= this.upgrades.dataCenter * 100;
        income += this.upgrades.ai > 0 ? this.calculateClickValue() : 0;
        return income;
    }

    calculateTickTime() {
        let time = 1000;
        // Apply 20% reduction for each AI upgrade and 5% for each data center
        time = time * Math.pow(0.8, this.upgrades.ai) * Math.pow(0.95, this.upgrades.dataCenter);
        return Math.max(Math.floor(time), 100);
    }

    canAfford(type, money) {
        return money >= this.calculatePrice(type);
    }

    getPrice(type) {
        return this.calculatePrice(type);
    }

    getTooltip(type) {
        return this.tooltips[type];
    }

    getUpgradeCount(type) {
        return this.upgrades[type];
    }

    getAllUpgrades() {
        return this.upgrades;
    }

    setUpgrades(upgrades) {
        this.upgrades = upgrades;
    }

    buyUpgrade(type) {
        if (type === 'merge') {
            // Reset all upgrades except merge
            Object.keys(this.upgrades).forEach(key => {
                if (key !== 'merge') {
                    this.upgrades[key] = 0;
                }
            });
            // Increment merge count
            this.upgrades.merge++;
        } else {
            this.upgrades[type]++;
        }
    }
}

export default Upgrades; 