const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

//////////////This should not be here///////////////////////////////
const questions = [
  {
    id: 1,
    question: '¿Cuál es la capital de Francia?',
    options: ['Roma', 'Madrid', 'París', 'Londres'],
    correctAnswer: 'París',
  },
  {
    id: 2,
    question: '¿Cuál es la capital de Asturias?',
    options: ['Llanes', 'Avilés', 'Gijón', 'Oviedo'],
    correctAnswer: 'Oviedo',
  },
  {
    id: 3,
    question: '¿En qué año comenzó la Segunda Guerra Mundial?',
    options: ['1935', '1938', '1941', '1939'],
    correctAnswer: '1939',
  },
  {
    id: 4,
    question: '¿Cuál es el río más largo del mundo?',
    options: ['Nilo', 'Amazonas', 'Misisipi', 'Yangtsé'],
    correctAnswer: 'Amazonas',
  }
];

app.get('/questions', (_req, res) => {
  //const randomIndex = Math.floor(Math.random() * questions.length);
  //const randomQuestion = questions[randomIndex];
  
  res.json(questions);
});

// Función para obtener una ciudad aleatoria
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

// Función para obtener la población de una ciudad
async function obtenerPoblacionCiudad(codigoCiudad) {
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
async function poblacionCiudadAleatoria() {
  const [nombreCiudad, codigoCiudad] = await ciudadRandom();
  const poblacion = await obtenerPoblacionCiudad(codigoCiudad);
  return poblacion;
}

// Función principal
async function ejecutarGenerador() {
  try {
      const [nombreCiudad, codigoQ] = await ciudadRandom();
      const poblacion = await obtenerPoblacionCiudad(codigoQ);

      if (poblacion !== null) {
          const pregunta = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
          const respuestaReal = `SOLUCION: La población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)} es ${poblacion.toLocaleString()}.`;

          // Promise devuelve un array un array de los resultados de todas las promesas
          const respuestasAleatorias = await Promise.all([
              poblacionCiudadAleatoria(),
              poblacionCiudadAleatoria(),
              poblacionCiudadAleatoria(),
          ]);

          const [respuestaA, respuestaB, respuestaC] = respuestasAleatorias;

          if (respuestaA !== null && respuestaB !== null && respuestaC !== null) {
              mostrarPreguntasRespuestas(pregunta, respuestaReal, respuestaA, respuestaB, respuestaC, poblacion);
          } else {
              await ejecutarGenerador();
          }
      } else {
          await ejecutarGenerador();
      }
  } catch (error) {
      console.error(error);
  }
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
    
    for (let i = 0; i < 5; i++) {
      const [nombreCiudad, codigoQ] = await ciudadRandom();
      const poblacion = await obtenerPoblacionCiudad(codigoQ);

      if (poblacion !== null) {
        const questionText = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
        const correctAnswer = poblacion;

        // Promise devuelve un array de los resultados de todas las promesas
        let options = await Promise.all([
          poblacionCiudadAleatoria(),
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

//////TODO:refactor to another service/////////////////

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
