import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorCode from '../components/ErrorCode';
import ReferrerText from '../components/ReferrerText';
import EasterEgg from '../components/EasterEgg';

const About = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
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
            <h1 className="bsod-header">About Me</h1>
            <p className="bsod-details">I'm a fullstack software engineer, award-winning game designer, and entrepreneur.</p>
            <p className="bsod-details">I have helped clients earn over $1,000,000 in revenue on digital products in emerging markets around the world.</p>
            <p className="bsod-details">My games have been featured on Disney XD, PewDiePie, and have sold over 50,000 copies.</p>
        </div>
    );
};

export default About; 