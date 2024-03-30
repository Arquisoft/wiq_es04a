const { Sequelize, DataTypes } = require('sequelize');


// Database connection configuration
const sequelize = new Sequelize({
    host: 'mariadb',
    username: 'root',
    password: 'R#9aLp2sWu6y',
    database: 'base_de_datos_de_usuarios',
    port: 3306,
    dialect: 'mariadb',
    dialectOptions: {
        connectTimeout: 20000 
    }
});

// Define the user model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        notEmpty: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
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

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    creator: {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
    // When the session is introduced, the creator user and more stuff will be added
})

const UserGroup = sequelize.define('UserGroup', {
    enteredAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

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

module.exports = { sequelize, User, Group, UserGroup };
