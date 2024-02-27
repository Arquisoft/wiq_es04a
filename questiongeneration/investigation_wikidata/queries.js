const express = require('express');
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

        // Concatenate SPARQL queries
        // const fullQuery = `${consultaSparql1}; ${consultaSparql2}; ${consultaSparql3}; ${consultaSparql4}; ${consultaSparql5};`;
        const fullQuery = `${consultaSparql1}`;

        var startTime = performance.now();
        const response = await axios.post('https://query.wikidata.org/sparql', {
            query: fullQuery,
            format: 'json'
        });
        var endTime = performance.now();
        var duration = endTime - startTime;
        console.log("Fast request: ",response.data);
        console.log("Fast request time: ",duration);
        //const datos = await response.data
        //const ciudades = datos.results.bindings;
  
        /*if (ciudades.length > 0) {
            const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
            const nombreCiudad = ciudadAleatoria.ciudadLabel.value;
            const codigoQ = ciudadAleatoria.ciudad.value.split('/').pop();
            return [nombreCiudad, codigoQ];
        } else {
            return null;
        }*/
    } catch (error) {
        console.error('Error fetching data:', error);
        //return null;
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
       var startTime = performance.now();
        const response = await axios.get(`${urlApiWikidata}?query=${encodeURIComponent(consultaSparql)}&format=json`, {
          headers: headers,
        });
  
        var endTime = performance.now();
        var duration = endTime - startTime;
        console.log("Normal request: ",response.data);
        console.log("Normal request time: ",duration);

       /* const datos = await response.data
        const ciudades = datos.results.bindings;
  
        if (ciudades.length > 0) {
            const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
            const nombreCiudad = ciudadAleatoria.ciudadLabel.value;
            const codigoQ = ciudadAleatoria.ciudad.value.split('/').pop();
            return [nombreCiudad, codigoQ];
        } else {
            return null;
        }*/
    } catch (error) {
        console.error(`Error al obtener ciudad aleatoria: ${error.message}`);
        //return null;
    }
  }

ciudadRandom();
fetchBulkData();

/*
const axios = require('axios');
const SparqlClient = require('sparql-client-2');

// Configuración de la consulta SPARQL
const query = `
    SELECT ?ciudad ?ciudadLabel ?codigoQ
        WHERE {
            ?ciudad wdt:P31 wd:Q515;
                    wdt:P17 wd:Q29;
                    rdfs:label ?ciudadLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
`;

// URL del punto de consulta SPARQL de Wikidata
const endpointUrl = 'https://query.wikidata.org/sparql';

// Configuración del cliente SPARQL
const client = new SparqlClient({ endpointUrl });

// Ejecución de la consulta SPARQL
client.query.select(query).execute()
    .then(response => {
        console.log('Resultados de la consulta:');
        console.log(response.results.bindings);
    })
    .catch(error => {
        console.error('Error al ejecutar la consulta SPARQL:', error);
    });
*/

const consultaSparql1 = `
        SELECT ?item ?itemLabel ?stadium ?country ?population
        WHERE {
            ?item wdt:P31 wd:Q476028;
                  wdt:P115 ?stadium;
                  wdt:P17 ?country.
            ?item rdfs:label ?itemLabel.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        }
    `;