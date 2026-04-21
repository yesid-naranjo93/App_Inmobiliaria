from motor.motor_asyncio import AsyncIOMotorClient
# 1. Tu llave maestra a la base de datos
# Asegúrate de que el usuario y la contraseña en el link sean correctos
MONGO_URL ="mongodb+srv://felipemoradante_db_user:931029*pipE@cluster0.5h449y0.mongodb.net/?appName=Cluster0"

# 2. Creamos el cliente que viajará por internet
client = AsyncIOMotorClient(MONGO_URL)

# 3. Seleccionamos (o creamos) la base de datos de tu inmobiliaria
db = client.Inmobiliaria_Pro_DB

# 4. Definimos las "tablas" (colecciones en MongoDB)
coleccion_inmuebles = db.inmuebles
coleccion_ganancias = db.ganancias
