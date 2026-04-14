/**
 * Dados de clima atual retornados pela API de previsão.
 */
export interface WeatherData {
  /** Nome da localização exibida ao usuário. */
  location: string;
  /** Temperatura atual em graus Celsius. */
  temperature: number;
  /** Temperatura de sensação térmica em graus Celsius. */
  feelsLike: number;
  /** Velocidade do vento em km/h. */
  windSpeed: number;
  /** Umidade relativa em porcentagem. */
  humidity: number;
  /** Data e hora local da localização selecionada. */
  localTime: string;
  /** Código numérico da condição meteorológica da API. */
  conditionCode: number;
  /** Ícone de condição meteorológica formatado para exibição. */
  conditionIcon: string;
  /** Descrição textual breve do clima. */
  description: string;
}
