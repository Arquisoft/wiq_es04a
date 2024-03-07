const fetch = require('node-fetch');
const { wbk } = require('wikibase-sdk');

// Configura la URL base de la API de Wikidata
const wikidataEndpoint = 'https://www.wikidata.org/w/api.php';

// Función para hacer la consulta bulk
async function bulkQuery(entityIds, propertyIds) {
    const formattedEntityIds = entityIds.join('|');
    const formattedPropertyIds = propertyIds.join('|');
    const sparqlQuery = `
      SELECT ?item ?itemLabel ?property ?propertyLabel WHERE {
        VALUES ?item {${formattedEntityIds}}
        VALUES ?property {${formattedPropertyIds}}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }
    `;
    const url = wbk.sparqlQuery(sparqlQuery);
    const response = await fetch(url);
    const data = await response.json();
    return data.results.bindings;
  }
  
  function option5() {
// IDs de las entidades y propiedades que deseas consultar
const entityIds = ['Q515']; // Ejemplo de IDs de entidades
const propertyIds = ['P31', 'P1082']; // Ejemplo de IDs de propiedades

// Realizar la consulta bulk
bulkQuery(entityIds, propertyIds)
  .then(results => {
    console.log('Resultados de la consulta bulk:');
    console.log(results);
  })
  .catch(error => {
    console.error('Error al realizar la consulta bulk:', error);
  });

  }

  module.exports = {option5};
  