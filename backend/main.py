from ast import AsyncFor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import coleccion_inmuebles 
from models.inmueble import Inmueble
from bson import ObjectId

app = FastAPI()

# Esto permite que tu HTML (Frontend) hable con tu Python (Backend)
app.add_middleware(CORSMiddleware,
   
    allow_origins=["*"], # Permitir todas las conexiones por ahora
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/inmuebles")
async def obtener_inmuebles():
    inmuebles = []
    # Buscamos todos los documentos en la colección
    async for documento in coleccion_inmuebles.find():
        # Convertimos el ID de MongoDB a texto normal
        documento["id"] = str(documento["_id"])
        del documento["_id"]
        inmuebles.append(documento)
    return inmuebles

# Aquí es donde luego "conectaremos" las rutas de inmuebles

# 2. Ruta para GUARDAR un inmueble (POST)
@app.post("/inmuebles")
async def crear_inmueble(inmueble:Inmueble):
    # Convertimos el objeto de Python a un diccionario para MongoDB
    nuevo_inmueble = inmueble.dict()
    # Lo insertamos en la base de datos
    resultado = await coleccion_inmuebles.insert_one(nuevo_inmueble)
    return {"mensaje": "Inmueble guardado con éxito", "id": str(resultado.inserted_id)}


@app.delete("/inmuebles/{id}")
async def eliminar_inmueble(id: str):
    resultado = await inmuebles_col.delete_one({"_id": ObjectId(id)})
    if resultado.deleted_count == 1:
        return {"mensaje": "Eliminado con éxito"}
    return {"error": "No se encontró"}