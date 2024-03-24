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
    }
});

// Define the group model
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

// Define the user group model
const UserGroup = sequelize.define('UserGroup', {
    enteredAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

// Define the statics model
const Statics = sequelize.define('Statics', {
    // Add userId column as foreign key
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    earned_money: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    classic_correctly_answered_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    classic_incorrectly_answered_questions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    classic_total_time_played: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    classic_games_played: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
    //we have to add more statics for more games
})

// Define the relationship between User and Statics
User.hasOne(Statics, { foreignKey: 'username' });
Statics.belongsTo(User, { foreignKey: 'username' });

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

module.exports = { sequelize, User, Group, UserGroup, Statics };
