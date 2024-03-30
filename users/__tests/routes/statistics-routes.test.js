const { Statistics, sequelize } = require('../../models/user-model.js');
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

    it('should update user statistics', async () => {
        const newUser = {
            username: 'testuser',
            password: 'Test1234', 
            name: 'Test',
            surname: 'User'
        };
    
        // Create user for the statistics
        await User.create(newUser);

        const initialStatistics = {
            username: 'testuser',
            earned_money: 100,
            classic_correctly_answered_questions: 5,
            classic_incorrectly_answered_questions: 2,
            classic_total_time_played: 3600,
            classic_games_played: 3
        };

        await Statistics.create(initialStatistics);

        const updatedStatistics = {
            username: 'testuser',
            earned_money: 50,
            classic_correctly_answered_questions: 3,
            classic_incorrectly_answered_questions: 1,
            classic_total_time_played: 1800,
            classic_games_played: 2
        };

        const response = await request(app)
            .post('/statistics/edit')
            .send(updatedStatistics);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User statics updated successfully');

        // Check if the statistics are updated in the database
        const userStatistics = await Statistics.findOne({ where: { username: updatedStatistics.username } });

        expect(userStatistics.earned_money).toBe(initialStatistics.earned_money + updatedStatistics.earned_money);
        expect(userStatistics.classic_correctly_answered_questions).toBe(initialStatistics.classic_correctly_answered_questions + updatedStatistics.classic_correctly_answered_questions);
        expect(userStatistics.classic_incorrectly_answered_questions).toBe(initialStatistics.classic_incorrectly_answered_questions + updatedStatistics.classic_incorrectly_answered_questions);
        expect(userStatistics.classic_total_time_played).toBe(initialStatistics.classic_total_time_played + updatedStatistics.classic_total_time_played);
        expect(userStatistics.classic_games_played).toBe(initialStatistics.classic_games_played + updatedStatistics.classic_games_played);
    });

    it('should return error if user not found', async () => {
        const nonExistingUserStatistics = {
            username: 'nonexistinguser',
            earned_money: 50,
            classic_correctly_answered_questions: 3,
            classic_incorrectly_answered_questions: 1,
            classic_total_time_played: 1800,
            classic_games_played: 2
        };

        const response = await request(app)
            .post('/statistics/edit')
            .send(nonExistingUserStatistics);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});