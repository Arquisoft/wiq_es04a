import requests
import random

# Codigo de ejemplo para generar plantillas de preguntas

# Habria que mejorarlo para asegurarse que todas las ciudades generadas
# tienen disponibles los datos de poblacion, buscar otra ciudad si esa falla...

# Habria que filtrar ciudades con un numero minimo de habitantes para
# que las ciudades sean conocidas y no pueblos perdidos que nadie conoce...

def ciudad_random():

     # Consulta SPARQL para obtener ciudades de España
     # SPARQL es un lenguaje de consulta para conjuntos de datos

    consulta_sparql = """
    SELECT ?ciudad ?ciudadLabel ?codigoQ
    WHERE {
      ?ciudad wdt:P31 wd:Q515;
              wdt:P17 wd:Q29;
              rdfs:label ?ciudadLabel.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
    """

    # URL de la API de Wikidata
    url_api_wikidata = "https://query.wikidata.org/sparql"

    # Encabezados para la solicitud HTTP
    headers = {
        "User-Agent": "EjemploCiudades/1.0",
        "Accept": "application/json"
    }

    # Realizar la solicitud HTTP con la consulta SPARQL
    respuesta = requests.get(url_api_wikidata, headers=headers, params={"query": consulta_sparql, "format": "json"})

    # Parsear la respuesta JSON
    datos = respuesta.json()

    # Extraer información
    ciudades = datos.get("results", {}).get("bindings", [])

    if ciudades:
        ciudad_aleatoria = random.choice(ciudades)
        nombre_ciudad = ciudad_aleatoria["ciudadLabel"]["value"]
        codigo_q = ciudad_aleatoria["ciudad"]["value"]
        codigo_q = codigo_q.split("/")[-1]
        #print(f"Ciudad aleatoria de España: {nombre_ciudad}")
    else:
        print("No se encontraron ciudades.")

    print(codigo_q + "\n")
    return nombre_ciudad, codigo_q

def obtener_informacion_ciudad(codigo_ciudad):

    # Consulta a la API de Wikidata para obtener información detallada sobre la ciudad
    url = f"https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity={codigo_ciudad}&property=P1082"
    response = requests.get(url)
    data = response.json()

    # Extraer la población de la ciudad desde la respuesta
    population_claim = data["claims"]["P1082"][0]["mainsnak"]["datavalue"]["value"]["amount"]
    return int(population_claim)


# Ejemplo de uso
nombre_ciudad, codigo_q = ciudad_random()
poblacion = obtener_informacion_ciudad(codigo_q)

# Plantilla para pregunta y respuesta
pregunta = f"¿Cuál es la población de {nombre_ciudad.capitalize()}?"
respuesta = f"La población de {nombre_ciudad.capitalize()} es {poblacion:,} habitantes."

print(pregunta)
print(respuesta)

