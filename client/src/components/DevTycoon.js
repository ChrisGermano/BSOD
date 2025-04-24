import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Upgrades from './Upgrades';

const DevTycoon = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['chrisSimulator']);
    const [money, setMoney] = useState(cookies.chrisSimulator?.money || 0);
    const [linesOfCode, setLinesOfCode] = useState(cookies.chrisSimulator?.linesOfCode || 0);
    const [upgrades, setUpgrades] = useState(new Upgrades());
    const [floatingMoney, setFloatingMoney] = useState([]);
    const [floatingPhrases, setFloatingPhrases] = useState([]);
    const [tickTime, setTickTime] = useState(2000);
    const [tickCount, setTickCount] = useState(0);
    const [isSad, setIsSad] = useState(false);

    const businessPhrases = [
        "Let's take this offline",
        "Let's circle back",
        "Scope creep",
        "Do the needful",
        "What's your capacity?",
        "This needs refinement"
    ];

    // Initialize upgrades from cookies
    useEffect(() => {
        if (cookies.chrisSimulator?.upgrades) {
            upgrades.setUpgrades(cookies.chrisSimulator.upgrades);
        }
    }, [cookies.chrisSimulator?.upgrades, upgrades]);

    const handleComputerClick = (e) => {
        const clickValue = upgrades.calculateClickValue();
        if (clickValue > 0) {
            setMoney(prev => prev + clickValue);
            
            const newMoney = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
                value: clickValue
            };
            setFloatingMoney(prev => [...prev, newMoney]);

            setTimeout(() => {
                setFloatingMoney(prev => prev.filter(m => m.id !== newMoney.id));
            }, 500);
        }
    };

    const buyUpgrade = (type) => {
        if (upgrades.canAfford(type, money)) {
            if (type === 'merge') {
                setMoney(0);
                setTickTime(1000);
            }
            setMoney(prev => prev - upgrades.getPrice(type));
            upgrades.buyUpgrade(type);
        }
    };

    // Game loop
    useEffect(() => {
        const interval = setInterval(() => {
            const passiveIncome = upgrades.calculatePassiveIncome();
            if (passiveIncome > 0) {
                setMoney(prev => prev + passiveIncome);
                
                // Create floating money for passive income
                const newMoney = {
                    id: Date.now(),
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    value: passiveIncome
                };
                setFloatingMoney(prev => [...prev, newMoney]);

                setTimeout(() => {
                    setFloatingMoney(prev => prev.filter(m => m.id !== newMoney.id));
                }, 500);
            } else if (passiveIncome < 0) {
                setMoney(prev => prev + passiveIncome);
            }

            // Update tick time
            setTickTime(upgrades.calculateTickTime());

            // Random business phrase
            setTickCount(prev => {
                const newCount = prev + 1;
                if (newCount >= Math.floor(Math.random() * 10) + 10) { // Random between 10-20
                    const phrase = businessPhrases[Math.floor(Math.random() * businessPhrases.length)];
                    const newPhrase = {
                        id: Date.now(),
                        text: phrase,
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight
                    };
                    setFloatingPhrases(prev => [...prev, newPhrase]);
                    setTimeout(() => {
                        setFloatingPhrases(prev => prev.filter(p => p.id !== newPhrase.id));
                    }, 2000);
                    return 0;
                }
                return newCount;
            });

            // Save game state
            setCookie('chrisSimulator', {
                money,
                linesOfCode,
                upgrades: upgrades.getAllUpgrades()
            }, { path: '/', maxAge: 31536000 });
        }, tickTime);

        return () => clearInterval(interval);
    }, [money, linesOfCode, upgrades, tickTime, setCookie]);

    const handleReset = () => {
        removeCookie('chrisSimulator');
        setMoney(0);
        setLinesOfCode(0);
        setTickTime(2000);
        setUpgrades(new Upgrades());
        setFloatingMoney([]);
        setFloatingPhrases([]);
        setTickCount(0);
        setIsSad(false);
    };

    // Check for sad state
    useEffect(() => {
        if (money < -100000 && !isSad) {
            setIsSad(true);
        } else if (money >= -100000 && isSad) {
            setIsSad(false);
        }
    }, [money, isSad]);

    return (
        <div className="dev-tycoon">
            <div className="ascii-computer" onClick={handleComputerClick}>
                <pre>
{isSad ? `    _________________
   |  ___________  |
   | |           | |
   | |   ಠ   ಥ  | |
   | |           | |
   | |     ∩     | |
   | |___________| |
   |_______________|
        |  |  |
     ___|  |  |___
    /_____________\\
   /               \\
  /                 \\
 /                   \\
/                     \\` : `    _________________
   |  ___________  |
   | |           | |
   | |   o   O   | |
   | |           | |
   | |   \\___/   | |
   | |___________| |
   |_______________|
        |  |  |
     ___|  |  |___
    /_____________\\
   /               \\
  /                 \\
 /                   \\
/                     \\`}
                </pre>
            </div>
            {floatingMoney.map(money => (
                <div 
                    key={money.id}
                    className="floating-money"
                    style={{
                        left: money.x,
                        top: money.y
                    }}
                >
                    ${money.value}
                </div>
            ))}
            {floatingPhrases.map(phrase => (
                <div 
                    key={phrase.id}
                    className="floating-phrase"
                    style={{
                        left: phrase.x,
                        top: phrase.y
                    }}
                >
                    {phrase.text}
                </div>
            ))}
            <div className="stats">
                <h2>💰 ${money.toLocaleString()}</h2>
                <p>⏱️ Velocity: {tickTime}ms</p>
                <p>💵 Per Deliverable: ${upgrades.calculateClickValue()}</p>
                <p>📈 Per Sprint: ${upgrades.calculatePassiveIncome()}</p>
                <p>🏢 Mergers: {upgrades.getUpgradeCount('merge')}</p>
            </div>
            
            <div className="shop">
                <h3>Hire & Upgrade</h3>
                {Object.keys(upgrades.basePrices)
                    .filter(type => type !== 'merge')
                    .map(type => (
                        <div key={type} className="upgrade-item">
                            <button 
                                className="upgrade-button"
                                onClick={() => buyUpgrade(type)} 
                                disabled={!upgrades.canAfford(type, money)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)} (${upgrades.getPrice(type).toLocaleString()})
                                {upgrades.getUpgradeCount(type) !== null && (
                                    <span className="upgrade-count">x{upgrades.getUpgradeCount(type)}</span>
                                )}
                            </button>
                            <button className="info-button">i</button>
                            <div className="info-tooltip">{upgrades.getTooltip(type)}</div>
                        </div>
                    ))}
                <div className="upgrade-item">
                    <button 
                        className="upgrade-button"
                        onClick={() => buyUpgrade('merge')} 
                        disabled={!upgrades.canAfford('merge', money)}
                    >
                        Merge
                    </button>
                    <button className="info-button">i</button>
                    <div className="info-tooltip">{upgrades.getTooltip('merge')}</div>
                </div>
                {isSad && (
                    <div className="upgrade-item">
                        <button 
                            className="upgrade-button reset-button"
                            onClick={handleReset}
                        >
                            Reset Game
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DevTycoon; 