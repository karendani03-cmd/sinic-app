from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class ColBaunitBase(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    departamento: Optional[str] = None
    municipio: Optional[str] = None


class ColBaunitCreate(ColBaunitBase):
    t_ili_tid: Optional[UUID] = None


class ColBaunitUpdate(ColBaunitBase):
    pass


class ColBaunitResponse(ColBaunitBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}
