const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const db = require('./database/db');
const { authenticate, authLimiter } = require('./middleware/auth');
const upload = require('./middleware/upload');
const fs = require('fs');
const { ipLimiter, detectSuspiciousActivity, validateRequest } = require('./middleware/security');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 8069;

// Development mode configuration
if (process.env.NODE_ENV !== 'production') {
    console.log('Running in development mode');
    console.log('CORS will allow requests from:', ['http://localhost:8068', 'http://127.0.0.1:8068']);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadMulter = multer({ storage: storage });

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'", "http://localhost:8068", "http://127.0.0.1:8068"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xFrameOptions: { action: "deny" },
    xContentTypeOptions: true,
    xXssProtection: true
}));
app.use(compression());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(csrf({ cookie: true }));
app.use(flash());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CORS_ORIGIN 
        : ['http://localhost:8068', 'http://127.0.0.1:8068'],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 600, // Cache preflight requests for 10 minutes
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Add CORS preflight handling
app.options('*', cors(corsOptions));

// Log CORS requests
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        origin: req.headers.origin,
        path: req.path
    });
    next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security monitoring
app.use(ipLimiter);
app.use(detectSuspiciousActivity);
app.use(validateRequest);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Validation middleware
const validatePortfolioItem = [
    body('title').trim().isLength({ min: 3, max: 100 }).escape(),
    body('description').trim().isLength({ min: 10, max: 1000 }).escape(),
    body('url').isURL().withMessage('Invalid URL format')
];

// Authentication middleware
const authenticateMiddleware = async (req, res, next) => {
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

    if (!user || !(await bcrypt.compare(credentials.pass, user.password))) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    next();
};

// Public API Routes
app.get('/api/portfolio', (req, res) => {
    db.portfolio.find({}).sort({ createdAt: -1 }).exec((err, items) => {
        if (err) {
            logger.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(items);
    });
});

// Protected Admin Routes
app.post('/api/admin/portfolio', 
    authLimiter,
    authenticateMiddleware,
    uploadMulter.single('image'),
    validatePortfolioItem,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation error:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const { title, description, url } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        db.portfolio.insert({
            title,
            description,
            url,
            imageUrl,
            createdAt: new Date()
        }, (err, newItem) => {
            if (err) {
                logger.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            logger.info('New portfolio item added:', newItem._id);
            res.status(201).json(newItem);
        });
    }
);

app.delete('/api/admin/portfolio/:id', 
    authLimiter,
    authenticateMiddleware,
    (req, res) => {
        db.portfolio.findOne({ _id: req.params.id }, (err, item) => {
            if (err || !item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            // Delete the image file
            const imagePath = path.join(__dirname, '..', item.imageUrl);
            fs.unlink(imagePath, (err) => {
                if (err) logger.error('Error deleting image:', err);
            });

            // Delete the database entry
            db.portfolio.remove({ _id: req.params.id }, {}, (err) => {
                if (err) {
                    logger.error('Database error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                logger.info('Portfolio item deleted:', req.params.id);
                res.json({ message: 'Item deleted successfully' });
            });
        });
    }
);

// Add security headers middleware
app.use((req, res, next) => {
    // Prevent admin page enumeration
    if (req.path.toLowerCase().includes('admin')) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    }
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
}); 