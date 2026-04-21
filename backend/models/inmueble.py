from pydantic import BaseModel
from typing import Optional

class Inmueble(BaseModel):
    id: Optional [str] = None
    titulo: str
    descripcion: str
    precio: float
    ubicacion: str
    habitaciones: int
    imagen_url: str # Aquí pegaremos el link de la foto


