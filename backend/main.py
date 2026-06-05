from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import check_db_connection
from routers import unidad_administrativa, unidad_espacial, interesados, topografia, cartografia

app = FastAPI(
    title="SINIC API",
    description="API REST para el Sistema Nacional de Información Catastral - LADM_COL SINIC V1.0 (Resolución 301 de 2025)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTERS ───────────────────────────────────────────────────────────────────
app.include_router(unidad_administrativa.router)
app.include_router(unidad_espacial.router)
app.include_router(interesados.router)
app.include_router(topografia.router)
app.include_router(cartografia.router)


# ── ENDPOINTS RAÍZ ───────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {
        "app": "SINIC API",
        "version": "1.0.0",
        "modelo": "LADM_COL SINIC V1.0",
        "resolucion": "Resolución 301 de 2025",
        "docs": "/docs"
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    """Verifica la conexión a la base de datos PostgreSQL+PostGIS."""
    db_status = check_db_connection()
    return {
        "api": "ok",
        "database": db_status
    }
