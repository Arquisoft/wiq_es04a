const { Statistics, sequelize } = require('../../services/user-model.js');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const statisticsRoutes = require('../../routes/statistics-routes.js');
const { User } = require('../../services/user-model.js');

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
            the_callenge_earned_money: 100,
            the_callenge_correctly_answered_questions: 5,
            the_callenge_incorrectly_answered_questions: 2,
            the_callenge_total_time_played: 3600,
            the_callenge_games_played: 3
        };
    
        await Statistics.create({ username: newUser.username, ...initialStatistics });
    
        const response = await request(app)
            .get(`/statistics/api/${newUser.username}`);
    
        expect(response.status).toBe(200);
        expect(response.body.the_callenge_earned_money).toEqual(initialStatistics.the_callenge_earned_money);
        expect(response.body.the_callenge_correctly_answered_questions).toEqual(initialStatistics.the_callenge_correctly_answered_questions);
        expect(response.body.the_callenge_incorrectly_answered_questions).toEqual(initialStatistics.the_callenge_incorrectly_answered_questions);
        expect(response.body.the_callenge_total_time_played).toEqual(initialStatistics.the_callenge_total_time_played);
        expect(response.body.the_callenge_games_played).toEqual(initialStatistics.the_callenge_games_played);
    });
});