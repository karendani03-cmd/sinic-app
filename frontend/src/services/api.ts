import axios from 'axios';
import type {
  ColBaunit, ColBaunitCreate, ColBaunitUpdate,
  ColTerreno, ColTerrenoCreate, ColTerrenoUpdate,
  ColLindero, ColLinderoCreate, ColLinderoUpdate,
  ColInteresado, ColInteresadoCreate, ColInteresadoUpdate,
  ColPunto, ColPuntoCreate, ColPuntoUpdate,
  CcConstruccion, CcConstruccionCreate, CcConstruccionUpdate,
  CcUnidadConstruccion, CcUnidadConstruccionCreate, CcUnidadConstruccionUpdate,
  ApiHealth,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Health ───────────────────────────────────────────────────────────────────
export const checkHealth = () => api.get<ApiHealth>('/health').then(r => r.data);

// ─── Unidad Administrativa ────────────────────────────────────────────────────
export const baunitApi = {
  list:   (skip = 0, limit = 100) => api.get<ColBaunit[]>('/unidad-administrativa/', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<ColBaunit>(`/unidad-administrativa/${id}`).then(r => r.data),
  create: (data: ColBaunitCreate) => api.post<ColBaunit>('/unidad-administrativa/', data).then(r => r.data),
  update: (id: number, data: ColBaunitUpdate) => api.put<ColBaunit>(`/unidad-administrativa/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/unidad-administrativa/${id}`),
};

// ─── Unidad Espacial — Terrenos ───────────────────────────────────────────────
export const terrenoApi = {
  list:   (skip = 0, limit = 100) => api.get<ColTerreno[]>('/unidad-espacial/terrenos', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<ColTerreno>(`/unidad-espacial/terrenos/${id}`).then(r => r.data),
  create: (data: ColTerrenoCreate) => api.post<ColTerreno>('/unidad-espacial/terrenos', data).then(r => r.data),
  update: (id: number, data: ColTerrenoUpdate) => api.put<ColTerreno>(`/unidad-espacial/terrenos/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/unidad-espacial/terrenos/${id}`),
};

// ─── Unidad Espacial — Linderos ───────────────────────────────────────────────
export const linderoApi = {
  list:   (skip = 0, limit = 100) => api.get<ColLindero[]>('/unidad-espacial/linderos', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<ColLindero>(`/unidad-espacial/linderos/${id}`).then(r => r.data),
  create: (data: ColLinderoCreate) => api.post<ColLindero>('/unidad-espacial/linderos', data).then(r => r.data),
  update: (id: number, data: ColLinderoUpdate) => api.put<ColLindero>(`/unidad-espacial/linderos/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/unidad-espacial/linderos/${id}`),
};

// ─── Interesados ──────────────────────────────────────────────────────────────
export const interesadoApi = {
  list:   (skip = 0, limit = 100) => api.get<ColInteresado[]>('/interesados/', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<ColInteresado>(`/interesados/${id}`).then(r => r.data),
  create: (data: ColInteresadoCreate) => api.post<ColInteresado>('/interesados/', data).then(r => r.data),
  update: (id: number, data: ColInteresadoUpdate) => api.put<ColInteresado>(`/interesados/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/interesados/${id}`),
};

// ─── Topografía ───────────────────────────────────────────────────────────────
export const puntoApi = {
  list:   (skip = 0, limit = 100) => api.get<ColPunto[]>('/topografia/', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<ColPunto>(`/topografia/${id}`).then(r => r.data),
  create: (data: ColPuntoCreate)  => api.post<ColPunto>('/topografia/', data).then(r => r.data),
  update: (id: number, data: ColPuntoUpdate) => api.put<ColPunto>(`/topografia/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/topografia/${id}`),
};

// ─── Cartografía — Construcciones ─────────────────────────────────────────────
export const construccionApi = {
  list:   (skip = 0, limit = 100) => api.get<CcConstruccion[]>('/cartografia/construcciones', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<CcConstruccion>(`/cartografia/construcciones/${id}`).then(r => r.data),
  create: (data: CcConstruccionCreate) => api.post<CcConstruccion>('/cartografia/construcciones', data).then(r => r.data),
  update: (id: number, data: CcConstruccionUpdate) => api.put<CcConstruccion>(`/cartografia/construcciones/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/cartografia/construcciones/${id}`),
};

// ─── Cartografía — Unidades de Construcción ───────────────────────────────────
export const unidadConstruccionApi = {
  list:   (skip = 0, limit = 100) => api.get<CcUnidadConstruccion[]>('/cartografia/unidades-construccion', { params: { skip, limit } }).then(r => r.data),
  get:    (id: number)            => api.get<CcUnidadConstruccion>(`/cartografia/unidades-construccion/${id}`).then(r => r.data),
  create: (data: CcUnidadConstruccionCreate) => api.post<CcUnidadConstruccion>('/cartografia/unidades-construccion', data).then(r => r.data),
  update: (id: number, data: CcUnidadConstruccionUpdate) => api.put<CcUnidadConstruccion>(`/cartografia/unidades-construccion/${id}`, data).then(r => r.data),
  remove: (id: number)            => api.delete(`/cartografia/unidades-construccion/${id}`),
};
