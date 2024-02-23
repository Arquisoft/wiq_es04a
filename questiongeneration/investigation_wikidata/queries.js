const axios = require('axios');

async function fetchBulkData() {
    try {
        const consultaSparql1 = `
        SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }`;
        const consultaSparql2 = `
        SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }`;
        const consultaSparql3 = `
        SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }`;
    const consultaSparql4 = `
        SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
    `;
    const consultaSparql5 = `
        SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
    `;

        // Concatenate SPARQL queries
        // const fullQuery = `${consultaSparql1}; ${consultaSparql2}; ${consultaSparql3}; ${consultaSparql4}; ${consultaSparql5};`;
        const fullQuery = `${consultaSparql1}`;

        const response = await axios.post('https://query.wikidata.org/sparql', {
            query: fullQuery,
            format: 'json'
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
        console.error('Error fetching data:', error);
        return null;
    }
}

async function ciudadRandom() {
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
       // const response = await fetch(`${urlApiWikidata}?query=${encodeURIComponent(consultaSparql)}&format=json`, {
       //     headers: headers,
       // });
  
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


var before = new Date();
console.log(ciudadRandom());
console.log(new Date()-before);

before = new Date();
console.log(fetchBulkData());
console.log(new Date()-before);
