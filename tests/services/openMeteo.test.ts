import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherByCity, normalizeCountry } from '../../src/services/openMeteo';

const fetchMock = vi.fn();
const storageData = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageData.get(key) ?? null,
  setItem: (key: string, value: string) => storageData.set(key, value),
  removeItem: (key: string) => storageData.delete(key),
  clear: () => storageData.clear()
};

beforeAll(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal('localStorage', localStorageMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  fetchMock.mockReset();
  localStorageMock.clear();
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

  it('returns cached weather data for a valid localStorage entry without calling the API', async () => {
    const cacheKey = 'lisboa||pt';
    const cached = {
      weather: {
        location: 'Lisboa, Portugal',
        temperature: 20,
        feelsLike: 20,
        windSpeed: 4,
        humidity: 60,
        localTime: '13/04/2026 12:00',
        conditionCode: 0,
        conditionIcon: '☀️',
        description: 'Céu limpo',
        city: 'Lisboa',
        country: 'Portugal',
        latitude: 38.7223,
        longitude: -9.1393,
        timezone: 'Europe/Lisbon'
      },
      fetchedAt: Date.now()
    };

    localStorageMock.setItem('weather-cache-v1', JSON.stringify({ [cacheKey]: cached }));

    const weather = await fetchWeatherByCity({ city: 'Lisboa', country: 'Portugal' });

    expect(weather).toEqual(cached.weather);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('removes expired cache entries and fetches fresh weather data', async () => {
    const cacheKey = 'lisboa||pt';
    const staleEntry = {
      weather: {
        location: 'Lisboa, Portugal',
        temperature: 15,
        feelsLike: 15,
        windSpeed: 4,
        humidity: 80,
        localTime: '13/04/2026 08:00',
        conditionCode: 1,
        conditionIcon: '🌥️',
        description: 'Parcialmente nublado',
        city: 'Lisboa',
        country: 'Portugal',
        latitude: 38.7223,
        longitude: -9.1393,
        timezone: 'Europe/Lisbon'
      },
      fetchedAt: Date.now() - 1000 * 60 * 60 * 2
    };

    localStorageMock.setItem('weather-cache-v1', JSON.stringify({ [cacheKey]: staleEntry }));

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
          current_weather: {
            temperature: 22,
            windspeed: 5,
            weathercode: 0,
            time: '2026-04-13T12:00:00Z'
          },
          hourly: {
            relativehumidity_2m: [55]
          }
        })
      });

    const beforeFetch = Date.now();
    const weather = await fetchWeatherByCity({ city: 'Lisboa', country: 'Portugal' });
    const savedCache = JSON.parse(localStorageMock.getItem('weather-cache-v1') || '{}');

    expect(weather.temperature).toBe(22);
    expect(weather.humidity).toBe(55);
    expect(fetchMock).toHaveBeenCalled();
    expect(savedCache[cacheKey]).toBeDefined();
    expect(savedCache[cacheKey].weather.temperature).toBe(22);
    expect(savedCache[cacheKey].fetchedAt).toBeGreaterThanOrEqual(beforeFetch);
  });

  it('throws an error when the city is not found', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    await expect(fetchWeatherByCity({ city: 'Cidade Inexistente' })).rejects.toThrow(/Cidade não encontrada/i);
  });

  it('throws a server unavailable error when the weather API returns 500', async () => {
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
        ok: false,
        status: 502,
        json: async () => ({})
      });

    await expect(fetchWeatherByCity({ city: 'Lisboa', country: 'Portugal' })).rejects.toThrow(/Servidor de clima indisponível/i);
  });

  it('throws a rate-limit error when the weather API returns 429', async () => {
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
        ok: false,
        status: 429,
        json: async () => ({})
      });

    await expect(fetchWeatherByCity({ city: 'Lisboa', country: 'Portugal' })).rejects.toThrow(/Limite de requisições da API/i);
  });

  it('throws an invalid response error when the weather API returns malformed data', async () => {
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
          current_weather: null
        })
      });

    await expect(fetchWeatherByCity({ city: 'Lisboa', country: 'Portugal' })).rejects.toThrow(/Resposta da API de clima no formato inesperado/i);
  });

  it('throws a timeout error when the weather API request is aborted', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    fetchMock.mockRejectedValue(abortError);

    await expect(fetchWeatherByCity({ city: 'Lisboa' })).rejects.toThrow(/Tempo de resposta da API expirou/i);
  });

  it('prefers the matching country when multiple cities share the same name', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Assunção',
              country: 'Angola',
              country_code: 'AO',
              admin1: 'Central',
              latitude: -8.8383,
              longitude: 13.2342,
              timezone: 'Africa/Luanda',
              population: 1000000,
              feature_code: 'PPLC'
            },
            {
              name: 'Assunção',
              country: 'Paraguai',
              country_code: 'PY',
              admin1: 'Central',
              latitude: -25.2637,
              longitude: -57.5759,
              timezone: 'America/Asuncion',
              population: 525000,
              feature_code: 'PPLC'
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: {
            temperature: 24,
            windspeed: 10,
            weathercode: 2,
            time: '2026-04-13T12:00:00Z'
          },
          hourly: {
            relativehumidity_2m: [70]
          }
        })
      });

    const weather = await fetchWeatherByCity({ city: 'Assunção', state: 'Central', country: 'Paraguai' });

    expect(weather.location).toBe('Assunção, Paraguai');
    expect(weather.temperature).toBe(24);
    expect(weather.humidity).toBe(70);
    expect(fetchMock.mock.calls.some(([url]) => typeof url === 'string' && url.includes('name=asuncion') && url.includes('country=PY'))).toBe(true);
  });

  it('queries the English city variant for Montevidéu when searching Uruguay', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Montevideo',
              country: 'Uruguay',
              country_code: 'UY',
              admin1: 'Montevideo Department',
              latitude: -34.9011,
              longitude: -56.1645,
              timezone: 'America/Montevideo',
              population: 1480000,
              feature_code: 'PPLC'
            },
            {
              name: 'Montevidéu',
              country: 'Brazil',
              country_code: 'BR',
              admin1: 'Tocantins',
              latitude: -7.52,
              longitude: -48.12,
              timezone: 'America/Araguaina',
              population: 10000,
              feature_code: 'PPL'
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: {
            temperature: 21,
            windspeed: 12,
            weathercode: 2,
            time: '2026-04-13T12:00:00Z'
          },
          hourly: {
            relativehumidity_2m: [72]
          }
        })
      });

    const weather = await fetchWeatherByCity({ city: 'Montevidéu', state: 'Montevidéu', country: 'Uruguai' });

    expect(weather.location).toBe('Montevideo, Uruguay');
    expect(weather.temperature).toBe(21);
    expect(weather.humidity).toBe(72);
    expect(fetchMock.mock.calls.some(([url]) => typeof url === 'string' && url.includes('name=montevideo') && url.includes('country=UY'))).toBe(true);
  });

  it('prefers a candidate with matching state and country over a larger non-matching state result', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'La Paz',
              country: 'Bolivia',
              country_code: 'BO',
              admin1: 'La Paz',
              latitude: -16.4897,
              longitude: -68.1193,
              timezone: 'America/La_Paz',
              population: 764617,
              feature_code: 'PPLA'
            },
            {
              name: 'La Paz',
              country: 'Bolivia',
              country_code: 'BO',
              admin1: 'Chuquisaca',
              latitude: -19.0333,
              longitude: -65.2627,
              timezone: 'America/La_Paz',
              population: 1200000,
              feature_code: 'PPLC'
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: {
            temperature: 18,
            windspeed: 8,
            weathercode: 3,
            time: '2026-04-13T12:00:00Z'
          },
          hourly: {
            relativehumidity_2m: [65]
          }
        })
      });

    const weather = await fetchWeatherByCity({ city: 'La Paz', state: 'La Paz', country: 'Bolívia' });

    expect(weather.location).toBe('La Paz, Bolivia');
    expect(weather.temperature).toBe(18);
    expect(weather.humidity).toBe(65);
  });

  it.each([
    ['Bolívia', 'BO'],
    ['Colômbia', 'CO'],
    ['Paraguai', 'PY'],
    ['Paraguay', 'PY'],
    ['Uruguai', 'UY'],
    ['Uruguay', 'UY'],
    ['Equador', 'EC'],
    ['Ecuador', 'EC'],
    ['Angola', 'AO']
  ])('normalizeCountry(%s) returns %s', (input, expected) => {
    expect(normalizeCountry(input)).toBe(expected);
  });
});
