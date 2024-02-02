import fetch from 'node-fetch';

// Código de ejemplo para generar preguntas usando la plantilla: ¿Cuál es la población de x? (dónde x es una ciudad aleatoria).
// Empleamos await para facilitar el manejo de código asíncrono y facilitar la lectura del código, ya q la alternativa con then 
// queda menos legible.

// Habria que mejorarlo para mejorar el rendimiento (tarda demasiado en generar las preguntas y respuestas)

// Habria que mejorarlo para asegurarse que todas las ciudades generadas tienen disponibles los datos de poblacion, 
// buscar otra ciudad si esa falla...

// Habria que filtrar ciudades con un numero minimo de habitantes para que las ciudades sean conocidas y no pueblos perdidos 
// que nadie conoce...

class GeneradorDePreguntasDeCiudades {

    // Función para obtener una ciudad aleatoria
    async ciudadRandom() {
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
            const response = await fetch(`${urlApiWikidata}?query=${encodeURIComponent(consultaSparql)}&format=json`, {
                headers: headers,
            });
    
            const datos = await response.json();
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
    async obtenerPoblacionCiudad(codigoCiudad) {
        const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${codigoCiudad}&property=P1082`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
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
    async poblacionCiudadAleatoria() {
        const [nombreCiudad, codigoCiudad] = await this.ciudadRandom();
        const poblacion = await this.obtenerPoblacionCiudad(codigoCiudad);
        return poblacion;
    }

    // Función principal
    async ejecutarGenerador() {
        try {
            const [nombreCiudad, codigoQ] = await this.ciudadRandom();
            const poblacion = await this.obtenerPoblacionCiudad(codigoQ);

            if (poblacion !== null) {
                const pregunta = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
                const respuestaReal = `SOLUCION: La población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)} es ${poblacion.toLocaleString()}.`;

                // Promise devuelve un array un array de los resultados de todas las promesas, en el mismo orden en que se 
                // proporcionaron, una vez que todas las promesas en el iterable se han resuelto
                const respuestasAleatorias = await Promise.all([
                    this.poblacionCiudadAleatoria(),
                    this.poblacionCiudadAleatoria(),
                    this.poblacionCiudadAleatoria(),
                ]);

                const [respuestaA, respuestaB, respuestaC] = respuestasAleatorias;

                if (respuestaA !== null && respuestaB !== null && respuestaC !== null) {
                    this.mostrarPreguntasRespuestas(pregunta, respuestaReal, respuestaA, respuestaB, respuestaC, poblacion);
                } else {
                    await this.ejecutarGenerador();
                }
            } else {
                await this.ejecutarGenerador();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Función para imprimir por pantalla las preguntas y las respuestas
    mostrarPreguntasRespuestas(pregunta, respuestaReal, respuestaA, respuestaB, respuestaC, respuestaD) {
        console.log(pregunta);
        console.log(respuestaReal);
        console.log("a)" + respuestaA);
        console.log("b)" + respuestaB);
        console.log("c)" + respuestaC);
        console.log("d)" + respuestaD);
    }
}

// Ejemplo de ejecución
var generadorDePreguntas = new GeneradorDePreguntasDeCiudades();
generadorDePreguntas.ejecutarGenerador();