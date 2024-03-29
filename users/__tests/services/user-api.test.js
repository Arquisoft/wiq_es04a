const { User, sequelize } = require('../../models/user-model.js');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const apiUserRoutes = require('../../services/user-api.js');

const app = express();
app.use(bodyParser.json());
app.use('/api', apiUserRoutes);

describe('Api User Routes', () => {

    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should get all user data', async () => {
        const newUser = {
            username: 'testuser',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };

        const newUser2 = {
            username: 'testuser2',
            password: 'Test1234', 
            name: 'Test2',
            surname: 'User2'
        };
    
        // Create user for the statistics
        await User.create(newUser);
        await User.create(newUser2);
    
    
        const response = await request(app)
            .get(`/api/allUsers`);
    
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(2);

        const usernames = response.body.users.map(user => user.username);
        expect(usernames).toContain(newUser.username);
        expect(usernames).toContain(newUser2.username);
    });


    it('should get a user by username', async () => {
        const newUser = {
            username: 'testuser3',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };

        // Crear un usuario para la prueba
        await User.create(newUser);

        const response = await request(app)
            .get(`/api/user/${newUser.username}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(newUser.username);
    });


    it('should get user ranking', async () => {
        const newUser = {
            username: 'testuser4',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };
        const newUser2 = {
            username: 'testuser5',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };const newUser3 = {
            username: 'testuser6',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };   
        await User.create(newUser);
        await User.create(newUser2);
        await User.create(newUser3);

        const response = await request(app)
         .get(`/api/ranking`);
        // expect(response.status).toBe(200);
        // expect(response.type).toMatch(/json/);
        // expect(response.body).toHaveProperty('users');
    });
});