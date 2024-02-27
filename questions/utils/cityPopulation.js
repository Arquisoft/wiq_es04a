const axios = require('axios');

async function getRandomCity() {
    const consultaSparql = `
        SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
    `;
  
    const urlApiWikidata = 'https://query.wikidata.org/sparql';
    const headers = {
        'User-Agent': 'EjemploCiudades/1.0',
        'Accept': 'application/json',
    };
  
    try {
        const response = await axios.get(`${urlApiWikidata}?query=${encodeURIComponent(consultaSparql)}&format=json`, {
          headers: headers,
        });
  
        const datos = await response.data
        const ciudades = datos.results.bindings;
  
        if (ciudades.length > 0) {
            const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
            const nombreCiudad = ciudadAleatoria.ciudadLabel.value;
            const codigoQ = ciudadAleatoria.ciudad.value.split('/').pop();
            return [nombreCiudad, codigoQ];
        } else {
            return null;
        }

    } catch (error) {
        console.error(`Error al obtener ciudad aleatoria: ${error.message}`);
        return null;
    }
}


async function getCityPopulation(codigoCiudad) {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${codigoCiudad}&property=P1082`;
  
    try {
        //const response = await fetch(url);
        const response = await axios.get(url);
        const data = await response.data;
  
        if (data.claims && data.claims.P1082 && data.claims.P1082[0] && data.claims.P1082[0].mainsnak && data.claims.P1082[0].mainsnak.datavalue && data.claims.P1082[0].mainsnak.datavalue.value && data.claims.P1082[0].mainsnak.datavalue.value.amount) {
            const populationClaim = data.claims.P1082[0].mainsnak.datavalue.value.amount;
            return parseInt(populationClaim);
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener población: ${error.message}`);
        return null;
    }
}

// Función para obtener la población de una ciudad aleatoria con reintentos
async function getPopulationFromRandomCity() {
    const [nombreCiudad, codigoCiudad] = await getRandomCity();
    const poblacion = await getCityPopulation(codigoCiudad);
    return poblacion;
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
    getCityPopulation,
    getPopulationFromRandomCity,
    shuffleArray
};
