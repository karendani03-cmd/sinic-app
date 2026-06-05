from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_GeomFromText, ST_AsText
from typing import List
from database import get_db
from models.topografia import ColPunto
from schemas.topografia import ColPuntoCreate, ColPuntoUpdate, ColPuntoResponse
import uuid

router = APIRouter(prefix="/api/topografia", tags=["Topografía"])


def _row_to_schema(r, db, geom_wkt=None):
    return ColPuntoResponse(
        t_id=r.t_id, t_ili_tid=r.t_ili_tid,
        exactitud_horizontal=float(r.exactitud_horizontal) if r.exactitud_horizontal else None,
        exactitud_vertical=float(r.exactitud_vertical) if r.exactitud_vertical else None,
        metodo_produccion=r.metodo_produccion,
        posicion_interpolacion=geom_wkt if geom_wkt else (
            db.scalar(ST_AsText(r.posicion_interpolacion)) if r.posicion_interpolacion is not None else None
        )
    )


@router.get("/", response_model=List[ColPuntoResponse])
def listar_puntos(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db)):
    return [_row_to_schema(r, db) for r in db.query(ColPunto).offset(skip).limit(limit).all()]


@router.get("/{t_id}", response_model=ColPuntoResponse)
def obtener_punto(t_id: int, db: Session = Depends(get_db)):
    r = db.query(ColPunto).filter(ColPunto.t_id == t_id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Punto con t_id={t_id} no encontrado")
    return _row_to_schema(r, db)


@router.post("/", response_model=ColPuntoResponse, status_code=201)
def crear_punto(data: ColPuntoCreate, db: Session = Depends(get_db)):
    geom = ST_GeomFromText(data.posicion_interpolacion, 9377) if data.posicion_interpolacion else None
    obj = ColPunto(
        t_ili_tid=data.t_ili_tid or uuid.uuid4(),
        exactitud_horizontal=data.exactitud_horizontal,
        exactitud_vertical=data.exactitud_vertical,
        metodo_produccion=data.metodo_produccion,
        posicion_interpolacion=geom,
    )
    db.add(obj); db.commit(); db.refresh(obj)
    return _row_to_schema(obj, db, data.posicion_interpolacion)


@router.put("/{t_id}", response_model=ColPuntoResponse)
def actualizar_punto(t_id: int, data: ColPuntoUpdate, db: Session = Depends(get_db)):
    obj = db.query(ColPunto).filter(ColPunto.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Punto con t_id={t_id} no encontrado")
    if data.exactitud_horizontal is not None:
        obj.exactitud_horizontal = data.exactitud_horizontal
    if data.exactitud_vertical is not None:
        obj.exactitud_vertical = data.exactitud_vertical
    if data.metodo_produccion is not None:
        obj.metodo_produccion = data.metodo_produccion
    if data.posicion_interpolacion is not None:
        obj.posicion_interpolacion = ST_GeomFromText(data.posicion_interpolacion, 9377)
    db.commit(); db.refresh(obj)
    return _row_to_schema(obj, db, data.posicion_interpolacion)


@router.delete("/{t_id}", status_code=204)
def eliminar_punto(t_id: int, db: Session = Depends(get_db)):
    obj = db.query(ColPunto).filter(ColPunto.t_id == t_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"Punto con t_id={t_id} no encontrado")
    db.delete(obj); db.commit()
