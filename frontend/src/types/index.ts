// ─── Unidad Administrativa ────────────────────────────────────────────────────
export interface ColBaunit {
  t_id: number;
  t_ili_tid?: string;
  nombre?: string;
  tipo?: string;
  departamento?: string;
  municipio?: string;
}
export type ColBaunitCreate = Omit<ColBaunit, 't_id'>;
export type ColBaunitUpdate = Partial<ColBaunitCreate>;

// ─── Unidad Espacial ──────────────────────────────────────────────────────────
export interface ColTerreno {
  t_id: number;
  t_ili_tid?: string;
  area_calculada?: number;
  dimension?: string;
  geometria?: string;
}
export type ColTerrenoCreate = Omit<ColTerreno, 't_id'>;
export type ColTerrenoUpdate = Partial<ColTerrenoCreate>;

export interface ColLindero {
  t_id: number;
  t_ili_tid?: string;
  longitud?: number;
  dimension?: string;
  geometria?: string;
}
export type ColLinderoCreate = Omit<ColLindero, 't_id'>;
export type ColLinderoUpdate = Partial<ColLinderoCreate>;

// ─── Interesados ──────────────────────────────────────────────────────────────
export interface ColInteresado {
  t_id: number;
  t_ili_tid?: string;
  nombre?: string;
  tipo_documento?: string;
  numero_documento?: string;
  tipo_interesado?: string;
}
export type ColInteresadoCreate = Omit<ColInteresado, 't_id'>;
export type ColInteresadoUpdate = Partial<ColInteresadoCreate>;

// ─── Topografía ───────────────────────────────────────────────────────────────
export interface ColPunto {
  t_id: number;
  t_ili_tid?: string;
  exactitud_horizontal?: number;
  exactitud_vertical?: number;
  metodo_produccion?: string;
  posicion_interpolacion?: string;
}
export type ColPuntoCreate = Omit<ColPunto, 't_id'>;
export type ColPuntoUpdate = Partial<ColPuntoCreate>;

// ─── Cartografía ──────────────────────────────────────────────────────────────
export interface CcConstruccion {
  t_id: number;
  t_ili_tid?: string;
  tipo_construccion?: string;
  tipo_dominio?: string;
  numero_pisos?: number;
  geometria?: string;
}
export type CcConstruccionCreate = Omit<CcConstruccion, 't_id'>;
export type CcConstruccionUpdate = Partial<CcConstruccionCreate>;

export interface CcUnidadConstruccion {
  t_id: number;
  t_ili_tid?: string;
  tipo_construccion?: string;
  tipo_dominio?: string;
  numero_pisos?: number;
  geometria?: string;
}
export type CcUnidadConstruccionCreate = Omit<CcUnidadConstruccion, 't_id'>;
export type CcUnidadConstruccionUpdate = Partial<CcUnidadConstruccionCreate>;

// ─── Utilidades ───────────────────────────────────────────────────────────────
export interface ApiHealth {
  api: string;
  database: { status: string; message: string };
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}
