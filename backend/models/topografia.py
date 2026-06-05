from database import Base
from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
import uuid


class ColPunto(Base):
    """
    Topografía y Representación — col_punto
    Representa puntos de control topográfico con exactitud horizontal/vertical.
    SRID 9377: Magna Sirgas Colombia Origen Nacional.
    """
    __tablename__ = "col_punto"

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    exactitud_horizontal = Column(Numeric(10, 4), nullable=True)
    exactitud_vertical = Column(Numeric(10, 4), nullable=True)
    metodo_produccion = Column(String(100), nullable=True)
    posicion_interpolacion = Column(
        Geometry(geometry_type="POINT", srid=9377),
        nullable=True
    )
