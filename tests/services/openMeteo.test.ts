import { beforeAll, beforeEach, describe, expect, it, vi, afterAll } from 'vitest';
import { fetchWeatherByCity } from '../../src/services/openMeteo';

const fetchMock = vi.fn();

beforeAll(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  fetchMock.mockReset();
});

describe('fetchWeatherByCity service', () => {
  it('returns formatted weather data for a valid city and country', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Lisboa',
              country: 'Portugal',
              country_code: 'PT',
              admin1: 'Lisboa',
              latitude: 38.7223,
              longitude: -9.1393,
              timezone: 'Europe/Lisbon',
              population: 504718,
              feature_code: 'PPLC'
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Lisboa',
              country: 'Portugal',
              country_code: 'PT',
              admin1: 'Lisboa',
              latitude: 38.7223,
              longitude: -9.1393,
              timezone: 'Europe/Lisbon',
              population: 504718,
              feature_code: 'PPLC'
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: {
            temperature: 20,
            windspeed: 5,
            weathercode: 0,
            time: '2026-04-13T12:00:00Z'
          },
          hourly: {
            relativehumidity_2m: [65]
          }
        })
      });

    const weather = await fetchWeatherByCity({ city: 'Lisboa', country: 'Portugal' });

    expect(weather.location).toBe('Lisboa, Portugal');
    expect(weather.temperature).toBe(20);
    expect(weather.humidity).toBe(65);
    expect(weather.conditionIcon).toBe('☀️');
    expect(weather.description).toBe('Céu limpo');
    expect(weather.localTime).toContain('13/04/2026');
  });

  it('throws an error when the city is not found', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(fetchWeatherByCity({ city: 'Cidade Inexistente' })).rejects.toThrow(/Cidade não encontrada/i);
  });
});
