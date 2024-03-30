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
            the_callenge_earned_money: 100,
            the_callenge_correctly_answered_questions: 5,
            the_callenge_incorrectly_answered_questions: 2,
            the_callenge_total_time_played: 3600,
            the_callenge_games_played: 3
        };

        await Statistics.create(initialStatistics);

        const updatedStatistics = {
            username: 'testuser',
            the_callenge_earned_money: 50,
            the_callenge_correctly_answered_questions: 3,
            the_callenge_incorrectly_answered_questions: 1,
            the_callenge_total_time_played: 1800,
            the_callenge_games_played: 2
        };

        const response = await request(app)
            .post('/statistics/edit')
            .send(updatedStatistics);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User statics updated successfully');

        // Check if the statistics are updated in the database
        const userStatistics = await Statistics.findOne({ where: { username: updatedStatistics.username } });

        expect(userStatistics.the_callenge_earned_money).toBe(initialStatistics.the_callenge_earned_money + updatedStatistics.the_callenge_earned_money);
        expect(userStatistics.the_callenge_correctly_answered_questions).toBe(initialStatistics.the_callenge_correctly_answered_questions + updatedStatistics.the_callenge_correctly_answered_questions);
        expect(userStatistics.the_callenge_incorrectly_answered_questions).toBe(initialStatistics.the_callenge_incorrectly_answered_questions + updatedStatistics.the_callenge_incorrectly_answered_questions);
        expect(userStatistics.the_callenge_total_time_played).toBe(initialStatistics.the_callenge_total_time_played + updatedStatistics.the_callenge_total_time_played);
        expect(userStatistics.the_callenge_games_played).toBe(initialStatistics.the_callenge_games_played + updatedStatistics.the_callenge_games_played);
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