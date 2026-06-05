from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from database import get_db
from models.unidad_administrativa import ColBaunit
from schemas.unidad_administrativa import (
    ColBaunitCreate, ColBaunitUpdate, ColBaunitResponse
)
import uuid

router = APIRouter(prefix="/api/unidad-administrativa", tags=["Unidad Administrativa"])


@router.get("/", response_model=List[ColBaunitResponse])
def listar_baunit(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    return db.query(ColBaunit).offset(skip).limit(limit).all()


@router.get("/{t_id}", response_model=ColBaunitResponse)
def obtener_baunit(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColBaunit).filter(ColBaunit.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Unidad Administrativa con t_id={t_id} no encontrada")
    return obj


@router.post("/", response_model=ColBaunitResponse, status_code=201)
def crear_baunit(data: ColBaunitCreate, db: Session = Depends(get_db)):
    obj = ColBaunit(
        t_ili_tid=data.t_ili_tid or uuid.uuid4(),
        nombre=data.nombre,
        tipo=data.tipo,
        departamento=data.departamento,
        municipio=data.municipio,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{t_id}", response_model=ColBaunitResponse)
def actualizar_baunit(t_id: int, data: ColBaunitUpdate, db: Session = Depends(get_db)):
    obj = db.query(ColBaunit).filter(ColBaunit.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Unidad Administrativa con t_id={t_id} no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{t_id}", status_code=204)
def eliminar_baunit(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColBaunit).filter(ColBaunit.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Unidad Administrativa con t_id={t_id} no encontrada")
    db.delete(obj)
    db.commit()
