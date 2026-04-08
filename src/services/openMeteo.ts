import { WeatherData } from '../types/weather';

type WeatherQuery = {
  city: string;
  state?: string;
  country?: string;
};

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Falha na requisição à API de clima.');
  }
  return response.json();
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function matchesFilter(value: string | undefined, filter?: string): boolean {
  if (!filter) return true;
  if (!value) return false;
  return normalizeText(value).includes(normalizeText(filter));
}

function normalizeCountry(country: string): string {
  const mappings: Record<string, string> = {
    'eua': 'US',
    'estados unidos': 'US',
    'united states': 'US',
    'usa': 'US',
    'brasil': 'BR',
    'brazil': 'BR',
    'frança': 'FR',
    'france': 'FR',
    'alemanha': 'DE',
    'germany': 'DE',
    'espanha': 'ES',
    'spain': 'ES',
    'itália': 'IT',
    'italy': 'IT',
    'japão': 'JP',
    'japan': 'JP',
    'china': 'CN',
    'reino unido': 'GB',
    'united kingdom': 'GB',
    'uk': 'GB',
    'canadá': 'CA',
    'canada': 'CA',
    'méxico': 'MX',
    'mexico': 'MX',
    'argentina': 'AR',
    'austrália': 'AU',
    'australia': 'AU',
  };
  const normalized = normalizeText(country);
  return mappings[normalized] || country;
}

function normalizeState(state: string): string {
  const mappings: Record<string, string> = {
    'nova york': 'NY',
    'new york': 'NY',
    'são paulo': 'SP',
    'rio de janeiro': 'RJ',
    'rio grande do sul': 'RS',
    'minas gerais': 'MG',
    'bahia': 'BA',
    'paraná': 'PR',
    'santa catarina': 'SC',
    'pernambuco': 'PE',
    'ceará': 'CE',
    'goiás': 'GO',
    'paraíba': 'PB',
    'maranhão': 'MA',
    'amazonas': 'AM',
    'espírito santo': 'ES',
    'mato grosso': 'MT',
    'mato grosso do sul': 'MS',
    'rio grande do norte': 'RN',
    'alagoas': 'AL',
    'sergipe': 'SE',
    'tocantins': 'TO',
    'roraima': 'RR',
    'acre': 'AC',
    'amapá': 'AP',
    'rondônia': 'RO',
    'distrito federal': 'DF',
    'california': 'CA',
    'texas': 'TX',
    'florida': 'FL',
    'illinois': 'IL',
    'pennsylvania': 'PA',
    'ohio': 'OH',
    'georgia': 'GA',
    'north carolina': 'NC',
    'michigan': 'MI',
    'new jersey': 'NJ',
    'virginia': 'VA',
    'washington': 'WA',
    'arizona': 'AZ',
    'tennessee': 'TN',
    'indiana': 'IN',
    'missouri': 'MO',
    'maryland': 'MD',
    'wisconsin': 'WI',
    'colorado': 'CO',
    'minnesota': 'MN',
    'kentucky': 'KY',
    'oregon': 'OR',
    'oklahoma': 'OK',
    'connecticut': 'CT',
    'utah': 'UT',
    'iowa': 'IA',
    'nevada': 'NV',
    'arkansas': 'AR',
    'kansas': 'KS',
    'new mexico': 'NM',
    'nebraska': 'NE',
    'west virginia': 'WV',
    'idaho': 'ID',
    'hawaii': 'HI',
    'new hampshire': 'NH',
    'maine': 'ME',
    'rhode island': 'RI',
    'delaware': 'DE',
    'south dakota': 'SD',
    'north dakota': 'ND',
    'alaska': 'AK',
    'vermont': 'VT',
    'wyoming': 'WY',
  };
  const normalized = normalizeText(state);
  return mappings[normalized] || state;
}

function expandStateAbbrev(abbrev: string): string | undefined {
  const expansions: Record<string, string> = {
    'NY': 'New York',
    'SP': 'São Paulo',
    'RJ': 'Rio de Janeiro',
    'RS': 'Rio Grande do Sul',
    'MG': 'Minas Gerais',
    'BA': 'Bahia',
    'PR': 'Paraná',
    'SC': 'Santa Catarina',
    'PE': 'Pernambuco',
    'CE': 'Ceará',
    'GO': 'Goiás',
    'PB': 'Paraíba',
    'MA': 'Maranhão',
    'AM': 'Amazonas',
    'ES': 'Espírito Santo',
    'MT': 'Mato Grosso',
    'MS': 'Mato Grosso do Sul',
    'RN': 'Rio Grande do Norte',
    'AL': 'Alagoas',
    'SE': 'Sergipe',
    'TO': 'Tocantins',
    'RR': 'Roraima',
    'AC': 'Acre',
    'AP': 'Amapá',
    'RO': 'Rondônia',
    'DF': 'Distrito Federal',
    'CA': 'California',
    'TX': 'Texas',
    'FL': 'Florida',
    'IL': 'Illinois',
    'PA': 'Pennsylvania',
    'OH': 'Ohio',
    'GA': 'Georgia',
    'NC': 'North Carolina',
    'MI': 'Michigan',
    'NJ': 'New Jersey',
    'VA': 'Virginia',
    'WA': 'Washington',
    'AZ': 'Arizona',
    'TN': 'Tennessee',
    'IN': 'Indiana',
    'MO': 'Missouri',
    'MD': 'Maryland',
    'WI': 'Wisconsin',
    'CO': 'Colorado',
    'MN': 'Minnesota',
    'KY': 'Kentucky',
    'OR': 'Oregon',
    'OK': 'Oklahoma',
    'CT': 'Connecticut',
    'UT': 'Utah',
    'IA': 'Iowa',
    'NV': 'Nevada',
    'AR': 'Arkansas',
    'KS': 'Kansas',
    'NM': 'New Mexico',
    'NE': 'Nebraska',
    'WV': 'West Virginia',
    'ID': 'Idaho',
    'HI': 'Hawaii',
    'NH': 'New Hampshire',
    'ME': 'Maine',
    'RI': 'Rhode Island',
    'DE': 'Delaware',
    'SD': 'South Dakota',
    'ND': 'North Dakota',
    'AK': 'Alaska',
    'VT': 'Vermont',
    'WY': 'Wyoming',
  };
  return expansions[abbrev.toUpperCase()];
}

function selectLocation<ResultType extends {
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}>(results: ResultType[], query: WeatherQuery): ResultType | null {
  const normalizedCity = normalizeText(query.city);
  const exactCityResults = results.filter((item) => normalizeText(item.name) === normalizedCity);

  const exactCountryMatches = exactCityResults.filter((item) =>
    query.country
      ? item.country_code?.toUpperCase() === query.country.toUpperCase() ||
        matchesFilter(item.country, query.country)
      : true
  );

  const exactStateMatches = exactCountryMatches.filter((item) =>
    query.state
      ? matchesFilter(item.admin1, query.state) ||
        matchesFilter(item.admin1, expandStateAbbrev(query.state))
      : true
  );

  if (exactStateMatches.length > 0) {
    return exactStateMatches[0];
  }
  if (exactCountryMatches.length > 0) {
    return exactCountryMatches[0];
  }
  if (exactCityResults.length > 0) {
    return exactCityResults[0];
  }

  const filtered = results.filter((item) => {
    const countryMatch = query.country
      ? item.country_code?.toUpperCase() === query.country.toUpperCase() ||
        matchesFilter(item.country, query.country)
      : true;

    const stateMatch = query.state
      ? matchesFilter(item.admin1, query.state) ||
        matchesFilter(item.admin1, expandStateAbbrev(query.state))
      : true;

    return countryMatch && stateMatch;
  });

  return filtered.length > 0 ? filtered[0] : results[0] ?? null;
}

export async function fetchWeatherByCity(query: WeatherQuery): Promise<WeatherData> {
  // Normalize query for better API matching
  const normalizedQuery: WeatherQuery = {
    city: query.city,
    state: query.state ? normalizeState(query.state) : undefined,
    country: query.country ? normalizeCountry(query.country) : undefined,
  };

  const geocodeUrl = `${GEOCODING_URL}?name=${encodeURIComponent(normalizedQuery.city)}&count=10&language=en&format=json`;

  const geoData = await fetchJson<{
    results?: Array<{
      name: string;
      country: string;
      country_code?: string;
      admin1?: string;
      latitude: number;
      longitude: number;
      timezone: string;
    }>;
  }>(geocodeUrl);

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error('Cidade não encontrada. Tente outro nome ou adicione estado e país para refinar a busca.');
  }

  const location = selectLocation(geoData.results, normalizedQuery);

  if (!location) {
    throw new Error('Cidade não encontrada. Tente outro nome ou adicione estado e país para refinar a busca.');
  }

  const queryParams = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current_weather: 'true',
    timezone: location.timezone,
    temperature_unit: 'celsius',
    windspeed_unit: 'kmh'
  });

  const weatherData = await fetchJson<{
    current_weather: {
      temperature: number;
      windspeed: number;
      weathercode: number;
      time: string;
    };
    hourly?: { relativehumidity_2m?: number[] };
  }>(`${WEATHER_URL}?${queryParams.toString()}`);

  const humidity = weatherData.hourly?.relativehumidity_2m?.[0] ?? 55;

  return {
    location: `${location.name}, ${location.country}`,
    temperature: weatherData.current_weather.temperature,
    feelsLike: weatherData.current_weather.temperature,
    windSpeed: weatherData.current_weather.windspeed,
    humidity,
    localTime: new Date(weatherData.current_weather.time).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    conditionCode: weatherData.current_weather.weathercode,
    conditionIcon: getWeatherEmoji(weatherData.current_weather.weathercode),
    description: getWeatherDescription(weatherData.current_weather.weathercode)
  };
}

export type { WeatherQuery };

function getWeatherEmoji(code: number) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if ([45, 48].includes(code)) return '🌫️';
  if (code <= 77) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}

function getWeatherDescription(code: number) {
  if (code === 0) return 'Céu limpo';
  if (code <= 3) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Neblina ou névoa';
  if (code <= 77) return 'Chuva leve';
  if (code <= 86) return 'Neve ou granizo';
  if (code <= 99) return 'Tempestade';
  return 'Clima ameno';
}
