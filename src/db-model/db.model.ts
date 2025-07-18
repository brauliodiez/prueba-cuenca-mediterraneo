export interface EmbalseUpdateSAIH {
  id: number;
  aguaActualSAIH: number;
  fechaMedidaSAIH: string;
}

export interface EmbalseFullSAIH {
  nombre: string;
  cuenca: string;
  provincia: string;
  capacidad: number;
  aguaActualSAIH: number;
  fechaMedidaSAIH: string;
}
