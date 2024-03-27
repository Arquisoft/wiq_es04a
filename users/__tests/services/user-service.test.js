const request = require('supertest');
const { Sequelize, DataTypes } = require('sequelize');
const {router} = require('../../routes/user-routes.js');

// Configuration of the Sequelize to use a memory data base
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
});

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

const Statistics = sequelize.define('Statistics', {
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
});

User.hasOne(Statistics, { foreignKey: 'username' });
Statistics.belongsTo(User, { foreignKey: 'username' });

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

// tests
describe('User Registration API', () => {
    it('should register a new user', async () => {
        const userData = {
            username: 'testuser',
            password: 'Test1234',
            name: 'Test',
            surname: 'User'
        };

        const response = await request(router)
            .post('/add')
            .send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', userData.username);
        expect(response.body).toHaveProperty('name', userData.name);
        expect(response.body).toHaveProperty('surname', userData.surname);

        const userStats = await Statistics.findOne({ where: { username: userData.username } });
        expect(userStats).toBeTruthy();
        expect(userStats.classic_correctly_answered_questions).toBe(0);
    });

    it('should return an error if trying to register with an existing username', async () => {
        const existingUser = {
            username: 'existinguser',
            password: 'Test1234',
            name: 'Existing',
            surname: 'User'
        };

        await User.create(existingUser);

        const response = await request(router)
            .post('/add')
            .send(existingUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('An account with that username already exists');
    });
});
