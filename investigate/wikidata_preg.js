import fetch from 'node-fetch';

// Código de ejemplo para generar preguntas usando la plantilla: ¿Cuál es la población de x? (dónde x es una ciudad aleatoria).

class GeneradorDePreguntasDeCiudades {

    // Función para obtener una ciudad aleatoria
    ciudadRandom() {
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
    
        return fetch(`${urlApiWikidata}?query=${encodeURIComponent(consultaSparql)}&format=json`, {
            headers: headers,
        })
        .then(response => response.json())
        .then(datos => {
            const ciudades = datos.results.bindings;
    
            if (ciudades.length > 0) {
                const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
                const nombreCiudad = ciudadAleatoria.ciudadLabel.value;
                const codigoQ = ciudadAleatoria.ciudad.value.split('/').pop();
                return [nombreCiudad, codigoQ];
            } else {
                console.log('No se encontraron ciudades.');
                return null;
            }
        });
    }

    // Función para obtener la población de una ciudad
    obtenerPoblacionCiudad(codigoCiudad) {
        const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${codigoCiudad}&property=P1082`;
        return fetch(url)
        .then(response => response.json())
        .then(data => {
            const populationClaim = data.claims.P1082[0].mainsnak.datavalue.value.amount;
            return parseInt(populationClaim);
        });
    }

    // Función para obtener la población de una ciudad aleatoria con reintentos
    poblacionCiudadAleatoria() {
        const intentosMaximos = 25;
        let intentos = 0;
    
        const intentarObtenerPoblacion = () => {
            return this.ciudadRandom()
            .then(([nombreCiudad, codigoCiudad]) => {
                return this.obtenerPoblacionCiudad(codigoCiudad);
            })
            .catch(error => {
                intentos += 1;
                if (intentos < intentosMaximos) {
                    return intentarObtenerPoblacion();
                } else {
                    throw new Error('No se pudo obtener la población después de varios intentos.');
                }
            });
        };
    
        return intentarObtenerPoblacion();
    }

    // Función principal
    main() {
        return this.ciudadRandom()
        .then(([nombreCiudad, codigoQ]) => {
            return this.obtenerPoblacionCiudad(codigoQ)
            .then(poblacion => {
                const pregunta = `¿Cuál es la población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)}?`;
                const respuestaReal = `SOLUCION: La población de ${nombreCiudad.charAt(0).toUpperCase() + nombreCiudad.slice(1)} es ${poblacion.toLocaleString()} habitantes.`;
    
                return this.poblacionCiudadAleatoria()
                .then(respuestaA => {
                    const respuestaB = this.poblacionCiudadAleatoria();
                    const respuestaC = this.poblacionCiudadAleatoria();
                    const respuestaD = poblacion;
    
                    console.log(pregunta);
                    console.log(respuestaReal);
                    console.log("a)" + respuestaA);
                    console.log("b)" + respuestaB);
                    console.log("c)" + respuestaC);
                    console.log("d)" + respuestaD);
                });
            });
        });
    }

}

var generadorDePreguntas = new GeneradorDePreguntasDeCiudades();
generadorDePreguntas.main();