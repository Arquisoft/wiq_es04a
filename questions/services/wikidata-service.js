const axios = require('axios');

async function getRandomEntity(instance, property, filt) {
    var filter = '';
    if(filt) {
        filter = `FILTER(?property${filt})`;
    }
   
    const consultaSparql = `
        SELECT ?entity ?entityLabel ?property
        WHERE {
            ?entity wdt:P31 wd:${instance};   
                wdt:${property} ?property.   
            ?entity rdfs:label ?entityLabel.  
            FILTER(LANG(?entityLabel) = "es")
            ${filter}
    }
    `;
    // it is better to use the FILTER rather than SERVICE
    //SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
  
    const urlApiWikidata = 'https://query.wikidata.org/sparql';
    const headers = {
        'User-Agent': 'QuestionGeneration/1.0',
        'Accept': 'application/json',
    };
  
    try {
        response = await axios.get(urlApiWikidata, {
            params: {
              query: consultaSparql,
              format: 'json' // Debe ser una cadena
            },
            headers: headers,
          });
  
        const data = await response.data
        const entities = data.results.bindings;
  
        if (entities.length > 0) {
            const randomEntity = entities[Math.floor(Math.random() * entities.length)];
            const entityName = randomEntity.entityLabel.value;
            const property = randomEntity.property.value;
            return [entityName, property];
        } else {
            return null;
        }

    } catch (error) {
        console.error(`Error obtaining random entity: ${error.message}`);
        return null;
    }
}


async function getProperties(property, filt) {
    var filter = '';
    if(filt) {
        filter = `FILTER(?property${filt})`;
    }
    const consultaSparql = `
        SELECT DISTINCT ?property
        WHERE {
            ?entity wdt:${property} ?property. 
            ${filter}  
        }
        LIMIT 400
    `;
    const urlApiWikidata = 'https://query.wikidata.org/sparql';
    try {
        response = await axios.get(urlApiWikidata, {
            params: {
              query: consultaSparql,
              format: 'json' // Debe ser una cadena
            }
        });

        const data = await response.data;
        const list = data.results.bindings;

        if(list.length > 0) {
            const properties = new Array(3);
            for(var i = 0; i < 3 ; i++) {
                properties[i] = list[Math.floor(Math.random() * list.length)].property.value;
            }
            return properties;
        }
        return null;
    } catch (error) {
        console.error(error.stack);
        console.error(`Error obtaining properties: ${error.message}`);
        return null;
    }
}

// return label of a entity
async function getEntityLabel(entityUrl) {
    const apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${entityUrl}`;
    const response = await axios.get(apiUrl);
    const entity = response.data.entities[entityUrl];

    if(entity.labels.es) {
        return entity.labels.es.value;
    } if(entity.labels.en)  {
        return entity.labels.en.value;
    }
    
    return "no label (TEST)";
  }
  
  // Change entities urls to labels
  async function convertUrlsToLabels(options) {
    const newOptions = options.map(url => {
        const match = url.match(/\/Q(\d+)$/);
        return match ? 'Q' + match[1] : null;
      });
    const labels = await Promise.all(newOptions.map(getEntityLabel));
    return labels;
  }

module.exports = {
    getRandomEntity,
    getProperties,
    convertUrlsToLabels
};
