const utils = require('../utils/generalQuestions');
const wikidataService = require('./wikidata-service');
const dbService = require('./question-data-service')

/**
 * Asynchronously generates a specified number of questions using data from the JSON file and stores them in the DB.
 * 
 * @param {number} n - The number of questions to generate.
 * @returns {Promise<void>} A Promise that resolves when all questions are generated.
 */
async function generateQuestions(n, language, questionCategory) {
    try {
        let json = await utils.readFromFile("../questions/utils/question.json");
        
        //generate only questions from selected category
        if (questionCategory) {
            json = json.filter(obj => obj.properties.some(prop => prop.category.includes(questionCategory)));
        }

        for (let i = 0; i < n; i++) {
            //Gets random template
            const randomIndex = Math.floor(Math.random() * json.length);
            const entity = json[randomIndex];

            // get data for selected entity
            let pos = Math.floor(Math.random() * entity.properties.length);

            //use only property of that required category
            if(questionCategory) {
                const filteredProperties = [];
                entity.properties.forEach(property => {
                    if (property.category.includes(questionCategory)) {
                        filteredProperties.push(property);
                    }
                });

                const randomPos = Math.floor(Math.random() * filteredProperties.length);
                const propertyJson = filteredProperties[randomPos];
                pos = entity.properties.findIndex(prop => prop === propertyJson);
            }
        
            const property = entity.properties[pos].property;
            const categories = entity.properties[pos].category;
            const filter = entity.properties[pos].filter;
            const lang = language=="es"?0:1; //0 spanish, 1 english
            const question = entity.properties[pos].template[lang].question;

            //let [entityName, searched_property] = await wikidataService.getRandomEntity(instance, property, filter);
            let [entityName, searched_property] = await wikidataService.getRandomEntity(entity, pos, language);

            if (searched_property !== null) {
                //This way we can ask questions with different structures
                const questionText = question.replace('x',entityName.charAt(0).toUpperCase() + entityName.slice(1)) +`?`;
                let correctAnswer = searched_property;
    
                // options will contain 3 wrong answers plus the correct one
                let options = await wikidataService.getProperties(property, language, filter);
                options.push(correctAnswer);

                //If properties are entities
                if(correctAnswer.startsWith("http:")) {
                    options = await wikidataService.convertUrlsToLabels(options);
                    //before shuffle correct answer is last one
                    correctAnswer = options[3];
                }

                // Shuffle options, we will not know where is the correct option
                const shuffledOptions = utils.shuffleArray(options);
                
                // Create object with data for the question
                const newQuestion = {
                    question: questionText,
                    options: shuffledOptions,
                    correctAnswer: correctAnswer,
                    categories: categories,
                    language: language
                };

                dbService.addQuestion(newQuestion);

            }
        }
    } catch (error) {
        console.error("Error generating questions: ", error.message);
        console.error("Line:", error.stack.split("\n")[1]);
    }
}

module.exports = {
    generateQuestions
};