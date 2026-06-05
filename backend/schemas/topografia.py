from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ColPuntoBase(BaseModel):
    exactitud_horizontal: Optional[float] = None
    exactitud_vertical: Optional[float] = None
    metodo_produccion: Optional[str] = None
    posicion_interpolacion: Optional[str] = None   # WKT string


class ColPuntoCreate(ColPuntoBase):
    t_ili_tid: Optional[UUID] = None


class ColPuntoUpdate(ColPuntoBase):
    pass


class ColPuntoResponse(ColPuntoBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}
