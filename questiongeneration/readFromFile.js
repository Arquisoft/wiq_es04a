const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

async function request() {
// Ruta al archivo JSON
const rutaArchivo = './questions.json';

// Leer el contenido del archivo
fs.readFile(rutaArchivo, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }
  // Parsear el contenido JSON
  const contenidoJSON = JSON.parse(data);
  const object = contenidoJSON[0];
  const question = object.question;
  console.log(question);
  var props;
  var wdt;
  var wd;
  var values = [];
  const items = [];
  for(var i = 0; i < object.properties.length; i++) {
    wdt = object.properties[i].wdt;
    wd = object.properties[i].wd;
    if(wdt==null) {
        wdt = "item"+i+"?";
        items.push("item"+i);
    } else { wdt = "wdt:"+wdt;}
    if(wd==null) {
        wd = "value"+i+"?";
        values.push("value"+i);
    } else { wd = "wd:"+wd;}
    props += wdt + wd + ";";
  }

  const requestSparql = `
    SELECT ?item ?itemLabel ?value1
    WHERE {
      ?item `+props+` 
      ?item rdfs:label ?itemLabel.  
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
  `;
  console.log(requestSparql);
});
}

async function option4(_req, res) {
    
      const urlApiWikidata = 'https://query.wikidata.org/sparql';
      const headers = {
          'User-Agent': 'EjemploCiudades/1.0',
          'Accept': 'application/json',
      };
    
      try {
          const fullQuery = `${request()}`;
  
          response = await axios.get(urlApiWikidata, {
            params: {
              query: fullQuery,
              format: 'json' // Debe ser una cadena
            },
            headers: headers,
          });
          const datos = await response.data;
          const ciudades = datos.results.bindings.filter(result => result.city);
    
          if (ciudades.length > 0) {
              const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
              const nombreCiudad = ciudadAleatoria.cityLabel.value;
              //const codigoQ = ciudadAleatoria.city.value.split('/').pop();
              const population = ciudadAleatoria.population.value;
              return [nombreCiudad, population];
          } else {
              return null;
          }
      } catch (error) {
          console.error(`Error al obtener ciudad aleatoria: ${error.message}`);
          return null;
      }
      // Hacer algo con el contenido JSON
    }

    module.exports = {request};