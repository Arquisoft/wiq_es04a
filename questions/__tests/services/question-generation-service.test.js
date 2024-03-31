const request = require('supertest');
const axios = require('axios');
const generator = require('../../services/generate-questions-service');
const MockAdapter = require('axios-mock-adapter');
const dbService = require('../../services/question-data-service');
const wikidataService = require('../../services/wikidata-service');
const generalQuestions = require('../../utils/generalQuestions');

jest.mock('../../utils/generalQuestions');
jest.mock('../../services/wikidata-service');


jest.mock('../../services/question-data-service', () => ({
    addQuestion: jest.fn(), // Mockear la función addQuestion para que no haga nada
}));

const entity = {
        "name": "country",
        "instance": "Q6256",
        "properties": [
            {   
                "property": "P1082",
                "template": 
                    [{
                    "lang": "es",
                    "question": "Cuál es la población de x"
                    },
                    {
                    "lang": "en",
                    "question": "What is the population of x"
                    }],
                "filter": ">1000000",
                "category": ["Geography"]
            }
        ]
};

    
beforeEach(() => {
    // Reinicia el estado de los mocks antes de cada prueba
    jest.clearAllMocks();
});
describe('Question generation', function() {
      it('should generate questions', async () => {
        // Configura los mocks de las dependencias según sea necesario para tus pruebas
        const questions = [entity];
        generalQuestions.readFromFile.mockResolvedValue(questions);

        const entityName = 'Madrid';
        const searched_property = 'P18';
        wikidataService.getRandomEntity.mockResolvedValue([entityName, searched_property]);
    
        wikidataService.getProperties.mockResolvedValue(['Barcelona', 'Paris', 'London']);
        wikidataService.convertUrlsToLabels.mockResolvedValue(['Barcelona', 'Paris', 'London']);

        generalQuestions.shuffleArray.mockResolvedValue(['Barcelona', 'Paris', 'London','Madrid'])
    
        dbService.addQuestion.mockResolvedValue();
        // Llama a la función que deseas probar
        await generator.generateQuestions(1);
    
        // Verifica que la función haya realizado las operaciones esperadas
        expect(dbService.addQuestion).toHaveBeenCalledTimes(1);
      });
});