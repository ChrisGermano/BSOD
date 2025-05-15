import React from 'react';
import { Link } from 'react-router-dom';

const Experiments = () => {
    const experiments = [
        {
            title: "Discord TCG",
            path: "https://github.com/ChrisGermano/DiscordTCG",
            description: "A Discord bot framework for building and managing a TCG system",
            isExternal: true
        },
        {
            title: "Procrastinate",
            path: "/procrastinate",
            description: "Run your own tech shop in this classic clicker game"
        },
        {
            title: "Grafix",
            path: "/grafix",
            description: "Just some art"
        },
        {
            title: "Pope Wars",
            path: "/pope-wars",
            description: "The Pope just died and you need to escape the Vatican with as much money as possible"
        }
    ];

    return (
        <div>
            <h1 className="bsod-header">Experiments</h1>
            <p className="bsod-details">A collection of experimental features and side projects.</p>
            
            <div className="experiments-list">
                {experiments.map((experiment, index) => (
                    <div key={index} className="experiment-item">
                        {experiment.isExternal ? (
                            <a href={experiment.path} className="bsod-link" target="_blank" rel="noopener noreferrer">
                                <h2 className="bsod-subheader">{experiment.title}</h2>
                            </a>
                        ) : (
                            <Link to={experiment.path} className="bsod-link">
                                <h2 className="bsod-subheader">{experiment.title}</h2>
                            </Link>
                        )}
                        <p className="bsod-details">{experiment.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experiments; 