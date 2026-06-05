from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_GeomFromText, ST_AsText
from typing import List
from database import get_db
from models.cartografia import CcConstruccion, CcUnidadConstruccion
from schemas.cartografia import (
    CcConstruccionCreate, CcConstruccionUpdate, CcConstruccionResponse,
    CcUnidadConstruccionCreate, CcUnidadConstruccionUpdate, CcUnidadConstruccionResponse
)
import uuid

router = APIRouter(prefix="/api/cartografia", tags=["Cartografía Catastral"])


def _constr_to_schema(r, db, geom_wkt=None):
    return CcConstruccionResponse(
        t_id=r.t_id, t_ili_tid=r.t_ili_tid,
        tipo_construccion=r.tipo_construccion, tipo_dominio=r.tipo_dominio,
        numero_pisos=r.numero_pisos,
        geometria=geom_wkt if geom_wkt else (
            db.scalar(ST_AsText(r.geometria)) if r.geometria is not None else None
        )
    )


def _unidad_to_schema(r, db, geom_wkt=None):
    return CcUnidadConstruccionResponse(
        t_id=r.t_id, t_ili_tid=r.t_ili_tid,
        tipo_construccion=r.tipo_construccion, tipo_dominio=r.tipo_dominio,
        numero_pisos=r.numero_pisos,
        geometria=geom_wkt if geom_wkt else (
            db.scalar(ST_AsText(r.geometria)) if r.geometria is not None else None
        )
    )


# ── CONSTRUCCION ─────────────────────────────────────────────────────────────

@router.get("/construcciones", response_model=List[CcConstruccionResponse])
def listar_construcciones(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    return [_constr_to_schema(r, db) for r in db.query(CcConstruccion).offset(skip).limit(limit).all()]


@router.get("/construcciones/{t_id}", response_model=CcConstruccionResponse)
def obtener_construccion(t_id: int, db: Session = Depends(get_db)):
    r = db.query(CcConstruccion).filter(CcConstruccion.t_id == t_id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Construcción con t_id={t_id} no encontrada")
    return _constr_to_schema(r, db)


@router.post("/construcciones", response_model=CcConstruccionResponse, status_code=201)
def crear_construccion(data: CcConstruccionCreate, db: Session = Depends(get_db)):
    geom = ST_GeomFromText(data.geometria, 9377) if data.geometria else None
    obj = CcConstruccion(t_ili_tid=data.t_ili_tid or uuid.uuid4(),
                         tipo_construccion=data.tipo_construccion, tipo_dominio=data.tipo_dominio,
                         numero_pisos=data.numero_pisos, geometria=geom)
    db.add(obj); db.commit(); db.refresh(obj)
    return _constr_to_schema(obj, db, data.geometria)


@router.put("/construcciones/{t_id}", response_model=CcConstruccionResponse)
def actualizar_construccion(t_id: int, data: CcConstruccionUpdate, db: Session = Depends(get_db)):
    obj = db.query(CcConstruccion).filter(CcConstruccion.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Construcción con t_id={t_id} no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "geometria" and value:
            obj.geometria = ST_GeomFromText(value, 9377)
        elif field != "geometria":
            setattr(obj, field, value)
    db.commit(); db.refresh(obj)
    return _constr_to_schema(obj, db, data.geometria)


@router.delete("/construcciones/{t_id}", status_code=204)
def eliminar_construccion(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(CcConstruccion).filter(CcConstruccion.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Construcción con t_id={t_id} no encontrada")
    db.delete(obj); db.commit()


# ── UNIDAD CONSTRUCCION ───────────────────────────────────────────────────────

@router.get("/unidades-construccion", response_model=List[CcUnidadConstruccionResponse])
def listar_unidades(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    return [_unidad_to_schema(r, db) for r in db.query(CcUnidadConstruccion).offset(skip).limit(limit).all()]


@router.get("/unidades-construccion/{t_id}", response_model=CcUnidadConstruccionResponse)
def obtener_unidad(t_id: int, db: Session = Depends(get_db)):
    r = db.query(CcUnidadConstruccion).filter(CcUnidadConstruccion.t_id == t_id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Unidad de Construcción con t_id={t_id} no encontrada")
    return _unidad_to_schema(r, db)


@router.post("/unidades-construccion", response_model=CcUnidadConstruccionResponse, status_code=201)
def crear_unidad(data: CcUnidadConstruccionCreate, db: Session = Depends(get_db)):
    geom = ST_GeomFromText(data.geometria, 9377) if data.geometria else None
    obj = CcUnidadConstruccion(t_ili_tid=data.t_ili_tid or uuid.uuid4(),
                               tipo_construccion=data.tipo_construccion, tipo_dominio=data.tipo_dominio,
                               numero_pisos=data.numero_pisos, geometria=geom)
    db.add(obj); db.commit(); db.refresh(obj)
    return _unidad_to_schema(obj, db, data.geometria)


@router.put("/unidades-construccion/{t_id}", response_model=CcUnidadConstruccionResponse)
def actualizar_unidad(t_id: int, data: CcUnidadConstruccionUpdate, db: Session = Depends(get_db)):
    obj = db.query(CcUnidadConstruccion).filter(CcUnidadConstruccion.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Unidad de Construcción con t_id={t_id} no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "geometria" and value:
            obj.geometria = ST_GeomFromText(value, 9377)
        elif field != "geometria":
            setattr(obj, field, value)
    db.commit(); db.refresh(obj)
    return _unidad_to_schema(obj, db, data.geometria)


@router.delete("/unidades-construccion/{t_id}", status_code=204)
def eliminar_unidad(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(CcUnidadConstruccion).filter(CcUnidadConstruccion.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Unidad de Construcción con t_id={t_id} no encontrada")
    db.delete(obj); db.commit()
