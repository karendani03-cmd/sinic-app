from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
import uuid


TIPOS_DOCUMENTO = ("CC", "NIT", "CE", "PA", "TI", "RC", "DE")


class ColInteresado(Base):
    """
    Interesado — col_interesado
    Representa personas naturales o jurídicas con derechos sobre predios.
    """
    __tablename__ = "col_interesado"

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    nombre = Column(String(255), nullable=False)
    tipo_documento = Column(String(10), nullable=True)    # CC, NIT, CE, etc.
    numero_documento = Column(String(50), nullable=True)
    tipo_interesado = Column(String(50), nullable=True)   # natural, juridico
