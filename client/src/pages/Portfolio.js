import React, { useState, useEffect } from 'react';

const Portfolio = () => {
    return (
        <div>
            <h1 className="bsod-header">Portfolio</h1>
            <p className="bsod-details">
                <a className="bsod-link" href="">[ Gmoot Trade ]</a> - Capitalize on intra-day volatility of the Solana cryptocurrency by swapping SOL/USDC based on traditional indicators.
            </p>
            <p className="bsod-details">
                <a className="bsod-link" href="">[ NRFI ]</a> - Efficiently use MLB data to determine if there will be a run in the first inning of any game, updated daily.
            </p>
            <p className="bsod-details">
                <a className="bsod-link" href="">[ Mustdashe ]</a> - Frantically rush to put mustaches on everyone and everything. Made in 24 hours for a game jam and featured on major YouTube and TV channels.
            </p>
        </div>
    );
};

export default Portfolio; 