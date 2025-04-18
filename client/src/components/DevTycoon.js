import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const DevTycoon = () => {
    const [cookies, setCookie] = useCookies(['devtycoon']);
    const [money, setMoney] = useState(cookies.devtycoon?.money || 0);
    const [linesOfCode, setLinesOfCode] = useState(cookies.devtycoon?.linesOfCode || 0);
    const [devs, setDevs] = useState(cookies.devtycoon?.devs || 0);
    const [hardware, setHardware] = useState(cookies.devtycoon?.hardware || {
        keyboard: 0,
        monitor: 0,
        cpu: 0,
        gpu: 0
    });
    const [projects, setProjects] = useState(cookies.devtycoon?.projects || {
        website: 0,
        app: 0,
        game: 0
    });
    const [floatingMoney, setFloatingMoney] = useState([]);

    const prices = {
        dev: 100,
        keyboard: 50,
        monitor: 200,
        cpu: 500,
        gpu: 1000
    };

    const projectValues = {
        website: 10,
        app: 25,
        game: 50
    };

    const handleComputerClick = (e) => {
        setMoney(prev => prev + 1);
        
        // Create a new floating money element
        const newMoney = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY
        };
        setFloatingMoney(prev => [...prev, newMoney]);

        // Remove the floating money after animation
        setTimeout(() => {
            setFloatingMoney(prev => prev.filter(m => m.id !== newMoney.id));
        }, 500);
    };

    // Game loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Generate lines of code based on devs and hardware
            const baseLines = devs * (1 + hardware.keyboard * 0.1 + hardware.monitor * 0.2 + hardware.cpu * 0.3 + hardware.gpu * 0.4);
            const newLines = Math.floor(baseLines);
            setLinesOfCode(prev => prev + newLines);

            // Convert lines of code to projects
            const newProjects = {
                website: Math.floor(linesOfCode / 100),
                app: Math.floor(linesOfCode / 500),
                game: Math.floor(linesOfCode / 1000)
            };
            setProjects(newProjects);

            // Calculate income
            const income = 
                newProjects.website * projectValues.website +
                newProjects.app * projectValues.app +
                newProjects.game * projectValues.game;
            setMoney(prev => prev + income);

            // Save game state
            setCookie('devtycoon', {
                money,
                linesOfCode,
                devs,
                hardware,
                projects: newProjects
            }, { path: '/', maxAge: 31536000 }); // 1 year expiry
        }, 1000);

        return () => clearInterval(interval);
    }, [devs, hardware, linesOfCode, money, setCookie]);

    const buyDev = () => {
        if (money >= prices.dev) {
            setMoney(prev => prev - prices.dev);
            setDevs(prev => prev + 1);
        }
    };

    const buyHardware = (type) => {
        if (money >= prices[type]) {
            setMoney(prev => prev - prices[type]);
            setHardware(prev => ({
                ...prev,
                [type]: prev[type] + 1
            }));
        }
    };

    return (
        <div className="dev-tycoon">
            <div className="ascii-computer" onClick={handleComputerClick}>
                <pre>
{`    _________________
   |  ___________  |
   | |           | |
   | |   0   0   | |
   | |     -     | |
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
                    $1
                </div>
            ))}
            <div className="stats">
                <h2>💰 ${money.toLocaleString()}</h2>
                <p>👨‍💻 Developers: {devs}</p>
                <p>📝 Lines of Code: {linesOfCode.toLocaleString()}</p>
            </div>
            
            <div className="projects">
                <h3>Completed Projects</h3>
                <p>🌐 Websites: {projects.website}</p>
                <p>📱 Apps: {projects.app}</p>
                <p>🎮 Games: {projects.game}</p>
            </div>

            <div className="shop">
                <h3>Hire & Upgrade</h3>
                <button onClick={buyDev} disabled={money < prices.dev}>
                    Hire Developer (${prices.dev})
                </button>
                <button onClick={() => buyHardware('keyboard')} disabled={money < prices.keyboard}>
                    Upgrade Keyboard (${prices.keyboard})
                </button>
                <button onClick={() => buyHardware('monitor')} disabled={money < prices.monitor}>
                    Upgrade Monitor (${prices.monitor})
                </button>
                <button onClick={() => buyHardware('cpu')} disabled={money < prices.cpu}>
                    Upgrade CPU (${prices.cpu})
                </button>
                <button onClick={() => buyHardware('gpu')} disabled={money < prices.gpu}>
                    Upgrade GPU (${prices.gpu})
                </button>
            </div>
        </div>
    );
};

export default DevTycoon; 