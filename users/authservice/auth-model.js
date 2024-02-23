const mysql = require('mysql2/promise');

// Create a connection pool to the MariaDB server
const pool = mysql.createPool({
    host: process.env.REACT_APP_DB_HOST,
    port: process.env.REACT_APP_DB_PORT,
    user: process.env.REACT_APP_DB_USER,
    password: process.env.REACT_APP_DB_PASSWORD,
    database: process.env.REACT_APP_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
        total_score INT DEFAULT 0,
        correctly_answered questions INT DEFAULT 0,
        incorrectly_answered questions INT DEFAULT 0,
        total_time_played INT DEFAULT 0,
        games_played INT DEFAULT 0
    )
`;

// Create the users table using pool.query
pool.query(userSchema)
    .then(() => {
        console.log('Users table created or already exists');
    })
    .catch((err) => {
        console.error('Error creating users table:', err);
    });
  
// Export the pool for use in other parts of the application
module.exports = pool;
