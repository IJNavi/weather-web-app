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
  /** Cidade informada na consulta. */
  city?: string;
  /** Estado informado na consulta. */
  state?: string;
  /** País informado na consulta. */
  country?: string;
  /** Latitude usada para recuperar dados de clima. */
  latitude?: number;
  /** Longitude usada para recuperar dados de clima. */
  longitude?: number;
  /** Fuso horário da localização retornada. */
  timezone?: string;
}

export interface WeatherForecastEntry {
  date: string;
  maxTemp: number;
  minTemp: number;
  weathercode?: number;
  icon: string;
  description: string;
}
