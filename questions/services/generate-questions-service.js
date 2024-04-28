const utils = require('../utils/generalQuestions');
const wikidataService = require('./wikidata-service');
const dbService = require('./question-data-service');

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
            // Now language is accessed directly:
            const question = entity.properties[pos].template[language];

            let [entityName, searched_property] = [null, null]
            let invalidEntity = false;
            while ((!entityName || !searched_property) && !invalidEntity) {
                try {
                    // If result for the entity is invalid, stops and logs the entity
                    let response = await wikidataService.getRandomEntity(entity, pos, language);
                    if (response && response.length === 2) {
                        [entityName, searched_property] = response;
                    } else {
                        console.error(`Error: getRandomEntity returned an invalid response for the entity: ${entity.name}`);
                        invalidEntity = true;
                    }
                } catch (error) {
                    console.error("Error generating label for the answer: ", error.message);
                    console.error("Line:", error.stack.split("\n")[1]);
                }
            }
            if (invalidEntity) {
                continue;
            }

            if (searched_property !== null) {
                //This way we can ask questions with different structures
                const questionText = question.replace('x',entityName.charAt(0).toUpperCase() + entityName.slice(1)) +`?`;
                // If that question is already in db, it goes on:
                const questionAlreadyInDb = await dbService.getQuestion({"question": questionText});
                if (!questionAlreadyInDb === undefined) {
                    console.log(`Question ${questionText} already in db, skipping`);
                    continue;
                }

                let correctAnswer = searched_property;
    
                // options will contain 3 wrong answers plus the correct one
                let options;
                try {
                    options = await wikidataService.getProperties(property, language, filter);

                } catch (error) {
                    console.error(`Error generating options for ${entityName}: `, error.message);
                    console.error("Line:", error.stack.split("\n")[1]);
                    continue;
                }
                if (!options) {
                    continue;
                }
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