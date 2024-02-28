const axios = require('axios');
const fs = require('fs').promises;

async function readFromFile(filePath) {
    try {
        const jsonData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error al leer el archivo JSON: ${error.message}`);
        return null;
    }
}


async function getRandomEntity(instance, property) {
    const consultaSparql = `
        SELECT ?entity ?entityLabel ?property
        WHERE {
            ?entity wdt:P31 wd:${instance};   
                wdt:${property} ?property.   
            ?entity rdfs:label ?entityLabel.  
            FILTER(LANG(?entityLabel) = "es")
    }
    `;
    // it is better to use the FILTER rather than SERVICE
    //SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
  
    const urlApiWikidata = 'https://query.wikidata.org/sparql';
    const headers = {
        'User-Agent': 'EjemploCiudades/1.0',
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
        console.error(`Error al obtener entidad aleatoria: ${error.message}`);
        return null;
    }
}


async function getProperties(property) {
    const consultaSparql = `
        SELECT ?property
        WHERE {
            ?entity wdt:${property} ?property.   
        }
    `;
    const urlApiWikidata = 'https://query.wikidata.org/sparql';
    try {
        response = await axios.get(urlApiWikidata, {
            params: {
              query: consultaSparql,
              format: 'json' // Debe ser una cadena
            }});
        const data = await response.data;
        const list = data.results.bindings;

        if(list.length>0) {
            const properties = new Array(3);
            for(var i = 0; i < 3 ; i++) {
                properties[i] = list[Math.floor(Math.random() * list.length)].property.value;
            }
            return properties;
        }
        return null;
    } catch (error) {
        console.error(`Error al obtener propiedades: ${error.message}`);
        return null;
    }
}

// Función para desordenar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {
    readFromFile,
    getRandomEntity,
    getProperties,
    shuffleArray
};
