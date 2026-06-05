from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class CcConstruccionBase(BaseModel):
    tipo_construccion: Optional[str] = None
    tipo_dominio: Optional[str] = None
    numero_pisos: Optional[int] = None
    geometria: Optional[str] = None   # WKT string


class CcConstruccionCreate(CcConstruccionBase):
    t_ili_tid: Optional[UUID] = None


class CcConstruccionUpdate(CcConstruccionBase):
    pass


class CcConstruccionResponse(CcConstruccionBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}


class CcUnidadConstruccionBase(BaseModel):
    tipo_construccion: Optional[str] = None
    tipo_dominio: Optional[str] = None
    numero_pisos: Optional[int] = None
    geometria: Optional[str] = None   # WKT string


class CcUnidadConstruccionCreate(CcUnidadConstruccionBase):
    t_ili_tid: Optional[UUID] = None


class CcUnidadConstruccionUpdate(CcUnidadConstruccionBase):
    pass


class CcUnidadConstruccionResponse(CcUnidadConstruccionBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}
