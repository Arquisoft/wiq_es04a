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
  async function obtenerPoblacionCiudad() {
    const consultaSparql = `
    SELECT ?population
    WHERE {
        ?city wdt:P1082 ?population.   
        FILTER(?population > 100000).
    }
    ORDER BY RAND()
    LIMIT 3
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
          //populations[i] = list[Math.floor(Math.random() * list.length)].population.value;
          populations[i] = list[i].population.value;
        }
        return populations;
      }
      return null;
    } catch (error) {
        console.error(`Error al obtener población: ${error.message}`);
        return null;
    }
  }
 
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function option2(_req, res) {
    const inicio = performance.now();
    const questions = [];
      
      for (let i = 0; i < 1; i++) {
        const [nombreCiudad, codigoQ, population] = await ciudadRandom();
        //const poblacion = await obtenerPoblacionCiudad(codigoQ);
        const poblacion = population;
        if (poblacion !== null) {
          const questionText = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
          const correctAnswer = poblacion;
          const options = [];
          for(var j = 0; j < 3 ; j++) {
            const [,,res] = await ciudadRandom();
            options.push(res);
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
          res.json(questions);
        }
      }
      const fin = performance.now();
      console.log("Time option 2: ",fin-inicio);
  }
  
  async function option3(_req, res) {
    const inicio = performance.now();
    const questions = [];
      
      for (let i = 0; i < 1; i++) {
        const [nombreCiudad, codigoQ, population] = await ciudadRandom();
        //const poblacion = await obtenerPoblacionCiudad(codigoQ);
        const poblacion = population;
        if (poblacion !== null) {
          const questionText = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
          const correctAnswer = poblacion;
          
          const options = await obtenerPoblacionCiudad();
          
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
          res.json(questions);
        }
      }
      const fin = performance.now();
      console.log("Time option 3: ",fin-inicio);
  }
  
  app.get('/question', async (_req, res) => {
    try {
      //await option1(_req, res);
      await option3(_req, res);
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