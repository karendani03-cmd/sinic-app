from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ColInteresadoBase(BaseModel):
    nombre: Optional[str] = None
    tipo_documento: Optional[str] = None    # CC, NIT, CE, PA, TI, RC, DE
    numero_documento: Optional[str] = None
    tipo_interesado: Optional[str] = None   # natural, juridico


class ColInteresadoCreate(ColInteresadoBase):
    t_ili_tid: Optional[UUID] = None


class ColInteresadoUpdate(ColInteresadoBase):
    pass


class ColInteresadoResponse(ColInteresadoBase):
    t_id: int
    t_ili_tid: Optional[UUID] = None

    model_config = {"from_attributes": True}
