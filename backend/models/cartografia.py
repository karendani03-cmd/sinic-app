from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
import uuid


class CcConstruccion(Base):
    """
    Cartografía Catastral — cc_construccion
    Representa construcciones principales con geometría poligonal.
    SRID 9377: Magna Sirgas Colombia Origen Nacional.
    """
    __tablename__ = "cc_construccion"

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    tipo_construccion = Column(String(100), nullable=True)
    tipo_dominio = Column(String(100), nullable=True)
    numero_pisos = Column(Integer, nullable=True)
    geometria = Column(
        Geometry(geometry_type="POLYGON", srid=9377),
        nullable=True
    )


class CcUnidadConstruccion(Base):
    """
    Cartografía Catastral — cc_unidadconstruccion
    Representa unidades internas dentro de una construcción.
    """
    __tablename__ = "cc_unidadconstruccion"

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    tipo_construccion = Column(String(100), nullable=True)
    tipo_dominio = Column(String(100), nullable=True)
    numero_pisos = Column(Integer, nullable=True)
    geometria = Column(
        Geometry(geometry_type="POLYGON", srid=9377),
        nullable=True
    )
