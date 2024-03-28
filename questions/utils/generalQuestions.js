const fs = require('fs').promises;

async function readFromFile(filePath) {
    try {
        const jsonData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error al leer el archivo JSON: ${error.message}`);
        return null;
    }
}

// Función para desordenar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {
    readFromFile,
    shuffleArray
};
