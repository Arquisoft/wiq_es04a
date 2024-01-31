import requests
import random

def ciudad_random():

     # Consulta SPARQL para obtener ciudades de España
     # SPARQL es un lenguaje de consulta para conjuntos de datos

    consulta_sparql = """
    SELECT ?ciudad ?ciudadLabel ?codigoQ
    WHERE {
      ?ciudad wdt:P31 wd:Q515;
              wdt:P17 wd:Q29;
              wdt:P646 ?codigoQ.
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
        codigoQ = ciudad_aleatoria["codigoQ"]["value"]
        print(f"Ciudad aleatoria de España: {nombre_ciudad}")
    else:
        print("No se encontraron ciudades.")

        print(codigoQ + "codigoq")
        return codigoQ

def obtener_informacion_ciudad(nombre_ciudad_q):
    # Consulta a la API de Wikidata para obtener información sobre la ciudad
    #url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&titles={nombre_ciudad}&sites=enwiki"
    #response = requests.get(url)
    #data = response.json()

    # Extraer el ID de la entidad de la ciudad desde la respuesta
    #city_id = list(data["entities"].keys())[0]

    # Consulta a la API de Wikidata para obtener información detallada sobre la ciudad
    url = f"https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity={nombre_ciudad_q}&property=P1082"
    response = requests.get(url)
    data = response.json()

    # Extraer la población de la ciudad desde la respuesta
    population_claim = data["claims"]["P1082"][0]["mainsnak"]["datavalue"]["value"]["amount"]
    return int(population_claim)

# Ejemplo de uso
nombre_ciudad_q = "Q14317"  # Puedes reemplazar con el nombre de la ciudad que estás buscando
poblacion = obtener_informacion_ciudad(nombre_ciudad_q)

# Plantilla para pregunta y respuesta
pregunta = f"¿Cuál es la población de {nombre_ciudad_q.capitalize()}?"
respuesta = f"La población de {nombre_ciudad_q.capitalize()} es {poblacion:,} habitantes."

print(pregunta)
print(respuesta)

print(ciudad_random())
