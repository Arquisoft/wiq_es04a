const request = require('supertest');
const axios = require('axios');
const generator = require('../../services/generate-questions-service');
const MockAdapter = require('axios-mock-adapter');

const mockAxios = new MockAdapter(axios);

const urlApiWikidata = 'https://query.wikidata.org/sparql';
const headers = {
    'User-Agent': 'QuestionGeneration/1.0',
    'Accept': 'application/json',
};
const consultaSparql = `
        SELECT ?entity ?entityLabel ?property
        WHERE {
            ?entity wdt:P31 wd:Q6256;   
                wdt:P1082 ?property.   
            ?entity rdfs:label ?entityLabel.  
            FILTER(LANG(?entityLabel) = "en")
    }
    `;

describe('Question generation', function() {
    it('It should generate a question', async function() {
        mockAxios.reset();

        mockAxios.onGet(urlApiWikidata, {
            params: {
              query: consultaSparql,
              format: 'json' // Debe ser una cadena
            },
            headers: headers,
        }).reply(200, 
            { 
                results: {
                bindings: [{
                    entityLabel: {
                        value: 'Madrid'
                    },
                    property: {
                        value: 'P18'
                    }
                }]
            }
            }
        );
        const response = await generator.generateQuestions(1);
        console.log(response);
        //await expect(response.).toBe(200);
        //await expect(response.body.question).toBe('Which is the capital of Spain?');*/
      });
});