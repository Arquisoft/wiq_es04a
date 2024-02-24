const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8010;

app.use(cors());
app.use(express.json());

// Función para obtener una ciudad aleatoria
async function ciudadRandom() {
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
  
    const consultaSparql2 = `
    SELECT ?city ?cityLabel  ?codigoQ ?population
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
        const fullQuery = `${consultaSparql2}`;

        response = await axios.get(urlApiWikidata, {
          params: {
            query: fullQuery,
            format: 'json' // Debe ser una cadena
          },
          headers: headers,
        });
        const datos = await response.data;
        //console.log(datos);
        const ciudades = datos.results.bindings.filter(result => result.city);
        //const teams = datos.filter(result => result.hasOwnProperty("team"));
  
        if (ciudades.length > 0) {
            const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
            const nombreCiudad = ciudadAleatoria.cityLabel.value;
            const codigoQ = ciudadAleatoria.city.value.split('/').pop();
            const population = ciudadAleatoria.population.value;
            console.log(ciudadAleatoria);
            //console.log(nombreCiudad);
            return [nombreCiudad, codigoQ, population];
        } else {
            //return null;
        }

        /*if(teams.length > 0) {
          const randomTeam = teams[Math.floor(Math.random() * teams.length)];
          console.log(randomTeam);
        }*/
    } catch (error) {
        console.error(`Error al obtener ciudad aleatoria: ${error.message}`);
        //return null;
    }
  }
  
  // Función para obtener la población de una ciudad
  async function obtenerPoblacionCiudad(codigoCiudad) {
    const consultaSparql = `
    SELECT ?city ?cityLabel  ?codigoQ ?population
    WHERE {
        ?city wdt:P31 wd:Q515;   
              wdt:P1082 ?population.   
        ?city rdfs:label ?cityLabel.  
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
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
        
    } catch (error) {
        console.error(`Error al obtener población: ${error.message}`);
        return null;
    }
  }
  
  // Función para obtener la población de una ciudad aleatoria con reintentos
  async function poblacionCiudadAleatoria() {
    const [nombreCiudad, codigoCiudad] = await ciudadRandom();
    const poblacion = await obtenerPoblacionCiudad(codigoCiudad);
    return poblacion;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  app.get('/question', async (_req, res) => {
    try {
      const questions = [];
      
      for (let i = 0; i < 1; i++) {
        const [nombreCiudad, codigoQ, population] = await ciudadRandom();
        //const poblacion = await obtenerPoblacionCiudad(codigoQ);
        const poblacion = population;
        if (poblacion !== null) {
          const questionText = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
          const correctAnswer = poblacion;
  
          // Promise devuelve un array de los resultados de todas las promesas
          let options = await Promise.all([
            ciudadRandom().population,
            poblacionCiudadAleatoria(),
            poblacionCiudadAleatoria(),
          ]);
  
          // Filtrar los elementos null y llamar a poblacionAleatoria para reemplazarlos
          while (options.some(respuesta => respuesta === null)) {
            options = await Promise.all(
              options.map(async (respuesta) => {
                if (respuesta === null) {
                  return await poblacionCiudadAleatoria();
                } else {
                  return respuesta;
                }
              })
            );
          }
  
          options.push(correctAnswer);
  
          // Desordenar las opciones
          const shuffledOptions = shuffleArray(options);
  
          // Crear el objeto de pregunta
          const newQuestion = {
            id: i,
            question: questionText,
            options: shuffledOptions,
            correctAnswer: correctAnswer,
          };
  
          questions.push(newQuestion);
        }
      }
  
      res.json(questions);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  });
  
  // Start the gateway service
  const server = app.listen(port, () => {
    console.log(`Question Generation Service listening at http://localhost:${port}`);
  });
  
  module.exports = server