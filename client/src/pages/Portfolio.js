import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorCode from '../components/ErrorCode';
import ReferrerText from '../components/ReferrerText';
import EasterEgg from '../components/EasterEgg';

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://api.chrisgermano.dev/api/portfolio');
                setProjects(response.data);
            } catch (err) {
                setError('Failed to load projects');
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1 className="bsod-header">Portfolio</h1>
            {loading ? (
                <p className="bsod-details">Loading projects...</p>
            ) : error ? (
                <p className="bsod-details">Error loading projects. Please try again later.</p>
            ) : projects.length > 0 ? (
                projects.map(project => (
                    <p key={project._id} className="bsod-details">
                        {project.title}: {project.description}
                    </p>
                ))
            ) : (
                <p className="bsod-details">No projects found. Check out my LinkedIn for more information.</p>
            )}
        </div>
    );
};

export default Portfolio; 