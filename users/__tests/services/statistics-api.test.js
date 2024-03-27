const { Statistics, sequelize } = require('../../models/user-model.js');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const statisticsRoutes = require('../../routes/statistics-routes.js');
const { User } = require('../../models/user-model.js');

const app = express();
app.use(bodyParser.json());
app.use('/statistics', statisticsRoutes);

describe('Statistics Routes', () => {
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should get user statistics by username', async () => {
        const newUser = {
            username: 'testuser',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };
    
        // Create user for the statistics
        await User.create(newUser);
    
        const initialStatistics = {
            earned_money: 100,
            classic_correctly_answered_questions: 5,
            classic_incorrectly_answered_questions: 2,
            classic_total_time_played: 3600,
            classic_games_played: 3
        };
    
        await Statistics.create({ username: newUser.username, ...initialStatistics });
    
        const response = await request(app)
            .get(`/statistics/api/${newUser.username}`);
    
        expect(response.status).toBe(200);
        expect(response.body.earned_money).toEqual(initialStatistics.earned_money);
        expect(response.body.classic_correctly_answered_questions).toEqual(initialStatistics.classic_correctly_answered_questions);
        expect(response.body.classic_incorrectly_answered_questions).toEqual(initialStatistics.classic_incorrectly_answered_questions);
        expect(response.body.classic_total_time_played).toEqual(initialStatistics.classic_total_time_played);
        expect(response.body.classic_games_played).toEqual(initialStatistics.classic_games_played);
    });
});