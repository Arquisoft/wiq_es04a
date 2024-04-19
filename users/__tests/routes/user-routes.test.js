const { User, Statistics, Group, sequelize, UserGroup, QuestionsRecord } = require('../../services/user-model.js');
const bcrypt = require('bcrypt');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../routes/user-routes.js');
const config = require('../test-config.js');

const app = express();
app.use(bodyParser.json());
app.use('/user', userRoutes);
const password = config.users.normalPassword;

describe('User Routes', () => {

    beforeEach(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    //QUESTIONS RECORD
    it('should add a new question record', async () => {
        const newQuestionRecord = {
            username: 'testuser',
            questions: ['Question 1', 'Question 2'],
            gameMode: 'classic'
        };

        const response = await request(app)
            .post('/user/questionsRecord')
            .send(newQuestionRecord);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe(newQuestionRecord.username);
        expect(response.body.questions).toEqual(newQuestionRecord.questions);
        expect(response.body.gameMode).toBe(newQuestionRecord.gameMode);
    });

    it('should return an error if required fields are missing', async () => {
        const invalidQuestionRecord = {
            gameMode: 'classic'
        };

        const response = await request(app)
            .post('/user/questionsRecord')
            .send(invalidQuestionRecord);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should get questions record for a user in a specific game mode', async () => {
        
        const username = 'testuser';
        const gameMode = 'classic';
    
        // Ahora, creamos el registro de preguntas para el usuario
        await QuestionsRecord.create({
            username: username,
            questions: ['Question 1', 'Question 2'],
            gameMode: gameMode,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const newQuestionRecord = {
            username: 'testuser',
            questions: ['Question 1', 'Question 2'],
            gameMode: 'classic'
        };

        await request(app)
            .post('/user/questionsRecord')
            .send(newQuestionRecord);
    
        // Luego, hacemos la solicitud GET al endpoint
        const response = await request(app)
            .get(`/user/questionsRecord/${username}/${gameMode}`);
    
        // Verificamos que se haya realizado correctamente y que los datos sean correctos
        expect(response.status).toBe(200);
        expect(response.body[0].username).toBe(username);
        expect(response.body[0].gameMode).toBe(gameMode);
        expect(response.body[0].questions).toEqual(['Question 1', 'Question 2']);
    });

    it('should return 400 if an error occurs while retrieving questions record', async () => {
        // Mock an error occurring during database query
        jest.spyOn(QuestionsRecord, 'findAll').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const username = 'testuser';
        const gameMode = 'classic';

        const response = await request(app)
            .get(`/user/questionsRecord/${username}/${gameMode}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Database error');
    });


    // ADD TESTS
    it('should add a new user', async () => {
        const newUser = {
            username: 'testuser',
            password: password,
            name: 'Test',
            surname: 'User'
        };

        const response = await request(app)
            .post('/user')
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
            password: password,
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
            .post('/user')
            .send(existingUser);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid username');
    });

    it('should return error if username is less than 4 characters long', async () => {
        const newUser = {
            username: 'abc',
            password: password,
            name: 'John',
            surname: 'Doe'
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The username must be at least 4 characters long');
    });

    it('should return error if password is less than 8 characters long', async () => {
        const newUser = {
            username: 'newuser',
            password: config.users.shortPassword, // Short password
            name: 'John',
            surname: 'Doe'
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The password must be at least 8 characters long');
    });

    it('should return error if password does not contain numeric character', async () => {
        const newUser = {
            username: 'newuser',
            password: config.users.noNumberPassword,
            name: 'John',
            surname: 'Doe'
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The password must contain at least one numeric character');
    });

    it('should return error if password does not contain uppercase letter', async () => {
        const newUser = {
            username: 'newuser',
            password: config.users.noUppercasePassword,
            name: 'John',
            surname: 'Doe'
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The password must contain at least one uppercase letter');
    });

    it('should return error if name is empty or contains only spaces', async () => {
        const newUser = {
            username: 'newuser',
            password: password,
            name: '', // Empty name
            surname: 'Doe'
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The name cannot be empty or contain only spaces');
    });

    it('should return error if surname is empty or contains only spaces', async () => {
        const newUser = {
            username: 'newuser',
            password: password,
            name: 'John',
            surname: ' ' // Surname with only spaces
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('The surname cannot be empty or contain only spaces');
    });

    // GROUPS TESTS
    it('should return list of all groups when username is not defined', async () => {

        // Create a user in the database to create the groups
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We create some example groups
        for(let i=0;i<3;i++){
            const newGroup = {
                name: 'Testing '+i,
                username: 'existinguser'
            };
        
            // We now make each request so that it creates the group and associates it to the user
            const response = await request(app)
                .post('/user/group')
                .send(newGroup);

            // Verify if the request was successful
            expect(response.status).toBe(200);
        }


        // Perform the request without defining a username to see the previously created groups
        const response = await request(app)
            .get('/user/group/list')
            .set('Accept', 'application/json');
    
        // Verify if the request was successful
        expect(response.status).toBe(200);
    
        // Verify if the response contains the list of groups
        expect(response.body.groups).toBeDefined();
    });
    
    it('should return list of groups with membership status when username is defined', async () => {
        // Create a user in the database to create the groups
        await User.create({
            username: 'existinguser',
            password: await bcrypt.hash('Test1234', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Existing',
            surname: 'User'
        });

        // We create some example groups
        for(let i=0;i<3;i++){
            const newGroup = {
                name: 'Testing '+i,
                username: 'existinguser'
            };
        
            // We now make each request so that it creates the group and associates it to the user
            const response = await request(app)
                .post('/user/group')
                .send(newGroup);

            // Verify if the request was successful
            expect(response.status).toBe(200);
        }
    
        // Perform the request with the defined username
        const response = await request(app)
            .get('/user/group/list')
            .query({ username: 'existinguser' })
            .set('Accept', 'application/json');
    
        // Verify if the request was successful
        expect(response.status).toBe(200);
    
        // Verify if the response contains the list of groups with membership status
        expect(response.body.groups).toBeDefined();
        response.body.groups.forEach(group => {
            expect(group.name).toBeDefined();
            expect(group.isMember).toBeDefined();
            expect(group.isFull).toBeDefined();
        });
    });

   

    it('should show an error if group doesnt exist', async () => {

        const response = await request(app)
        .get(`/user/group/nonexistentGroup`)
        .query({ username: 'Test1234' });

        expect(response.status).toBe(404);
        expect(response.type).toMatch(/json/);
        expect(response.body).toHaveProperty('error');

    });


    //group by name
    it('should find an existing group', async () => {
        const newGroup = {
            name: 'testgroup3',
            creator: 'Test1234', 
        };
        await Group.create(newGroup);
        const response = await request(app)
            .get(`/user/group/testgroup3`)
            .query({ username: 'Test1234' });

        expect(response.status).toBe(200);
        expect(response.type).toMatch(/json/);
        expect(response.body.name).toBe("testgroup3");
        expect(response.body.creator).toBe("Test1234");


    });


    //group add test
    it('should add a new group', async () => {

        //I have to add the user first to make the post work
        const newUser = {
            username: 'testuserGroup',
            password: password,
            name: 'Test',
            surname: 'User'
        };

        const response = await request(app)
            .post('/user')
            .send(newUser);


        const groupData = {
            name: "testGroup4",
            username: "testuserGroup"
        };

        // Making POST request to the endpoint
        const res = await request(app)
            .post('/user/group')
            .send(groupData)
            .expect(200); // Expecting a successful response with status code 200

        // Verifying if the group has been created correctly
        expect(res.body.name).toBe(groupData.name);
        expect(res.body.creator).toBe(groupData.username);
    });


    // group add fail test because of not accepted group name
    it('should return error 400 if group name is too short', async () => {
        const groupData = {
            name: "t",
            username: "testuserGroup"
        };
    
        const res = await request(app)
            .post('/user/group')
            .send(groupData)
            .expect(400);
    
        expect(res.body.error).toBe('Group name must be at least 4 characters long.');
    });

    
    //group add fail test
    it('shouldn`t add a new group', async () => {

        // Making POST request to the endpoint
        const res = await request(app)
            .post('/user/group')
            .send({})
            .expect(500); // Expecting a successful response with status code 200
    
    });

    //group join
    it('should allow a user to join a group successfully when the group is not full', async () => {
        
         //I have to add the user first to make the post work
         const newUser = {
            username: 'testuserGroupJoin',
            password: password,
            name: 'Test',
            surname: 'User'
        };
        const response = await request(app)
            .post('/user')
            .send(newUser);
        const newGroup = {
            name: 'testgroupUserSuccessfulJoin',
            creator: 'Test1234', 
            };
        await Group.create(newGroup);
        
        
        
        // Assuming group is not full
        const groupName = 'testgroupUserSuccessfulJoin';
        const username = 'testuserGroupJoin';

        // Making POST request to join the group
        const res = await request(app)
            .post(`/user/group/${groupName}/join`)
            .send({ username })
            .expect(200); // Expecting a successful response with status code 200

        // Verifying if the user has joined the group
        expect(res.body.username).toBe(username);
        expect(res.body.groupName).toBe(groupName);
    });

    it('should return an error if required parameters are missing (username)', async () => {
        // Missing username in request body
        const groupName = 'TestGroup';

        // Making POST request to join the group
        const res = await request(app)
            .post(`/user/group/${groupName}/join`)
            .expect(500); // Expecting an internal server error response with status code 500

        // Verifying if the correct error message is returned
        expect(res.body.error).toBe('Internal Server Error');
    });

    it('should return an error in case of internal server error (user and group doesn´t exist)', async () => {
        // Simulate internal server error by sending a malformed request
        const groupName = 'InvalidGroup';
        const username = 'TestUser';

        // Making POST request to join the group
        const res = await request(app)
            .post(`/user/group/${groupName}/join`)
            .send({ username })
            .expect(500); // Expecting an internal server error response with status code 500

        // Verifying if the correct error message is returned
        expect(res.body.error).toBe('Internal Server Error');
    });


    it('should return an error when attempting to join a full group', async () => {
        //Creating the group creator user
        const baseUser = {
            username: 'testuserGroupJoinFull',
            password: password,
            name: 'Test',
            surname: 'User'
        };
        await request(app)
            .post('/user')
            .send(baseUser)
            .expect(200);

        // Creating the baseGroup
        const groupName = "testFullGroup";
        const groupData = {
            name: groupName,
            username: "testuserGroupJoinFull"
        };
        let response = await request(app)
            .post('/user/group')
            .send(groupData)
            .expect(200);
    
        // Creating 20 users and adding them to the group
        for (let i = 0; i < 19; i++) {
            let newUser = {
                username: `testuserGroupJoinFull${i}`,
                password: password,
                name: 'Test',
                surname: 'User'
            };
            await request(app)
                .post('/user')
                .send(newUser)
                .expect(200);
    
            // Adding the user to the group
            await request(app)
                .post(`/user/group/${groupName}/join`)
                .send({ username: newUser.username })
                .expect(200);
        }
    
        // Trying to add a 21st user to the group
        const newUser = {
            username: 'testuserGroupJoinFull20',
            password: password,
            name: 'Test',
            surname: 'User'
        };
    
        // Adding the user
        await request(app)
            .post('/user')
            .send(newUser)
            .expect(200);
    
        // Trying to add the user to the group, which should fail because the group is full
        const res = await request(app)
            .post(`/user/group/${groupName}/join`)
            .send({ username: newUser.username })
            .expect(400); // Expecting a 'Bad Request' response with status code 400
    
        // Verifying if the correct error message is returned
        expect(res.body.error).toBe('Group is already full');
    });

    it('Should return an error when the user tries to create more than three groups', async () => {
        const username='testuser1';
        const groupName = 'testgroup4';
        
        await User.create({
            username: username,
            password: password,
            name: 'Test1',
            surname: 'User1'
        });

        const newGroup = {
            name: 'testgroup1',
            creator: username, 
        };
        await Group.create(newGroup);

        const newGroup2 = {
            name: 'testgroup2',
            creator: username, 
        };
        await Group.create(newGroup2);

        const newGroup3 = {
            name: 'testgroup3',
            creator: username, 
        };
        await Group.create(newGroup3);
    
        const response = await request(app)
          .post('/user/group')
          .send({ name: groupName, username });
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('You cannot create more than three groups');
    });


    it('Should return an error when the user tries to create a group with an existing name', async () => {
        const username='testuser1';
        const groupName='testgroup1';
        
        await User.create({
            username: username,
            password: password,
            name: 'Test1',
            surname: 'User1'
        });

        const newGroup = {
            name: groupName,
            creator: username, 
        };
        await Group.create(newGroup);
    
        const response = await request(app)
          .post('/user/group')
          .send({ name: groupName, username });
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('A group with the same name already exists');
    });
    

    // STATISTICS TESTS

    it('should update user statistics', async () => {
        const newUser = {
            username: 'testuser',
            password: password,
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
            password: password, 
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
            .get(`/user/statistics/${newUser.username}`)
            .query({ loggedUser: newUser.username });
    
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
            password: password,
            name: 'Test',
            surname: 'User'
        };

        const newUser2 = {
            username: 'testuser2',
            password: password,
            name: 'Test2',
            surname: 'User2'
        };
    
        // Create user for the statistics
        await User.create(newUser);
        await User.create(newUser2);
    
    
        const response = await request(app)
            .get(`/user`);
    
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(2);

        const usernames = response.body.users.map(user => user.username);
        expect(usernames).toContain(newUser.username);
        expect(usernames).toContain(newUser2.username);
    });


    it('should get a user by username', async () => {
        const newUser = {
            username: 'testuser3',
            password: password,
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
            password: password,
            name: 'Test',
            surname: 'User'
        };
        const newUser2 = {
            username: 'testuser5',
            password: password,
            name: 'Test',
            surname: 'User'
        };const newUser3 = {
            username: 'testuser6',
            password: password, 
            name: 'Test',
            surname: 'User'
        };   
        await User.create(newUser);
        await User.create(newUser2);
        await User.create(newUser3);

        const response = await request(app)
         .get(`/user/ranking`);
    });

    describe('Group Ranking Routes', () => {
        it('should return group ranking sorted by total money earned', async () => {
            const newUser = {
                username: 'testuser',
                password: password,
                name: 'Test',
                surname: 'User'
            };        
            await User.create(newUser);
            const newGroup = {
                name: 'testgroup3',
                creator: 'testuser', 
            };
            await Group.create(newGroup);
            await UserGroup.create({
                username: 'testuser',
                groupName: 'testgroup3',
                enteredAt: new Date()
            });
            const initialStatistics = {
                username: 'testuser',
                the_callenge_earned_money: 100,
                the_callenge_correctly_answered_questions: 5,
                the_callenge_incorrectly_answered_questions: 2,
                the_callenge_total_time_played: 3600,
                the_callenge_games_played: 3,
                wise_men_stack_earned_money: 50,
                wise_men_stack_correctly_answered_questions: 3,
                wise_men_stack_incorrectly_answered_questions: 1,
                wise_men_stack_total_time_played: 1800,
                wise_men_stack_games_played: 2,
                warm_question_earned_money: 80,
                warm_question_correctly_answered_questions: 4,
                warm_question_incorrectly_answered_questions: 1,
                warm_question_total_time_played: 2700,
                warm_question_games_played: 2,
                discovering_cities_earned_money: 70,
                discovering_cities_correctly_answered_questions: 4,
                discovering_cities_incorrectly_answered_questions: 1,
                discovering_cities_total_time_played: 3000,
                discovering_cities_games_played: 3
            };
            await Statistics.create(initialStatistics);


            const newUser2 = {
                username: 'testuser2',
                password: password,
                name: 'Test2',
                surname: 'User2'
            };
            await User.create(newUser2);
            const newGroup2 = {
                name: 'testgroup4',
                creator: 'testuser2', 
            };
            await Group.create(newGroup2);
            await UserGroup.create({
                username: 'testuser2',
                groupName: 'testgroup4',
                enteredAt: new Date()
            });
            const initialStatistics2 = {
                username: 'testuser2',
                the_callenge_earned_money: 200,
                the_callenge_correctly_answered_questions: 6,
                the_callenge_incorrectly_answered_questions: 1,
                the_callenge_total_time_played: 4000,
                the_callenge_games_played: 4,
                wise_men_stack_earned_money: 100,
                wise_men_stack_correctly_answered_questions: 5,
                wise_men_stack_incorrectly_answered_questions: 2,
                wise_men_stack_total_time_played: 2500,
                wise_men_stack_games_played: 3,
                warm_question_earned_money: 120,
                warm_question_correctly_answered_questions: 6,
                warm_question_incorrectly_answered_questions: 2,
                warm_question_total_time_played: 3200,
                warm_question_games_played: 3,
                discovering_cities_earned_money: 80,
                discovering_cities_correctly_answered_questions: 5,
                discovering_cities_incorrectly_answered_questions: 2,
                discovering_cities_total_time_played: 3500,
                discovering_cities_games_played: 4
            };
            await Statistics.create(initialStatistics2);


            const response = await request(app)
            .get('/user/group/ranking')
            .expect(200);

            expect(response.body).toHaveProperty('rank');
            expect(response.body.rank).toHaveLength(2);

            const [firstGroup, secondGroup] = response.body.rank;
            expect(firstGroup.id).toBe("testgroup4");
            expect(firstGroup.totalMoney).toBe(500);
            expect(secondGroup.id).toBe("testgroup3");
            expect(secondGroup.totalMoney).toBe(300);
        });
    });

    it('should allow a user to exit a group', async () => {
        await User.create({
            username: 'testuser',
            password: password,
            name: 'Test',
            surname: 'User'
        });

        await Group.create({
            name: 'testgroup',
            creator: 'testuser'
        });

        await UserGroup.create({
            username: 'testuser',
            groupName: 'testgroup'
        });

        const response = await request(app)
            .post('/user/group/testgroup/exit')
            .send({ username: 'testuser' })
            .expect(200);

        expect(response.status).toBe(200);

        const userGroup = await UserGroup.findOne({
            where: {
                username: 'testuser',
                groupName: 'testgroup'
            }
        });

        expect(userGroup).toBeNull();
    });

    it('should allow viewing statistics of a user if logged in user has common group', async () => {
        await User.create({
            username: 'testuser1',
            password: password,
            name: 'Test1',
            surname: 'User1'
        });

        await User.create({
            username: 'testuser2',
            password: password,
            name: 'Test2',
            surname: 'User2'
        });

        await Group.create({
            name: 'testgroup',
            creator: 'testuser1'
        });

        await UserGroup.create({
            username: 'testuser1',
            groupName: 'testgroup'
        });

        await UserGroup.create({
            username: 'testuser2',
            groupName: 'testgroup'
        });

        await Statistics.create({
            username: 'testuser2',
            the_callenge_earned_money: 100,
            the_callenge_correctly_answered_questions: 5,
            the_callenge_incorrectly_answered_questions: 2,
            the_callenge_total_time_played: 3600,
            the_callenge_games_played: 3
        });

        const response = await request(app)
            .get('/user/statistics/testuser2')
            .query({ loggedUser: 'testuser1' })
            .expect(200);

        expect(response.body).toHaveProperty('username', 'testuser2');
        expect(response.body).toHaveProperty('the_callenge_earned_money', 100);
        expect(response.body).toHaveProperty('the_callenge_correctly_answered_questions', 5);
        expect(response.body).toHaveProperty('the_callenge_incorrectly_answered_questions', 2);
        expect(response.body).toHaveProperty('the_callenge_total_time_played', 3600);
        expect(response.body).toHaveProperty('the_callenge_games_played', 3);
    });

    it('should return an error if user is not logged in or has no common group', async () => {
        await User.create({
            username: 'testuser1',
            password: password,
            name: 'Test1',
            surname: 'User1'
        });

        await User.create({
            username: 'testuser2',
            password: password,
            name: 'Test2',
            surname: 'User2'
        });

        const responseWithoutLoggedUser = await request(app)
            .get('/user/statistics/testuser2')
            .expect(403);

        expect(responseWithoutLoggedUser.body).toHaveProperty('error');

        const responseWithInvalidLoggedUser = await request(app)
            .get('/user/statistics/testuser2')
            .query({ loggedUser: 'testuser1' })
            .expect(403);

        expect(responseWithInvalidLoggedUser.body).toHaveProperty('error');
    });

    it('Should return the user when the username is valid when getting the profile', async () => {
        await User.create({
            username: 'testuser1',
            password: password,
            name: 'Test1',
            surname: 'User1'
        });

        const username = 'testuser1';
        
        const response = await request(app)
          .get('/user/profile')
          .query({ username });
    
        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe('testuser1');
        expect(response.body.user.name).toBe('Test1');
        expect(response.body.user.surname).toBe('User1');
    });

    it('Should return an error when a user does not exist and does not have profile', async () => {
        const username = 'nombre_de_usuario_inexistente';
        
        const response = await request(app)
          .get('/user/profile')
          .query({ username });
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('No user found');
    });

    it('Should update the user`s profile pic', async () => {
        await User.create({
            username: 'testuser1',
            password: password,
            name: 'Test1',
            surname: 'User1'
        });

        const username = 'testuser1';
        const newImageUrl = 'bertinIcon.jpg';
    
        const response = await request(app)
          .post(`/user/profile/${username}`)
          .send({ imageUrl: newImageUrl });
    
        expect(response.status).toBe(200);
        expect(response.body.affectedRows).toBe(1);
    });

    it('Should return an error when updating th euser profile pic', async () => {
        const username = 'nombre_de_usuario_inexistente';
        const newImageUrl = 'nueva_url_de_imagen';
    
        const response = await request(app)
          .post(`/user/profile/${username}`)
          .send({ imageUrl: newImageUrl });
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('No user could be updated');
    });

});