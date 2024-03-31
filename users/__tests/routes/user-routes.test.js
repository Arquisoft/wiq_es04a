const { User, Statistics, Group, sequelize } = require('../../services/user-model.js');
const bcrypt = require('bcrypt');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../routes/user-routes.js');

const app = express();
app.use(bodyParser.json());
app.use('/user', userRoutes);

describe('User Routes', () => {

    beforeEach(async () => {
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
            .post('/user/statistics/edit')
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
            .post('/user/statistics/edit')
            .send(nonExistingUserStatistics);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
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
            .get(`/user/statistics/${newUser.username}`);
    
        expect(response.status).toBe(200);
        expect(response.body.the_callenge_earned_money).toEqual(initialStatistics.the_callenge_earned_money);
        expect(response.body.the_callenge_correctly_answered_questions).toEqual(initialStatistics.the_callenge_correctly_answered_questions);
        expect(response.body.the_callenge_incorrectly_answered_questions).toEqual(initialStatistics.the_callenge_incorrectly_answered_questions);
        expect(response.body.the_callenge_total_time_played).toEqual(initialStatistics.the_callenge_total_time_played);
        expect(response.body.the_callenge_games_played).toEqual(initialStatistics.the_callenge_games_played);
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
            .get(`/user/allUsers`);
    
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
            .get(`/user/get/${newUser.username}`);

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
         .get(`/user/ranking`);
        // expect(response.status).toBe(200);
        // expect(response.type).toMatch(/json/);
        // expect(response.body).toHaveProperty('users');
    });

    it('should list all groups', async () => {
        const newGroup = {
            name: 'testgroup1',
            creator: 'Test1234', 
        };

        const newGroup2 = {
            name: 'testgroup2',
            creator: 'Test1234', 
        };



        await Group.create(newGroup);
        await Group.create(newGroup2);
        const response = await request(app)
        .get(`/user/group/list`);

        expect(response.status).toBe(200);
        expect(response.type).toMatch(/json/);
        expect(response.body).toHaveProperty('groups');
        expect(response.body.groups.length).toBe(2);
        expect(response.body.groups[0] === 'testgroup1');
        expect(response.body.groups[1] === 'testgroup2');

    });


    it('should show an error if group doesnt exist', async () => {

        const response = await request(app)
        .get(`/user/group/nonexistentGroup`);

        expect(response.status).toBe(404);
        expect(response.type).toMatch(/json/);
        expect(response.body).toHaveProperty('error');

    });
});