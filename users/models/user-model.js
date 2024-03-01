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
    username: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isLongEnough(value) {
                if (value.length < 8) {
                    throw new Error('La contraseña debe tener al menos 8 caracteres');
                }
            },
            hasNumber(value) {
                if (!/\d/.test(value)) {
                    throw new Error('La contraseña debe contener al menos un carácter numérico');
                }
            },
            hasUppercase(value) {
                if (!/[A-Z]/.test(value)) {
                    throw new Error('La contraseña debe contener al menos una letra mayúscula');
                }
            },
        },
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
        defaultValue: "../../webapp/public/default_user.jpg",
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