const Datastore = require('nedb');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '../data');
const uploadsDir = path.join(__dirname, '../uploads');
require('fs').mkdirSync(dbDir, { recursive: true });
require('fs').mkdirSync(uploadsDir, { recursive: true });

// Initialize database instances
const db = {
    portfolio: new Datastore({ filename: path.join(dbDir, 'portfolio.db'), autoload: true }),
    users: new Datastore({ filename: path.join(dbDir, 'users.db'), autoload: true })
};

// Add default admin user if none exists
db.users.findOne({ username: 'admin' }, async (err, user) => {
    if (!user) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        db.users.insert({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
    }
});

// Add some sample portfolio items
// db.portfolio.insert({
//     title: "Sample Project",
//     description: "This is a sample project description",
//     imageUrl: "/uploads/sample-project.jpg",
//     url: "https://sample-project.com",
//     createdAt: new Date()
// });

module.exports = db; 