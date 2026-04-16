import { describe, expect, it } from 'vitest';
import { buildLocationKey, formatQueryLabel, parseBatchCities } from '../../src/utils/advancedWeather';

describe('advancedWeather utilities', () => {
  it('builds a stable key from city, state and country', () => {
    const key = buildLocationKey({ city: 'São Paulo', state: 'SP', country: 'Brasil' });
    expect(key).toBe('sao paulo|sp|br');
  });

  it('formats query labels without empty fields', () => {
    const label = formatQueryLabel({ city: 'Lisboa', state: 'Lisboa', country: 'Portugal' });
    expect(label).toBe('Lisboa, Lisboa, Portugal');
  });

  it('parses a batch input with semicolon separators and trailing periods', () => {
    const queries = parseBatchCities('Rio de Janeiro, Rio de Janeiro, Brasil; Nova York, Nova York, Estados Unidos.');

    expect(queries).toEqual([
      { city: 'Rio de Janeiro', state: 'Rio de Janeiro', country: 'Brasil' },
      { city: 'Nova York', state: 'Nova York', country: 'Estados Unidos' }
    ]);
  });

  it('limits the parsed batch to 10 cities', () => {
    const input = Array.from({ length: 12 }, (_, index) => `Cidade ${index + 1}`).join('; ');
    const queries = parseBatchCities(input);

    expect(queries).toHaveLength(10);
    expect(queries[0].city).toBe('Cidade 1');
    expect(queries[9].city).toBe('Cidade 10');
  });
});
