const logger = require('./logger');
const rateLimit = require('express-rate-limit');

// IP-based rate limiting
const ipLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

// Suspicious activity detection
const detectSuspiciousActivity = (req, res, next) => {
    const suspiciousPatterns = [
        // SQL injection patterns
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|JOIN|WHERE)\b.*\b(FROM|INTO|TABLE|DATABASE)\b)/i,
        // XSS patterns
        /(<script>|javascript:|onerror=|onload=)/i,
        // Directory traversal
        /(\.\.\/|\.\.\\|\.\.%2f|\.\.%5c)/i,
        // Command injection
        /(\|\||\&\&|\;|\`|\$\(|\$\{)/i
    ];

    const userAgent = req.headers['user-agent'] || '';
    const url = req.originalUrl;
    const body = JSON.stringify(req.body);
    const ip = req.ip;

    // Check for suspicious patterns
    const suspicious = suspiciousPatterns.some(pattern => 
        pattern.test(url) || pattern.test(body) || pattern.test(userAgent)
    );

    if (suspicious) {
        logger.warn('Suspicious activity detected', {
            ip,
            url,
            userAgent,
            timestamp: new Date().toISOString()
        });
        
        // Block the request
        return res.status(403).json({ error: 'Access denied' });
    }

    next();
};

// Request validation
const validateRequest = (req, res, next) => {
    // Check content type
    if (req.method === 'POST' || req.method === 'PUT') {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            logger.warn('Invalid content type', {
                ip: req.ip,
                method: req.method,
                contentType
            });
            return res.status(415).json({ error: 'Unsupported media type' });
        }
    }

    // Check request size
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 1024 * 1024) { // 1MB
        logger.warn('Request too large', {
            ip: req.ip,
            contentLength
        });
        return res.status(413).json({ error: 'Request too large' });
    }

    next();
};

module.exports = {
    ipLimiter,
    detectSuspiciousActivity,
    validateRequest
}; 