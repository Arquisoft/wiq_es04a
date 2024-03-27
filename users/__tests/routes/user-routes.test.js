const { User, Statistics, sequelize } = require('../../models/user-model.js');
const bcrypt = require('bcrypt');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../routes/user-routes.js');

const app = express();
app.use(bodyParser.json());
app.use('/user', userRoutes);

describe('User Routes', () => {
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should add a new user', async () => {
        const newUser = {
            username: 'testuser',
            password: 'Test1234',
            name: 'Test',
            surname: 'User'
        };

        const response = await request(app)
            .post('/user/add')
            .send(newUser);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(newUser.username);

        // Check if the user exists in the database
        const user = await User.findOne({ where: { username: newUser.username } });
        expect(user).toBeDefined();

        // Check if the password is hashed
        const isPasswordCorrect = await bcrypt.compare(newUser.password, user.password);
        expect(isPasswordCorrect).toBe(true);

        // Check if statistics for the user are created
        const statistics = await Statistics.findOne({ where: { username: newUser.username } });
        expect(statistics).toBeDefined();
    });

    it('should not add a user if username already exists', async () => {
        const existingUser = {
            username: 'existinguser',
            password: 'Test1234',
            name: 'Existing',
            surname: 'User'
        };
    
        // Create the existing user in the database
        await User.create({
            username: existingUser.username,
            password: await bcrypt.hash(existingUser.password, 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: existingUser.name,
            surname: existingUser.surname
        });
    
        // Try to add the existing user again
        const response = await request(app)
            .post('/user/add')
            .send(existingUser);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('An account with that username already exists');
    });
});