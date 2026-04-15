import { WeatherQuery } from '../services/openMeteo';

/**
 * Normaliza texto para comparações independentes de maiúsculas/minúsculas.
 */
export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Gera uma chave única para a combinação cidade/estado/país.
 */
export function buildLocationKey(query: WeatherQuery): string {
  return [query.city, query.state ?? '', query.country ?? '']
    .map(normalizeText)
    .join('|');
}

/**
 * Constrói um rótulo legível para exibir a consulta ao usuário.
 */
export function formatQueryLabel(query: WeatherQuery): string {
  return [query.city, query.state, query.country].filter(Boolean).join(', ');
}

/**
 * Converte texto de busca múltipla em consultas individuais.
 *
 * Permite cidades separadas por ponto e vírgula, e campos de cada cidade por vírgula.
 */
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
