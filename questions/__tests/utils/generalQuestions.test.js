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
    it('It reads information from a file', async function() {
        const response = await generalQuestions.readFromFile("../questions/utils/question.json");
        await expect(Array.isArray(response)).toBe(true);
    });

    it('It cannot read information from a file', async function() {
        console.error = jest.fn();
        const response = await generalQuestions.readFromFile("../../questions/utils/question_error.json");
        await expect(response).toBe(null);
        await expect(console.error).toHaveBeenCalledTimes(1);
    });
});
