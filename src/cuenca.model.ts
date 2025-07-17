export interface EmbalsesAndalucia {
  id: number;
  embalse: string;
  porcentajeActual: number;
  capacidadTotalHm3: number;
  acumuladoHoyMm: number;
  volumenActualHm3: number;
  acumuladoSemanaAnteriorMm: number;
  volumenSemanaAnteriorHm3: number;
  acumuladoAnioAnteriorMm: number;
  volumenAnioAnteriorHm3: number;
  grafico: any;
}

export interface Province {
  [name: string]: EmbalsesAndalucia[];
}
