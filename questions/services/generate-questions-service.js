const utils = require('../utils/generalQuestions');
const wikidataService = require('./wikidata-service');
const dbService = require('./question-data-service')

/**
 * Asynchronously generates a specified number of questions using data from the JSON file and stores them in the DB.
 * 
 * @param {number} n - The number of questions to generate.
 * @returns {Promise<void>} A Promise that resolves when all questions are generated.
 */
async function generateQuestions(n, questionCategory) {
    try {
        let json = await utils.readFromFile("../questions/utils/question.json");
        questionCategory="Political"
        //generate only questions from selected category
        if (questionCategory) {
            json = json.filter(obj => obj.properties.some(prop => prop.category.includes(questionCategory)));
        }

        for (let i = 0; i < n; i++) {
            //Gets random template
            const randomIndex = Math.floor(Math.random() * json.length);
            const entity = json[randomIndex];

            // get data for selected entity
            /*let pos;
            if(questionCategory) {
                const filteredProperties = json.flatMap(obj => obj.properties.filter(prop => prop.category.includes(questionCategory)));
                pos = Math.floor(Math.random() * filteredProperties.length);
                filteredProperties[pos];
            } else {
                pos = Math.floor(Math.random() * entity.properties.length);
            }*/
            let pos = Math.floor(Math.random() * entity.properties.length);
            let propertyJson = entity.properties[pos];
            if(questionCategory) {
                const filteredProperties = json.flatMap(obj => obj.properties.filter(prop => prop.category.includes(questionCategory)));
                const randomPos = Math.floor(Math.random() * filteredProperties.length);
                propertyJson = filteredProperties[randomPos];
                const posForRandomProperty = entity.properties.findIndex(prop => prop === propertyJson);
                console.log(entity.properties[posForRandomProperty])
                pos = posForRandomProperty;
            }
            console.log(propertyJson)
            const property = entity.properties[pos].property;
            const categories = entity.properties[pos].category;
            const filter = entity.properties[pos].filter;
            const lang = 1 ; //english
            const question = entity.properties[pos].template[lang].question;
            const language = entity.properties[pos].template[lang].lang;

            //let [entityName, searched_property] = await wikidataService.getRandomEntity(instance, property, filter);
            let [entityName, searched_property] = await wikidataService.getRandomEntity(entity, pos, lang);

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
                    categories: categories
                };

                dbService.addQuestion(newQuestion);

            }
        }
    } catch (error) {
        console.error("Error generating questions: ", error.message);
    }
}

module.exports = {
    generateQuestions
};