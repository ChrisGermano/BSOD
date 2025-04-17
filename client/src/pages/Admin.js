import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch projects');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/projects/${id}`);
            setProjects(projects.filter(project => project._id !== id));
        } catch (err) {
            setError('Failed to delete project');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Projects</h2>
            {projects.length === 0 ? (
                <p>No projects found</p>
            ) : (
                <div>
                    {projects.map(project => (
                        <div key={project._id}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <button onClick={() => handleDelete(project._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin; 