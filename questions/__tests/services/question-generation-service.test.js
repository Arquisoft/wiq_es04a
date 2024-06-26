const generator = require('../../services/generate-questions-service');
const dbService = require('../../services/question-data-service');
const wikidataService = require('../../services/wikidata-service');
const generalQuestions = require('../../utils/generalQuestions');

jest.mock('../../utils/generalQuestions');
jest.mock('../../services/wikidata-service');
jest.mock('../../services/question-data-service', () => ({
    getQuestion: jest.fn(),
    addQuestion: jest.fn(), // Mockear la función addQuestion para que no haga nada
}));

const entity = {
        "name": "country",
        "instance": "Q6256",
        "properties": [
            {   
                "property": "P1082",
                "template": {
                    "es": "Cuál es la población de x",
                    "en": "What is the population of x"
                },
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
        wikidataService.convertUrlsToLabels.mockResolvedValue(['Barcelona', 'Paris', 'London','Madrid']);

        generalQuestions.shuffleArray.mockResolvedValue(['Barcelona', 'Paris', 'London','Madrid']);
    
        dbService.getQuestion.mockResolvedValue("undefined");
        dbService.addQuestion.mockResolvedValue();
        // Llama a la función que deseas probar
        await generator.generateQuestions(1,"en","Geography");
    
        // Verifica que la función haya realizado las operaciones esperadas
        expect(dbService.addQuestion).toHaveBeenCalledTimes(1);
      });

      it('should cause an error', async () => {
        // Configura los mocks de las dependencias según sea necesario para tus pruebas
        const questions = entity;
        generalQuestions.readFromFile.mockResolvedValue(questions);

        const entityName = 'Madrid';
        const searched_property = 'P18';
        wikidataService.getRandomEntity.mockResolvedValue([entityName, searched_property]);
    
        wikidataService.getProperties.mockResolvedValue(['Barcelona', 'Paris', 'London']);
        wikidataService.convertUrlsToLabels.mockResolvedValue(['Barcelona', 'Paris', 'London']);

        generalQuestions.shuffleArray.mockResolvedValue(['Barcelona', 'Paris', 'London','Madrid'])
    
        dbService.addQuestion.mockResolvedValue();

        console.error = jest.fn();
        // Llama a la función que deseas probar
        await generator.generateQuestions(1,"en");
    
        // Verifica que la función haya realizado las operaciones esperadas
        expect(dbService.addQuestion).toHaveBeenCalledTimes(0);

        // Verifica si console.error fue llamado con el mensaje de error específico
        expect(console.error).toHaveBeenCalledWith("Error generating questions: ","Cannot read properties of undefined (reading 'properties')");
      });

});