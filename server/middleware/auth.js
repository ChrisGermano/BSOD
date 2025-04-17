const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../database/db');

// Rate limiting for authentication attempts
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later'
});

const authenticate = async (req, res, next) => {
    try {
        const credentials = auth(req);
        if (!credentials) {
            res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = await new Promise((resolve, reject) => {
            db.users.findOne({ username: credentials.name }, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });

        if (!user) {
            res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(credentials.pass, user.password);
        if (!passwordMatch) {
            res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login time
        db.users.update(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    authenticate,
    authLimiter
}; 