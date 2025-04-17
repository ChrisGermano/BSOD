const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and add timestamp
        const sanitizedFilename = sanitizeFilename(file.originalname);
        const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
        cb(null, uniqueFilename);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
        return;
    }
    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

// Cleanup old files
const cleanupOldFiles = () => {
    const uploadDir = path.join(__dirname, '../../uploads');
    const files = fs.readdirSync(uploadDir);
    const now = Date.now();
    const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

    files.forEach(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > MAX_AGE) {
            fs.unlinkSync(filePath);
        }
    });
};

// Run cleanup every day
setInterval(cleanupOldFiles, 24 * 60 * 60 * 1000);

module.exports = upload; 