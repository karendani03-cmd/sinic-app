from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.interesados import ColInteresado
from schemas.interesados import ColInteresadoCreate, ColInteresadoUpdate, ColInteresadoResponse
import uuid

router = APIRouter(prefix="/api/interesados", tags=["Interesados"])


@router.get("/", response_model=List[ColInteresadoResponse])
def listar_interesados(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    return db.query(ColInteresado).offset(skip).limit(limit).all()


@router.get("/{t_id}", response_model=ColInteresadoResponse)
def obtener_interesado(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColInteresado).filter(ColInteresado.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Interesado con t_id={t_id} no encontrado")
    return obj


@router.post("/", response_model=ColInteresadoResponse, status_code=201)
def crear_interesado(data: ColInteresadoCreate, db: Session = Depends(get_db)):
    obj = ColInteresado(
        t_ili_tid=data.t_ili_tid or uuid.uuid4(),
        nombre=data.nombre,
        tipo_documento=data.tipo_documento,
        numero_documento=data.numero_documento,
        tipo_interesado=data.tipo_interesado,
    )
    db.add(obj); db.commit(); db.refresh(obj)
    return obj


@router.put("/{t_id}", response_model=ColInteresadoResponse)
def actualizar_interesado(t_id: int, data: ColInteresadoUpdate, db: Session = Depends(get_db)):
    obj = db.query(ColInteresado).filter(ColInteresado.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Interesado con t_id={t_id} no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit(); db.refresh(obj)
    return obj


@router.delete("/{t_id}", status_code=204)
def eliminar_interesado(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColInteresado).filter(ColInteresado.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Interesado con t_id={t_id} no encontrado")
    db.delete(obj); db.commit()
