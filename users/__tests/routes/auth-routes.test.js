const { User, Statistics, Group, sequelize } = require('../../services/user-model.js');
const bcrypt = require('bcrypt');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../routes/user-routes.js');
const authRoutes = require('../../routes/auth-routes.js');

const app = express();
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/login', authRoutes);

describe('Auth Routes', () => {

    beforeEach(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('shouldn`t login a user because of the white username', async () => {

        // Create the existing user in the database
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We make the wrong login request
        const response = await request(app)
            .post('/login')
            .send({ username: '   ', password: 'Test1234' });

        // We now need to check that the response is correct and it shows the error
        expect(response.statusCode).toBe(400);
        console.log(response.error);
    });

    it('shouldn`t login a user because of the white password', async () => {

        // Create the existing user in the database
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We make the wrong login request
        const response = await request(app)
            .post('/login')
            .send({ username: 'existinguser', password: '    ' });

        // We now need to check that the response is correct and it shows the error
        expect(response.statusCode).toBe(400);
        console.log(response.error);
    });

    it('shouldn`t login a user due to not including the password', async () => {

        // Create the existing user in the database
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We make the wrong login request
        const response = await request(app)
            .post('/login')
            .send({ username: 'existinguser' });

        // We now need to check that the response is correct and it shows the error
        expect(response.statusCode).toBe(400);
        console.log(response.error);
    });

    it('shouldn`t login a user due to wrong username credential', async () => {

        // Create the existing user in the database
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We make the wrong login request
        const response = await request(app)
            .post('/login')
            .send({ username: 'notexistinguser', password: 'Test1234' });

        // We now need to check that the response is correct and it shows the error
        expect(response.statusCode).toBe(401);
        console.log(response.error);
    });

    it('shouldn`t login a user due to wrong password credential', async () => {

        // Create the existing user in the database
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We make the wrong login request
        const response = await request(app)
            .post('/login')
            .send({ username: 'existinguser', password: 'WrongPassword' });

        // We now need to check that the response is correct and it shows the error
        expect(response.statusCode).toBe(401);
        console.log(response.error);
    });

    it('should login a user', async () => {

        // Create the existing user in the database
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We make the login request
        const response = await request(app)
            .post('/login')
            .send({ username: 'existinguser', password: 'Test1234' });

        // We now need to check that the response is correct
        expect(response.statusCode).toBe(200);
    });
    
});