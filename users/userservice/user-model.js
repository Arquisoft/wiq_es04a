const mysql = require('mysql2/promise');
require('dotenv').config();

// Función para conectar a la base de datos
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'mariadb',  
            port: process.env.DB_PORT || '3306',
            user: process.env.MYSQL_USER || 'Admin',
            password: process.env.MYSQL_PASSWORD || 'Xp@7qZr#3wT2',
            database: process.env.DB_NAME || 'base_de_datos_de_usuarios',
        });
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}

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
        correctly_answered_questions INT DEFAULT 0,
        incorrectly_answered_questions INT DEFAULT 0,
        total_time_played INT DEFAULT 0,
        games_played INT DEFAULT 0
    )
`;

// Función para crear la tabla de usuarios
async function createUsersTable() {
    const connection = await connectToDatabase(); // Llamada a connectToDatabase dentro de una función asíncrona
    try {
        // Iniciar una transacción
        await connection.beginTransaction();

        // Ejecutar la consulta para crear la tabla de usuarios
        await connection.query(userSchema);

        // Confirmar la transacción
        await connection.commit();

        console.log('Tabla de usuarios creada con éxito');
    } catch (err) {
        // Revertir la transacción en caso de error
        await connection.rollback();

        console.error('Error creando la tabla de usuarios:', err);
    } finally {
        // No cerrar la conexión aquí, ya que se desea reutilizar en otros lugares
    }
}

// Exportar la función createUsersTable solamente, no la conexión
module.exports = { createUsersTable };