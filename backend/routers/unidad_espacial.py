from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.functions import ST_GeomFromText, ST_AsText
from typing import List
from database import get_db
from models.unidad_espacial import ColTerreno, ColLindero
from schemas.unidad_espacial import (
    ColTerrenoCreate, ColTerrenoUpdate, ColTerrenoResponse,
    ColLinderoCreate, ColLinderoUpdate, ColLinderoResponse
)
import uuid

router = APIRouter(prefix="/api/unidad-espacial", tags=["Unidad Espacial"])


# ── TERRENO ──────────────────────────────────────────────────────────────────

@router.get("/terrenos", response_model=List[ColTerrenoResponse])
def listar_terrenos(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    rows = db.query(ColTerreno).offset(skip).limit(limit).all()
    result = []
    for r in rows:
        item = ColTerrenoResponse(
            t_id=r.t_id,
            t_ili_tid=r.t_ili_tid,
            area_calculada=float(r.area_calculada) if r.area_calculada else None,
            dimension=r.dimension,
            geometria=db.scalar(ST_AsText(r.geometria)) if r.geometria is not None else None,
        )
        result.append(item)
    return result


@router.get("/terrenos/{t_id}", response_model=ColTerrenoResponse)
def obtener_terreno(t_id: int, db: Session = Depends(get_db)):
    r = db.query(ColTerreno).filter(ColTerreno.t_id == t_id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Terreno con t_id={t_id} no encontrado")
    return ColTerrenoResponse(
        t_id=r.t_id, t_ili_tid=r.t_ili_tid,
        area_calculada=float(r.area_calculada) if r.area_calculada else None,
        dimension=r.dimension,
        geometria=db.scalar(ST_AsText(r.geometria)) if r.geometria is not None else None,
    )


@router.post("/terrenos", response_model=ColTerrenoResponse, status_code=201)
def crear_terreno(data: ColTerrenoCreate, db: Session = Depends(get_db)):
    geom = ST_GeomFromText(data.geometria, 9377) if data.geometria else None
    obj = ColTerreno(
        t_ili_tid=data.t_ili_tid or uuid.uuid4(),
        area_calculada=data.area_calculada,
        dimension=data.dimension,
        geometria=geom,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return ColTerrenoResponse(t_id=obj.t_id, t_ili_tid=obj.t_ili_tid,
                               area_calculada=float(obj.area_calculada) if obj.area_calculada else None,
                               dimension=obj.dimension, geometria=data.geometria)


@router.put("/terrenos/{t_id}", response_model=ColTerrenoResponse)
def actualizar_terreno(t_id: int, data: ColTerrenoUpdate, db: Session = Depends(get_db)):
    obj = db.query(ColTerreno).filter(ColTerreno.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Terreno con t_id={t_id} no encontrado")
    if data.area_calculada is not None:
        obj.area_calculada = data.area_calculada
    if data.dimension is not None:
        obj.dimension = data.dimension
    if data.geometria is not None:
        obj.geometria = ST_GeomFromText(data.geometria, 9377)
    db.commit()
    db.refresh(obj)
    return ColTerrenoResponse(t_id=obj.t_id, t_ili_tid=obj.t_ili_tid,
                               area_calculada=float(obj.area_calculada) if obj.area_calculada else None,
                               dimension=obj.dimension, geometria=data.geometria)


@router.delete("/terrenos/{t_id}", status_code=204)
def eliminar_terreno(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColTerreno).filter(ColTerreno.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Terreno con t_id={t_id} no encontrado")
    db.delete(obj)
    db.commit()


# ── LINDERO ──────────────────────────────────────────────────────────────────

@router.get("/linderos", response_model=List[ColLinderoResponse])
def listar_linderos(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    rows = db.query(ColLindero).offset(skip).limit(limit).all()
    return [ColLinderoResponse(t_id=r.t_id, t_ili_tid=r.t_ili_tid,
            longitud=float(r.longitud) if r.longitud else None,
            dimension=r.dimension,
            geometria=db.scalar(ST_AsText(r.geometria)) if r.geometria is not None else None) for r in rows]


@router.get("/linderos/{t_id}", response_model=ColLinderoResponse)
def obtener_lindero(t_id: int, db: Session = Depends(get_db)):
    r = db.query(ColLindero).filter(ColLindero.t_id == t_id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Lindero con t_id={t_id} no encontrado")
    return ColLinderoResponse(t_id=r.t_id, t_ili_tid=r.t_ili_tid,
        longitud=float(r.longitud) if r.longitud else None,
        dimension=r.dimension,
        geometria=db.scalar(ST_AsText(r.geometria)) if r.geometria is not None else None)


@router.post("/linderos", response_model=ColLinderoResponse, status_code=201)
def crear_lindero(data: ColLinderoCreate, db: Session = Depends(get_db)):
    geom = ST_GeomFromText(data.geometria, 9377) if data.geometria else None
    obj = ColLindero(t_ili_tid=data.t_ili_tid or uuid.uuid4(),
                     longitud=data.longitud, dimension=data.dimension, geometria=geom)
    db.add(obj); db.commit(); db.refresh(obj)
    return ColLinderoResponse(t_id=obj.t_id, t_ili_tid=obj.t_ili_tid,
        longitud=float(obj.longitud) if obj.longitud else None, dimension=obj.dimension, geometria=data.geometria)


@router.put("/linderos/{t_id}", response_model=ColLinderoResponse)
def actualizar_lindero(t_id: int, data: ColLinderoUpdate, db: Session = Depends(get_db)):
    obj = db.query(ColLindero).filter(ColLindero.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Lindero con t_id={t_id} no encontrado")
    if data.longitud is not None: obj.longitud = data.longitud
    if data.dimension is not None: obj.dimension = data.dimension
    if data.geometria is not None: obj.geometria = ST_GeomFromText(data.geometria, 9377)
    db.commit(); db.refresh(obj)
    return ColLinderoResponse(t_id=obj.t_id, t_ili_tid=obj.t_ili_tid,
        longitud=float(obj.longitud) if obj.longitud else None, dimension=obj.dimension, geometria=data.geometria)


@router.delete("/linderos/{t_id}", status_code=204)
def eliminar_lindero(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColLindero).filter(ColLindero.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Lindero con t_id={t_id} no encontrado")
    db.delete(obj); db.commit()
