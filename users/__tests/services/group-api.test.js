const { Group, Sequelize, sequelize } = require('../../services/user-model.js');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../../routes/user-routes.js');

const app = express();
app.use(bodyParser.json());
app.use('', userRoutes);

describe('Api Group Routes', () => {

    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
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
        .get(`/group/list`);

        expect(response.status).toBe(200);
        expect(response.type).toMatch(/json/);
        expect(response.body).toHaveProperty('groups');
        expect(response.body.groups.length).toBe(2);
        expect(response.body.groups[0] === 'testgroup1');
        expect(response.body.groups[1] === 'testgroup2');

    });


    it('should show an error if group doesnt exist', async () => {

        const response = await request(app)
        .get(`/group/nonexistentGroup`);

        expect(response.status).toBe(404);
        expect(response.type).toMatch(/json/);
        expect(response.body).toHaveProperty('error');

    });

    //TODO: Write a test for successful group search by name

    it('should find an existing group', async () => {
        
        const newGroup = {
            name: 'testgroup3',
            creator: 'Test1234', 
        };

        await Group.create(newGroup);

        const response = await request(app)
        .get(`/group/testgroup3`);

        expect(response.status).toBe(200);
        expect(response.type).toMatch(/json/);

    });

});