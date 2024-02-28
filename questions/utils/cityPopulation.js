const axios = require('axios');

async function getRandomCity() {
    const consultaSparql = `
        SELECT ?city ?cityLabel ?population
        WHERE {
            ?city wdt:P31 wd:Q515;   
                wdt:P1082 ?population.   
            ?city rdfs:label ?cityLabel.  
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
            FILTER(?population > 100000).
    }
    `;
  
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
        const cities = data.results.bindings;
  
        if (cities.length > 0) {
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const cityName = randomCity.cityLabel.value;
            const population = randomCity.population.value;
            return [cityName, population];
        } else {
            return null;
        }

    } catch (error) {
        console.error(`Error al obtener ciudad aleatoria: ${error.message}`);
        return null;
    }
}


async function getCitiesPopulation() {
    const consultaSparql = `
        SELECT ?population
        WHERE {
            ?city wdt:P1082 ?population.   
            FILTER(?population > 100000).
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
            const populations = new Array(3);
            for(var i = 0; i < 3 ; i++) {
              populations[i] = list[Math.floor(Math.random() * list.length)].population.value;
            }
            return populations;
        }
        return null;
    } catch (error) {
        console.error(`Error al obtener población: ${error.message}`);
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
    getRandomCity,
    getCitiesPopulation,
    shuffleArray
};
