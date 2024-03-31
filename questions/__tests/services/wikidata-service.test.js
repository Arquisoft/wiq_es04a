const request = require('supertest');
const axios = require('axios');
const wikidataService = require('../../services/wikidata-service');
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
            FILTER(?property>1000000)
    }
    `;

const consultaSparqlProperties = `
    SELECT DISTINCT ?property
    WHERE {
        ?entity wdt:P31 ?property. 
        ?entity rdfs:label ?entityLabel. 
        FILTER(LANG(?entityLabel) = "en")
    }
    LIMIT 400
`;

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
    mockAxios.reset();
    
  });
describe('Get entity from wikidata', function() {
        it('It should get an entity', async function() {
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
            const response = await wikidataService.getRandomEntity(entity, 0, 1);
            await expect(response[0]).toBe('Madrid');
            await expect(response[1]).toBe('P18');
          });
    it('It should fail when accessing wikidata', async function() {
            mockAxios.onGet(urlApiWikidata, {
                params: {
                  query: consultaSparql,
                  format: 'json' // Debe ser una cadena
                },
                headers: headers,
            }).reply(400,"Error not found");

            const response = await wikidataService.getRandomEntity(entity, 0, 1);
            await expect(response).toBe(null);
    });

    it('It should fail when generating a question', async function() {
        mockAxios.onGet(urlApiWikidata, {
            params: {
              query: consultaSparql,
              format: 'json' // Debe ser una cadena
            },
            headers: headers,
        }).reply(200, 
            { 
                results: {
                bindings: []
            }
            }
        );
        const response = await wikidataService.getRandomEntity(entity, 0, 1);
        await expect(response).toBe(null);
      });

});

describe('Get properties from wikidata', function() {
    /*it('It should get a list of properties', async function() {
        mockAxios.onGet(urlApiWikidata, {
            params: {
              query: consultaSparqlProperties,
              format: 'json' // Debe ser una cadena
            }
        }).reply(200, 
            { 
                results: {
                bindings: [{
                    property: {
                        value: 'P31'
                    }
                }]
            }
            }
        );
        const response = await wikidataService.getProperties('P31', 1);
        await expect(response[0]).toBe('P31');
        await expect(response[1]).toBe('P31');
        await expect(response[2]).toBe('P31');
      });*/
    it('It should fail when accessing wikidata getting properties', async function() {
        mockAxios.onGet(urlApiWikidata, {
            params: {
                query: consultaSparqlProperties,
                format: 'json' // Debe ser una cadena
              }
        }).reply(400,"Error not found");

        const response = await wikidataService.getProperties('P18', 0);
        await expect(response).toBe(null);
    });

    it('It should fail when getting properties', async function() {
    mockAxios.onGet(urlApiWikidata, {
        params: {
            query: consultaSparqlProperties,
            format: 'json' // Debe ser una cadena
          }
    }).reply(200, 
        { 
            results: {
            bindings: []
        }
        }
    );
    const response = await wikidataService.getProperties('P18', 0);
    await expect(response).toBe(null);
   });

});