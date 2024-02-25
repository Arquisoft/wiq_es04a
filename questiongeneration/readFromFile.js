const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

async function request(object) {
  var props = "";
  var wdt;
  var wd;
  var values = [];
  const items = [];
  for(var i = 0; i < object.properties.length; i++) {
    wdt = object.properties[i].wdt;
    wd = object.properties[i].wd;
    if(!wdt) {
        wdt = "?item"+i;
        items.push("item"+i);
    } else { wdt = "wdt:"+wdt + " ";}
    if(!wd) {
        wd = "?value"+i;
        values.push("value"+i);
    } else { wd = "wd:"+wd;}
    props += wdt + wd + ";\n";
  }
  var value = "value"+object.properties.length;
  values.push(value);
  props += "wdt:" + object.discriminator + " ?" + value + ".";

  var str_items = "?item ?itemlabel ";
  for(var j = 0; j < items.length; j++) {
    str_items += "?"+items[i]+" ";
  }

  var str_values = "";
  for(var j = 0; j < values.length; j++) {
    str_values += "?"+values[j]+" ";
  }
 var requestSparql = ``;
  requestSparql += 
  `SELECT `+str_items+str_values+`
    WHERE {
      ?item `+props+` 
      ?item rdfs:label ?itemLabel.  
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
  `;
  return requestSparql;
}

function readFileAndExecute() {
    // Ruta al archivo JSON
    const rutaArchivo = './questions.json';
    var contenido;
    // Leer el contenido del archivo
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return;
      }
      // Parsear el contenido JSON
      const contenidoJSON = JSON.parse(data);
      contenido = contenidoJSON;

      var [nombre, value1] = executeRequest(contenido[0]);
      //console.log(query);
      return [contenido[0], nombre, value1];
    });
   
}

async function executeRequest(object) {
  const urlApiWikidata = 'https://query.wikidata.org/sparql';
  const headers = {
      'User-Agent': 'EjemploCiudades/1.0',
      'Accept': 'application/json',
  };
  try {
    var fullquery = await request(object);
    console.log(fullquery);
    response = await axios.get(urlApiWikidata, {
      params: {
        query: fullquery,
        format: 'json' // Debe ser una cadena
      }
    });
    const datos = await response.data;
    const items = datos.results.bindings;

    if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        const nombre = randomItem.itemLabel;
        const value1 = randomItem.value1;
        return [nombre, value1];
    } else {
        return null;
    }
  } catch (error) {
    console.error(`Error al obtener ciudad aleatoria: ${error.message}`);
    return null;
  }
}

async function option4(_req, res) {

  const inicio = performance.now();
  const questions = [];
    
    for (let i = 0; i < 5; i++) {
      var [object, nombre, value] = readFileAndExecute();
      //const poblacion = await obtenerPoblacionCiudad(codigoQ);
      const poblacion = value;
      if (poblacion !== null) {
        const questionText = object.question.replace('x',nombre.charAt(0).toUpperCase() + nombre.slice(1));
        const correctAnswer = poblacion;
        
        const [nombre2, value2] = await executeRequest(object);
        
        var options = [];
        options.push(correctAnswer);
        options.push(value2);

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

    const fin = performance.now();
    console.log("Time option 4: ",fin-inicio);
}
module.exports = {option4};
