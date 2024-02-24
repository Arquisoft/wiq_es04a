const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize({
    host: 'mariadb',
    username: 'root',
    password: 'R#9aLp2sWu6y',
    database: 'base_de_datos_de_usuarios',
    port: 3306,
    dialect: 'mariadb'
});

// Define el modelo de usuario
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Sincroniza el modelo con la base de datos
sequelize.sync()
    .then(() => {
        console.log('Modelo sincronizado correctamente con la base de datos');
    })
    .catch((err) => {
        console.error('Error al sincronizar el modelo con la base de datos:', err);
    });

// Autenticar la conexión a la base de datos
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Exporta la instancia de Sequelize
module.exports = { sequelize, User };