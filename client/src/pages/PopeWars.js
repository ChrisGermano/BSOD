import React, { useReducer, useEffect } from 'react';

const initialState = {
    money: 2000,
    day: 1,
    inventory: {},
    prices: {},
    gameOver: false
};

const items = {
    holyWater: { name: "Holy Water", min: 5, max: 15 },
    communionWafers: { name: "Communion Wafer", min: 10, max: 25 },
    rosary: { name: "Rosary", min: 20, max: 45 },
    prayerBook: { name: "Bible", min: 30, max: 60 },
    incense: { name: "Incense", min: 40, max: 80 },
    altarBoy: { name: "Altar Boy", min: 100, max: 200 },
    relic: { name: "Relic", min: 200, max: 400 },
    cardinal: { name: "Myrrh", min: 500, max: 1000 },
    pope: { name: "Frankincense", min: 1000, max: 2000 },
    saint: { name: "Gold", min: 2000, max: 4000 }
};

const generatePrices = () => {
    const newPrices = {};
    Object.entries(items).forEach(([key, item]) => {
        newPrices[key] = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
    });
    return newPrices;
};

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'BUY_ITEM':
            const buyPrice = state.prices[action.itemKey];
            if (state.money >= buyPrice) {
                return {
                    ...state,
                    money: state.money - buyPrice,
                    inventory: {
                        ...state.inventory,
                        [action.itemKey]: (state.inventory[action.itemKey] || 0) + 1
                    }
                };
            }
            return state;

        case 'SELL_ITEM':
            if (state.inventory[action.itemKey] > 0) {
                const sellPrice = state.prices[action.itemKey];
                return {
                    ...state,
                    money: state.money + sellPrice,
                    inventory: {
                        ...state.inventory,
                        [action.itemKey]: state.inventory[action.itemKey] - 1
                    }
                };
            }
            return state;

        case 'BUY_MAX':
            const price = state.prices[action.itemKey];
            const maxQuantity = Math.floor(state.money / price);
            if (maxQuantity > 0) {
                return {
                    ...state,
                    money: state.money - (price * maxQuantity),
                    inventory: {
                        ...state.inventory,
                        [action.itemKey]: (state.inventory[action.itemKey] || 0) + maxQuantity
                    }
                };
            }
            return state;

        case 'SELL_MAX':
            if (state.inventory[action.itemKey] > 0) {
                const total = state.prices[action.itemKey] * state.inventory[action.itemKey];
                return {
                    ...state,
                    money: state.money + total,
                    inventory: {
                        ...state.inventory,
                        [action.itemKey]: 0
                    }
                };
            }
            return state;

        case 'NEXT_DAY':
            if (state.day >= 30) {
                return {
                    ...state,
                    gameOver: true
                };
            }
            return {
                ...state,
                day: state.day + 1,
                prices: generatePrices()
            };

        case 'RESET_GAME':
            return {
                ...initialState,
                prices: generatePrices()
            };

        default:
            return state;
    }
};

const PopeWars = () => {
    const [state, dispatch] = useReducer(gameReducer, {
        ...initialState,
        prices: generatePrices()
    });

    const { money, day, inventory, prices, gameOver } = state;

    return (
        <div>
            <h1 className="bsod-header">Pope Wars</h1>
            <p className="bsod-details">The Pope just died! You have 30 days to profit off of his stuff and escape the Vatican.</p>
            
            <div style={{ 
                margin: '5px auto', 
                minWidth: '400px',
                padding: '0 10px'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '3px',
                    fontSize: '16px'
                }}>
                    <span className="bsod-details">Day {day}/30</span>
                    <span className="bsod-details">${money}</span>
                </div>

                {gameOver ? (
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="bsod-subheader" style={{ fontSize: '20px' }}>Game Over!</h2>
                        <p className="bsod-details" style={{ fontSize: '16px' }}>
                            You escaped the Vatican with ${money} dollars, leaving {Object.entries(inventory)
                                .filter(([_, count]) => count > 0)
                                .map(([key, count]) => `${count} ${items[key].name}${count > 1 ? 's' : ''}`)
                                .join(', ')} behind!
                        </p>
                        <button 
                            className="bsod-button" 
                            onClick={() => dispatch({ type: 'RESET_GAME' })}
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <>
                        <button 
                            className="bsod-button" 
                            onClick={() => dispatch({ type: 'NEXT_DAY' })}
                            style={{ 
                                width: '100%',
                                marginBottom: '3px',
                                fontSize: '16px',
                                padding: '2px'
                            }}
                        >
                            Next Day
                        </button>

                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '5px',
                            marginBottom: '3px'
                        }}>
                            <div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '2px'
                                }}>
                                    <h3 className="bsod-subheader" style={{ fontSize: '16px', margin: 0 }}>Inventory</h3>
                                </div>
                                {Object.entries(inventory).map(([key, count]) => (
                                    count > 0 && (
                                        <div key={key} style={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '14px',
                                            marginBottom: '1px'
                                        }}>
                                            <span className="bsod-details">
                                                {items[key].name} ({count}) - ${prices[key]}
                                            </span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                <button 
                                                    className="bsod-button" 
                                                    onClick={() => dispatch({ type: 'SELL_ITEM', itemKey: key })}
                                                    style={{ padding: '1px 4px', fontSize: '14px' }}
                                                >
                                                    Sell 1
                                                </button>
                                                <button 
                                                    className="bsod-button" 
                                                    onClick={() => dispatch({ type: 'SELL_MAX', itemKey: key })}
                                                    style={{ padding: '1px 4px', fontSize: '14px' }}
                                                >
                                                    Sell Max
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            <div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '2px'
                                }}>
                                    <h3 className="bsod-subheader" style={{ fontSize: '16px', margin: 0 }}>Market</h3>
                                </div>
                                {Object.entries(items).map(([key, item]) => (
                                    <div key={key} style={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        marginBottom: '1px'
                                    }}>
                                        <span className="bsod-details">
                                            {item.name} - ${prices[key]}
                                        </span>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            <button 
                                                className="bsod-button" 
                                                onClick={() => dispatch({ type: 'BUY_ITEM', itemKey: key })}
                                                style={{ padding: '1px 4px', fontSize: '14px' }}
                                            >
                                                Buy 1
                                            </button>
                                            <button 
                                                className="bsod-button" 
                                                onClick={() => dispatch({ type: 'BUY_MAX', itemKey: key })}
                                                style={{ padding: '1px 4px', fontSize: '14px' }}
                                            >
                                                Buy Max
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PopeWars; 