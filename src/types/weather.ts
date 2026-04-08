export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  localTime: string;
  conditionCode: number;
  conditionIcon: string;
  description: string;
}
