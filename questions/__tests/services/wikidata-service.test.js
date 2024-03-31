const axios = require('axios');
const wikidataService = require('../../services/wikidata-service');
const MockAdapter = require('axios-mock-adapter');

const mockAxios = new MockAdapter(axios);

const urlApiWikidata = 'https://query.wikidata.org/sparql';

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
            mockAxios.onGet(urlApiWikidata).reply(200, 
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
            mockAxios.onGet(urlApiWikidata).reply(400,"Error not found");

            const response = await wikidataService.getRandomEntity(entity, 0, 1);
            await expect(response).toBe(null);
    });

    it('It should fail when generating a question', async function() {
        mockAxios.onGet(urlApiWikidata).reply(200, 
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
    it('It should get a list of properties', async function() {
        mockAxios.onGet(urlApiWikidata).reply(200, 
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
      });
    it('It should fail when accessing wikidata getting properties', async function() {
        mockAxios.onGet(urlApiWikidata).reply(400,"Error not found");

        const response = await wikidataService.getProperties('P18', 0);
        await expect(response).toBe(null);
    });

    it('It should fail when getting properties', async function() {
    mockAxios.onGet(urlApiWikidata).reply(200, 
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