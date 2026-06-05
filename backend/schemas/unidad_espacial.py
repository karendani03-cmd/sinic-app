from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ColTerrenoBase(BaseModel):
    area_calculada: Optional[float] = None
    dimension: Optional[str] = None
    geometria: Optional[str] = None   # WKT string


class ColTerrenoCreate(ColTerrenoBase):
    t_ili_tid: Optional[UUID] = None


class ColTerrenoUpdate(ColTerrenoBase):
    pass


class ColTerrenoResponse(ColTerrenoBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}


class ColLinderoBase(BaseModel):
    longitud: Optional[float] = None
    dimension: Optional[str] = None
    geometria: Optional[str] = None   # WKT string


class ColLinderoCreate(ColLinderoBase):
    t_ili_tid: Optional[UUID] = None


class ColLinderoUpdate(ColLinderoBase):
    pass


class ColLinderoResponse(ColLinderoBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}
