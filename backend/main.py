from ast import AsyncFor
import token
from warnings import deprecated
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import usuario
from database import coleccion_inmuebles 
from models.inmueble import Inmueble
from bson import ObjectId
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from database import coleccion_usuarios  # Esto trae la conexión de la base de datos
from models.usuario import usuario

app = FastAPI()

# Esto permite que tu HTML (Frontend) hable con tu Python (Backend)
app.add_middleware(CORSMiddleware,
   
    allow_origins=["*"], # Permitir todas las conexiones por ahora
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de seguridad
pwd_context = CryptContext (schemes=["bcrypt"], deprecatedcated="auto")
SECRET_KEY = "Admin_1234"

# Función para encriptar contraseñas
def obtener_password_hash(password):
    return pwd_context.hash(password)

# --- RUTA PARA REGISTRAR ADMINS ---
@app.post("/registrar")
async def registrar_usuario(usuario: usuario):
    usuario_dict = usuario.dict()
    usuario_dict["password"] = obtener_password_hash(usuario.password)
    await coleccion_usuarios.insert_one(usuario_dict)
    return {"mensaje": "Usuario administrativo creado con éxito"}

# --- RUTA PARA LOGIN ---
@app.post("/login")
async def login(usuario: usuario):
    user_db = await coleccion_usuarios.find_one({"username":usuario.username})
    if not user_db or not pwd_context.verify(usuario.password, user_db["password"]):
        return {"error": "Usuario o contraseña incorrectos"}
    token = jwt.encode ({"user": usuario.username}, SECRET_KEY, algorithm= "HS256")
    return {"token": token, "mensaje": " Bienvenido al panel de control"}

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