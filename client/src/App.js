import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';
import Admin from './pages/Admin';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Procrastinate from './pages/Procrastinate';
import ErrorCode from './components/ErrorCode';
import ReferrerText from './components/ReferrerText';
import EasterEgg from './components/EasterEgg';
import ReactGA from 'react-ga4';

// Configure axios defaults
const API_URL = process.env.REACT_APP_API_URL || 'https://api.chrisgermano.dev';
console.log('API URL:', API_URL);

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for logging
axios.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Is the server running on', API_URL, '?');
        }
        console.error('Response error:', error.message);
        return Promise.reject(error);
    }
);

// Initialize Google Analytics
ReactGA.initialize('G-2330ZL3JF2');

// Create a component to handle page tracking
const PageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }, [location]);

    return null;
};

function App() {
    const [resetEasterEggs, setResetEasterEggs] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);

    useEffect(() => {
        setResetEasterEggs(true);
        const timer = setTimeout(() => setResetEasterEggs(false), 100);
        return () => clearTimeout(timer);
    }, [window.location.pathname]);

    // Handle admin access
    const handleAdminAccess = (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            setShowAdmin(true);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleAdminAccess);
        return () => window.removeEventListener('keydown', handleAdminAccess);
    }, []);

    return (
        <CookiesProvider>
            <Router>
                <PageTracker />
                <div className="bsod-container">
                    <nav>
                        <Link to="/" className="bsod-button">[Home]</Link>
                        <Link to="/portfolio" className="bsod-button">[Portfolio]</Link>
                        <Link to="/about" className="bsod-button">[About]</Link>
                        <Link to="/procrastinate" className="bsod-button">[Procrastinate]</Link>
                    </nav>
                    <div className="bsod-content">
                        <Routes>
                            <Route path="/" element={
                                <div>
                                    <h1 className="bsod-header">Chris Germano</h1>
                                    <p className="bsod-details">An error has occurred. To continue:</p>
                                    <p className="bsod-details">Press Enter to return to <ReferrerText />, or</p>
                                    <p className="bsod-details">Press CTRL+ALT+DEL to restart your computer. If you do this, you will lose any unsaved information in all open applications.</p>
                                    <p className="bsod-details">Error: <ErrorCode length={2} /> : <ErrorCode length={4} /> : <ErrorCode length={8} /></p>
                                </div>
                            } />
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/procrastinate" element={<Procrastinate />} />
                            {showAdmin && <Route path="/admin" element={<Admin />} />}
                        </Routes>
                    </div>
                    <div className="bsod-footer">
                        <p className="bsod-footer-text">Press any key to continue <span className="bsod-uscore">_</span></p>
                        <EasterEgg message="Continue where? This is a website." triggerType="alphanumeric" reset={resetEasterEggs} />
                    </div>
                </div>
            </Router>
        </CookiesProvider>
    );
}

export default App;
