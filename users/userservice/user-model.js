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
        validate: {
            len: {
                args: [6, 255], // Mínimo de 6 caracteres
                msg: "La contraseña debe tener al menos 6 caracteres."
            },
            isAlphanumeric: {
                msg: "La contraseña debe contener al menos un símbolo."
            },
            isUppercase: {
                msg: "La contraseña debe contener al menos una letra mayúscula."
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    imageUrl: {
        type: DataTypes.STRING,
        defult: "NAN", //establecer url de imagen por defecto
    },
    total_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    correctly_answered_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    incorrectly_answered_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    total_time_played: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    games_played: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
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