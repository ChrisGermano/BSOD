import React from 'react';
import ErrorCode from '../components/ErrorCode';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <h1 className="bsod-header">404 - Page Not Found</h1>
            <p className="bsod-details">The page you are looking for does not exist.</p>
            <p className="bsod-details">Error: <ErrorCode length={2} /> : <ErrorCode length={4} /> : <ErrorCode length={8} /></p>
            <p className="bsod-details">Press <Link to="/" className="bsod-link">[Home]</Link> to return to the main page, <br/>unless you'd rather <Link to="/procrastinate" className="bsod-link">[Procrastinate]</Link></p>
        </div>
    );
}

export default NotFound; 