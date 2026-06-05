from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
import uuid


class ColBaunit(Base):
    """
    Unidad Administrativa — col_baunit
    Representa la unidad básica administrativa catastral del modelo LADM_COL SINIC.
    El nombre de tabla es ajustable: cambia __tablename__ si difiere en tu BD.
    """
    __tablename__ = "col_baunit"
    # __table_args__ = {"schema": "ladm"}  # Descomenta si usas esquema específico

    t_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    t_ili_tid = Column(
        UUID(as_uuid=True),
        default=uuid.uuid4,
        unique=True,
        nullable=False
    )
    nombre = Column(String(255), nullable=True)
    tipo = Column(String(100), nullable=True)        # Predio, Terreno, etc.
    departamento = Column(String(100), nullable=True)
    municipio = Column(String(100), nullable=True)
