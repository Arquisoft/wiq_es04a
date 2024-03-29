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

    
    
        // Create user for the statistics
        await User.create(newUser);
        await User.create(newUser2);
    
    
        const response = await request(app)
            .get(`/api/allUsers`);
    
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(1);

      
    });
});