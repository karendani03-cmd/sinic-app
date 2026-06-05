from database import Base
from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
import uuid


class ColTerreno(Base):
    """
    Unidad Espacial — col_terreno
    Representa terrenos con geometría poligonal.
    SRID 9377: Magna Sirgas Colombia Origen Nacional.
    """
    __tablename__ = "col_terreno"

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    area_calculada = Column(Numeric(20, 4), nullable=True)
    dimension = Column(String(10), nullable=True)   # "2D" o "3D"
    geometria = Column(
        Geometry(geometry_type="POLYGON", srid=9377),
        nullable=True
    )


class ColLindero(Base):
    """
    Unidad Espacial — col_lindero
    Representa linderos con geometría de línea.
    """
    __tablename__ = "col_lindero"

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    longitud = Column(Numeric(20, 4), nullable=True)
    dimension = Column(String(10), nullable=True)
    geometria = Column(
        Geometry(geometry_type="LINESTRING", srid=9377),
        nullable=True
    )
