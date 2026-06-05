# SINIC App — Sistema de Información Catastral LADM_COL

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL+PostGIS-15-336791?logo=postgresql)](https://postgis.net)

Aplicación web full-stack para la gestión de datos catastrales conforme al **Modelo de Aplicación LADM_COL SINIC V1.0** (Resolución 301 de 2025 del IGAC).

## 📐 Arquitectura

```
sinic-app/
├── backend/          # FastAPI + SQLAlchemy + GeoAlchemy2
│   ├── models/       # Modelos SQLAlchemy (col_baunit, col_terreno, etc.)
│   ├── schemas/      # Schemas Pydantic (validación y serialización)
│   ├── routers/      # Endpoints REST por entidad
│   ├── main.py       # App FastAPI + CORS
│   └── database.py   # Conexión a PostgreSQL+PostGIS
└── frontend/         # React + Vite + TypeScript + Tailwind CSS
    └── src/
        ├── pages/    # AprendeSINIC, AprendeUML, ModeloDatos
        ├── components/ # CRUDTable, Modal, MapInput, UMLDiagram, Toast
        └── services/ # Cliente axios centralizado
```

## 🗺️ Funcionalidades

| Sección | Ruta | Descripción |
|---------|------|-------------|
| **Aprende SINIC** | `/aprende-sinic` | Resolución 301/2025, ISO 19152, INTERLIS/XTF |
| **Aprende UML** | `/aprende-uml` | Diagrama de clases interactivo SVG |
| **Modelo de Datos** | `/modelo-datos` | CRUDs para las 5 entidades LADM_COL |

### CRUDs disponibles:
- `col_baunit` — Unidad Administrativa
- `col_terreno` / `col_lindero` — Unidad Espacial
- `col_interesado` — Interesados
- `col_punto` — Topografía y Representación
- `cc_construccion` / `cc_unidadconstruccion` — Cartografía Catastral

## ⚙️ Requisitos Previos

- **Python** 3.11+
- **Node.js** 18+ y npm 9+
- **PostgreSQL** 14+ con extensión **PostGIS** (ya debe existir)
- Base de datos `cun25279` accesible

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sinic-app
```

### 2. Configurar variables de entorno del Backend

Edita `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cun25279
DB_USER=postgres
DB_PASSWORD=12345

DATABASE_URL=postgresql://postgres:12345@localhost:5432/cun25279
```

> **⚠️ Importante:** Ajusta los nombres de tablas en `backend/models/` si difieren de los aquí definidos. Cada modelo tiene comentado el campo `__tablename__`.

### 3. Instalar y correr el Backend

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Correr el servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en:
- API: http://localhost:8000
- Docs interactivos (Swagger): http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

### 4. Instalar y correr el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 🐳 Docker (Opcional)

Si prefieres usar Docker (asegúrate de que PostgreSQL acepte conexiones desde `host.docker.internal`):

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

## 🗄️ Estructura de la Base de Datos

El proyecto se conecta a las siguientes tablas (ya existentes en la BD):

| Tabla | Entidad LADM_COL | CRUD |
|-------|-----------------|------|
| `col_baunit` | Unidad Administrativa | ✅ |
| `col_terreno` | Unidad Espacial — Terreno | ✅ |
| `col_lindero` | Unidad Espacial — Lindero | ✅ |
| `col_interesado` | Interesado | ✅ |
| `col_punto` | Topografía | ✅ |
| `cc_construccion` | Cartografía — Construcción | ✅ |
| `cc_unidadconstruccion` | Cartografía — Unidad Construcción | ✅ |

**SRID:** `9377` — Magna Sirgas Colombia Origen Nacional

> Si los nombres de columnas en tu BD difieren, ajusta los atributos en `backend/models/*.py`. El `__tablename__` y los nombres de columnas son fácilmente configurables.

## 🔗 Referencias

- [Modelo LADM_COL SINIC V1.0 — IGAC](https://www.igac.gov.co/es/contenido/areas-estrategicas/submodelo-sinic)
- [Resolución 301 de 2025 — IGAC](https://www.igac.gov.co)
- [ISO 19152 — Land Administration Domain Model](https://www.iso.org/standard/51206.html)
- [INTERLIS — swisstopo](https://www.interlis.ch)

## 📄 Licencia

MIT — Desarrollado para fines académicos — Universidad Distrital Francisco José de Caldas
