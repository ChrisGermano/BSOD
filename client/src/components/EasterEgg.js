import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';

const EasterEgg = ({ message, triggerType = 'any', reset = false }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (reset) {
            setIsVisible(false);
        }
    }, [reset]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            switch (triggerType) {
                case 'enter':
                    if (event.key === 'Enter') {
                        setIsVisible(true);
                        ReactGA.event({
                            category: 'EasterEgg',
                            action: 'Trigger',
                            label: 'Enter Key',
                            value: 1
                        });
                    }
                    break;
                case 'alphanumeric':
                    if (/^[a-zA-Z0-9]$/.test(event.key)) {
                        setIsVisible(true);
                        ReactGA.event({
                            category: 'EasterEgg',
                            action: 'Trigger',
                            label: 'Alphanumeric Key',
                            value: 1
                        });
                    }
                    break;
                case 'ctrl-alt-del':
                    if (event.ctrlKey && event.altKey && event.key === 'Delete') {
                        setIsVisible(true);
                        ReactGA.event({
                            category: 'EasterEgg',
                            action: 'Trigger',
                            label: 'CTRL+ALT+DEL',
                            value: 1
                        });
                    }
                    break;
                case 'any':
                default:
                    setIsVisible(true);
                    ReactGA.event({
                        category: 'EasterEgg',
                        action: 'Trigger',
                        label: 'Any Key',
                        value: 1
                    });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [triggerType]);

    return (
        <div className="bsod-footer-easter-egg" style={{ display: isVisible ? 'block' : 'none' }}>
            {message}
        </div>
    );
};

export default EasterEgg; 