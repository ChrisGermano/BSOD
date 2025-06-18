import React from 'react';
import { Link } from 'react-router-dom';

const Experiments = () => {
    const experiments = [
        {
            title: "Discord TCG",
            path: "https://discordtcg.com",
            description: "A Discord bot framework for building and managing a TCG system",
            isExternal: true
        },
        {
            title: "-aA-",
            path: "https://github.com/ChrisGermano/-aA-",
            description: "An esoteric programming language based on Brainfuck - half as readable but twice as fun",
            isExternal: true
        },
        {
            title: "Procrastinate",
            path: "/procrastinate",
            description: "Run your own tech shop in this classic clicker game"
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