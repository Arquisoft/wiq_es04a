const express = require('express');
const router = express.Router();
const dbService = require('../mongodatabase/question-data-service');
const { getRandomCity, getCityPopulation, getPopulationFromRandomCity, shuffleArray } = require('../utils/cityPopulation');

// Manejo de la ruta '/question'
router.get('/', async (_req, res) => {
    try {
        const questions = [];
        
        for (let i = 0; i < 5; i++) {
            const [nombreCiudad, codigoQ] = await getRandomCity();
            const poblacion = await getCityPopulation(codigoQ);
    
            if (poblacion !== null) {
                const questionText = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
                const correctAnswer = poblacion;
    
                // Promise devuelve un array de los resultados de todas las promesas
                let options = await Promise.all([
                    getPopulationFromRandomCity(),
                    getPopulationFromRandomCity(),
                    getPopulationFromRandomCity(),
                ]);
    
                // Filtrar los elementos null y llamar a poblacionAleatoria para reemplazarlos
                while (options.some(respuesta => respuesta === null)) {
                    options = await Promise.all(
                        options.map(async (respuesta) => {
                            if (respuesta === null) {
                                return await getPopulationFromRandomCity();
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

// Enter in this url to load sample questoins to db: http://localhost:8010/questions/loadSampleData
router.get('/loadSampleData', async (_req, res) => {
    dbService.addTestData();
});

module.exports = router;
