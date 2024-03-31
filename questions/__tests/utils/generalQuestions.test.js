const generalQuestions = require('../../utils/generalQuestions')
const assert = require('assert');

describe('Shuffle array', function() {
    it('It should shuffle an array', async function() {
        const array =  ['1','2','3','4'];
        const response = generalQuestions.shuffleArray(array);
        assert.notEqual( ['1','2','3','4'], response);
    });
});

describe('Read from file', function() {
    it('It read information from a file', async function() {
        const response = await generalQuestions.readFromFile("../../questions/utils/question.json");
        console.log(response);
    });

    it('It cannot read information from a file', async function() {
        console.error = jest.fn();
        const response = await generalQuestions.readFromFile("../../questions/utils/question_error.json");
        console.log(response);
        await expect(response).toBe(null);
        await expect(console.error).toHaveBeenCalledTimes(1);
    });
});
