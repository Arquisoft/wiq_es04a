const mysql = require('mysql2/promise');

// Crear un pool de conexiones a la base de datos()
const pool = mysql.createPool({
    host: process.env.REACT_APP_DB_HOST,
    port: process.env.REACT_APP_DB_PORT,
    user: process.env.REACT_APP_DB_USER,
    password: process.env.REACT_APP_DB_PASSWORD,
    database: process.env.REACT_APP_DB_NAME,
    waitForConnections: true, //determina si las conexiones se encolaran o se rechazaran si el pool ha llegado al límite
    connectionLimit: 10, // límite máximo de conexiones simultáneas
    queueLimit: 0 // límite máximo de conexiones en la cola de espera
});

// Definir el esquema del usuario
const userSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// Crear la tabla de usuarios si no existe
pool.query(userSchema)
    .then(() => {
        console.log('Tabla de usuarios creada o ya existe');
    })
    .catch((err) => {
        console.error('Error al crear la tabla de usuarios:', err);
    });

// Exportar el pool de conexiones para su uso en otros archivos
module.exports = pool;