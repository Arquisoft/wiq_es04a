const mysql = require('mysql2/promise');

// Create a connection pool to the database
const pool = mysql.createPool({
    host: process.env.REACT_APP_DB_HOST,
    port: process.env.REACT_APP_DB_PORT,
    user: process.env.REACT_APP_DB_USER,
    password: process.env.REACT_APP_DB_PASSWORD,
    database: process.env.REACT_APP_DB_NAME,
    waitForConnections: true, // determines if connections should be queued or rejected if the pool has reached its limit
    connectionLimit: 10, // maximum limit of simultaneous connections
    queueLimit: 0 // maximum limit of connections in the waiting queue
});

// Define the user schema
const userSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        imageUrl VARCHAR(255),
        score INT DEFAULT 0,
        correctly_answered questions INT DEFAULT 0,
        incorrectly_answered questions INT DEFAULT 0,
        total_time_played INT DEFAULT 0,
        number_of_games played INT DEFAULT 0
    )
`;

// Create the users table if it doesn't exist
pool.query(userSchema)
    .catch((err) => {
        console.error('Error creating users table:', err);
    });

// Export the connection pool for use in other files
module.exports = pool;