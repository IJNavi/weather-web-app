import { useState } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherByCity, WeatherQuery } from '../services/openMeteo';

export default function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(query: WeatherQuery) {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(query);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err instanceof Error ? err.message : 'Erro inesperado ao buscar o clima.');
    } finally {
      setLoading(false);
    }
  }

  return { weather, loading, error, fetchWeather };
}
