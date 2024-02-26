const { Sequelize, DataTypes } = require('sequelize');

// Database connection configuration
const sequelize = new Sequelize({
    host: 'mariadb',
    username: 'root',
    password: 'R#9aLp2sWu6y',
    database: 'base_de_datos_de_usuarios',
    port: 3306,
    dialect: 'mariadb'
});

// Define the user model
const User = sequelize.define('User', {
    id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    total_score: DataTypes.INTEGER,
    correctly_answered_questions: DataTypes.INTEGER,
    incorrectly_answered_questions: DataTypes.INTEGER,
    total_time_played: DataTypes.INTEGER,
    games_played: DataTypes.INTEGER
});

// Synchronize the model with the database
sequelize.sync()
    .then(() => {
        console.log('Model synchronized successfully with the database');
    })
    .catch((err) => {
        console.error('Error synchronizing the model with the database:', err);
    });

// Authenticate the database connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Successful connection to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

module.exports = { sequelize, User };