import { WeatherQuery } from '../services/openMeteo';

export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function buildLocationKey(query: WeatherQuery): string {
  return [query.city, query.state ?? '', query.country ?? '']
    .map(normalizeText)
    .join('|');
}

export function formatQueryLabel(query: WeatherQuery): string {
  return [query.city, query.state, query.country].filter(Boolean).join(', ');
}

export function parseBatchCities(input: string): WeatherQuery[] {
  const items = input
    .split(/\s*;\s*/)
    .map((item) => item.trim().replace(/[.]$/, ''))
    .filter(Boolean);

  const queries: WeatherQuery[] = [];

  for (const item of items) {
    if (queries.length >= 10) break;

    const parts = item.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) continue;

    const query: WeatherQuery = { city: parts[0] };
    if (parts.length >= 2) query.state = parts[1];
    if (parts.length >= 3) query.country = parts.slice(2).join(', ');
    queries.push(query);
  }

  return queries;
}
