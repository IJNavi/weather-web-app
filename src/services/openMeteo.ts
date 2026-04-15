import { WeatherData, WeatherForecastEntry } from '../types/weather';

/**
 * Parâmetros usados para buscar o clima por localização.
 *
 * - `city`: nome da cidade obrigatória.
 * - `state`: estado ou província opcional para diferenciar cidades com o mesmo nome.
 * - `country`: país opcional para melhorar a precisão da busca.
 */
type WeatherQuery = {
  city: string;
  state?: string;
  country?: string;
};

const DEFAULT_FETCH_TIMEOUT_MS = 10000;
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const API_TIMEOUT_MESSAGE = 'O tempo de resposta da API expirou. Tente novamente mais tarde.';
const API_RATE_LIMIT_MESSAGE = 'Limite de requisições da API atingido. Aguarde e tente novamente.';
const API_SERVER_ERROR_MESSAGE = 'Servidor de clima indisponível no momento. Tente novamente em alguns instantes.';
const API_REQUEST_ERROR_MESSAGE = 'Não foi possível buscar o clima. Verifique os dados e tente novamente.';
const API_NETWORK_ERROR_MESSAGE = 'Não foi possível conectar à API de clima. Verifique sua conexão e tente novamente.';
const API_INVALID_RESPONSE_MESSAGE = 'Resposta da API de clima no formato inesperado. Tente novamente mais tarde.';

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

async function fetchJson<T>(url: string, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(API_RATE_LIMIT_MESSAGE);
      }

      if (response.status >= 500) {
        throw new Error(API_SERVER_ERROR_MESSAGE);
      }

      throw new Error(API_REQUEST_ERROR_MESSAGE);
    }

    return response.json();
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(API_TIMEOUT_MESSAGE);
    }

    if (error instanceof SyntaxError) {
      throw new Error(API_INVALID_RESPONSE_MESSAGE);
    }

    if (error instanceof TypeError) {
      throw new Error(API_NETWORK_ERROR_MESSAGE);
    }

    throw error instanceof Error ? error : new Error('Erro inesperado na API de clima.');
  } finally {
    clearTimeout(timeoutId);
  }
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
  const upper = country.trim().toUpperCase();
  if (upper.length === 2) {
    return upper === 'UK' ? 'GB' : upper;
  }

  const normalized = normalizeText(country);
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
    'inglaterra': 'GB',
    'uk': 'GB',
    'canadá': 'CA',
    'canada': 'CA',
    'méxico': 'MX',
    'mexico': 'MX',
    'argentina': 'AR',
    'austrália': 'AU',
    'australia': 'AU',
    'portugal': 'PT',
    'holanda': 'NL',
    'netherlands': 'NL',
    'belgica': 'BE',
    'belgium': 'BE',
    'suécia': 'SE',
    'sweden': 'SE',
    'noruega': 'NO',
    'norway': 'NO',
    'dinamarca': 'DK',
    'denmark': 'DK',
    'finlandia': 'FI',
    'finland': 'FI',
    'russia': 'RU',
    'rússia': 'RU',
    'polonia': 'PL',
    'poland': 'PL',
    'turquia': 'TR',
    'turkey': 'TR',
    'grecia': 'GR',
    'greece': 'GR',
    'egito': 'EG',
    'egypt': 'EG',
    'marrocos': 'MA',
    'morocco': 'MA',
    'africa do sul': 'ZA',
    'south africa': 'ZA',
    'nigeria': 'NG',
    'kenya': 'KE',
    'india': 'IN',
    'índia': 'IN',
    'tailandia': 'TH',
    'thailand': 'TH',
    'coreia do sul': 'KR',
    'south korea': 'KR',
    'indonesia': 'ID',
    'malasia': 'MY',
    'malaysia': 'MY',
    'singapura': 'SG',
    'singapore': 'SG',
    'filipinas': 'PH',
    'philippines': 'PH',
    'vietnam': 'VN',
    'vietnã': 'VN',
    'nova zelandia': 'NZ',
    'new zealand': 'NZ',
    'chile': 'CL',
    'peru': 'PE',
    'perú': 'PE',
    'colombia': 'CO',
    'colômbia': 'CO',
    'venezuela': 'VE',
    'equador': 'EC',
    'ecuador': 'EC',
    'uruguai': 'UY',
    'uruguay': 'UY',
    'paraguai': 'PY',
    'paraguay': 'PY',
    'bolivia': 'BO',
    'panama': 'PA',
    'panamá': 'PA',
    'costa rica': 'CR',
    'cuba': 'CU',
    'republica dominicana': 'DO',
    'dominican republic': 'DO',
    'jamaica': 'JM',
    'irlanda': 'IE',
    'ireland': 'IE',
    'suica': 'CH',
    'switzerland': 'CH',
    'austria': 'AT',
    'argélia': 'DZ',
    'algeria': 'DZ',
  };
  return mappings[normalized] || country;
}

function removeDiacritics(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function getCityTranslations(city: string): string[] {
  const normalized = normalizeText(city);
  const ascii = removeDiacritics(normalized);
  const variants = [normalized];

  if (ascii !== normalized) {
    variants.push(ascii);
  }

  const translations: Record<string, string[]> = {
    'lisboa': ['lisbon', 'lisboa'],
    'lisbon': ['lisbon', 'lisboa'],
    'são paulo': ['sao paulo', 'são paulo'],
    'sao paulo': ['sao paulo', 'são paulo'],
    'rio de janeiro': ['rio de janeiro', 'rio'],
    'nova york': ['new york', 'nova york'],
    'new york': ['new york', 'nova york'],
    'londres': ['london', 'londres'],
    'london': ['london', 'londres'],
    'roma': ['rome', 'roma'],
    'rome': ['rome', 'roma'],
    'berlim': ['berlin', 'berlim'],
    'berlin': ['berlin', 'berlim'],
    'tóquio': ['tokyo', 'tóquio'],
    'tokyo': ['tokyo', 'tóquio'],
    'pequim': ['beijing', 'pequim'],
    'beijing': ['beijing', 'pequim'],
    'bombaim': ['mumbai', 'bombaim'],
    'mumbai': ['mumbai', 'bombaim'],
    'xangai': ['shanghai', 'xangai'],
    'shanghai': ['shanghai', 'xangai'],
    'singapura': ['singapore', 'singapura'],
    'singapore': ['singapore', 'singapura'],
    'banguecoque': ['bangkok', 'banguecoque'],
    'bangkok': ['bangkok', 'banguecoque'],
    'amsterdã': ['amsterdam', 'amsterdã'],
    'amsterdam': ['amsterdam', 'amsterdã'],
    'viena': ['vienna', 'viena'],
    'vienna': ['vienna', 'viena'],
    'praga': ['prague', 'praga'],
    'prague': ['prague', 'praga'],
    'budapeste': ['budapest', 'budapeste'],
    'budapest': ['budapest', 'budapeste'],
  };

  const mapped = translations[normalized] || translations[ascii] || [];
  variants.push(...mapped);

  return Array.from(new Set(variants));
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
  population?: number;
  feature_code?: string;
}>(results: ResultType[], query: WeatherQuery, cityVariants: string[]): ResultType | null {
  const normalizedCityVariants = cityVariants.map(normalizeText);

  const exactCityMatches = results.filter((item) =>
    normalizedCityVariants.includes(normalizeText(item.name))
  );

  if (exactCityMatches.length > 0) {
    const exactStateMatches = exactCityMatches.filter((item) => isStateMatch(item, query.state));
    if (exactStateMatches.length > 0) {
      return selectBestMatch(exactStateMatches, query, normalizedCityVariants);
    }

    const exactCountryMatches = exactCityMatches.filter((item) => isCountryMatch(item, query.country));
    if (exactCountryMatches.length > 0) {
      return selectBestMatch(exactCountryMatches, query, normalizedCityVariants);
    }

    return selectBestMatch(exactCityMatches, query, normalizedCityVariants);
  }

  const partialCityMatches = results.filter((item) =>
    normalizedCityVariants.some((variant) =>
      normalizeText(item.name).includes(variant) ||
      variant.includes(normalizeText(item.name))
    )
  );

  if (partialCityMatches.length > 0) {
    const partialStateMatches = partialCityMatches.filter((item) => isStateMatch(item, query.state));
    if (partialStateMatches.length > 0) {
      return selectBestMatch(partialStateMatches, query, normalizedCityVariants);
    }

    const partialCountryMatches = partialCityMatches.filter((item) => isCountryMatch(item, query.country));
    if (partialCountryMatches.length > 0) {
      return selectBestMatch(partialCountryMatches, query, normalizedCityVariants);
    }

    return selectBestMatch(partialCityMatches, query, normalizedCityVariants);
  }

  return null;
}

function isCountryMatch<ResultType extends { country: string; country_code?: string }>(item: ResultType, country?: string): boolean {
  if (!country) return false;
  return (
    item.country_code?.toUpperCase() === country.toUpperCase() ||
    matchesFilter(item.country, country)
  );
}

function isStateMatch<ResultType extends { admin1?: string }>(item: ResultType, state?: string): boolean {
  if (!state) return false;
  const normalizedState = normalizeText(state);
  const expandedState = expandStateAbbrev(state) || state;
  return (
    matchesFilter(item.admin1, normalizedState) ||
    matchesFilter(item.admin1, expandedState)
  );
}

function getLocationScore<ResultType extends {
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  population?: number;
  feature_code?: string;
}>(item: ResultType, query: WeatherQuery, normalizedCityVariants: string[]): number {
  const normalizedName = normalizeText(item.name);
  const exactName = normalizedCityVariants.includes(normalizedName);
  const partialName = normalizedCityVariants.some((variant) =>
    normalizedName.includes(variant) || variant.includes(normalizedName)
  );

  const countryMatch = isCountryMatch(item, query.country);
  const stateMatch = isStateMatch(item, query.state);

  let score = 0;
  if (countryMatch) score += 400;
  if (stateMatch) score += 350;
  if (exactName) score += 250;
  else if (partialName) score += 120;
  if (item.feature_code === 'PPLC') score += 180;
  if (item.feature_code === 'PPLA') score += 120;
  if (item.feature_code === 'PPLA2') score += 90;
  if (item.population) score += Math.log10(item.population + 1) * 10;

  if (!query.country && !query.state && item.country_code) {
    const priorityCountries = ['PT', 'BR', 'US', 'ES', 'FR', 'GB', 'DE', 'IT', 'CA', 'AU'];
    if (priorityCountries.includes(item.country_code.toUpperCase())) {
      score += 30;
    }
  }

  return score;
}

function selectBestMatch<ResultType extends {
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  population?: number;
  feature_code?: string;
}>(candidates: ResultType[], query: WeatherQuery, normalizedCityVariants: string[]): ResultType | null {
  if (candidates.length === 0) return null;

  return candidates
    .map((item) => ({ item, score: getLocationScore(item, query, normalizedCityVariants) }))
    .sort((a, b) => b.score - a.score)[0]?.item || null;
}

/**
 * Busca o clima atual para uma localização informada pelo usuário.
 *
 * @param query - Objeto de consulta que descreve a localização.
 * @param query.city - Nome da cidade obrigatória.
 * @param query.state - Nome ou sigla do estado/província para melhorar a precisão em cidades ambíguas (opcional).
 * @param query.country - Nome ou código do país para melhorar a correspondência (opcional).
 * @returns Promise que resolve com os dados de clima atuais (`WeatherData`) para a localização selecionada.
 *
 * @example
 * const weather = await fetchWeatherByCity({
 *   city: 'São Paulo',
 *   state: 'SP',
 *   country: 'Brasil'
 * });
 * console.log(weather.temperature, weather.condition);
 */
export async function fetchWeatherByCity(query: WeatherQuery): Promise<WeatherData> {
  // Normalize query for better API matching
  const normalizedQuery: WeatherQuery = {
    city: query.city,
    state: query.state ? normalizeState(query.state) : undefined,
    country: query.country ? normalizeCountry(query.country) : undefined,
  };

  // Try different translations of the city name
  const cityVariants = getCityTranslations(normalizedQuery.city);
  const admin1Filter = normalizedQuery.state ? expandStateAbbrev(normalizedQuery.state) || normalizedQuery.state : undefined;
  const resultsByKey = new Map<string, {
    id?: number;
    name: string;
    country: string;
    country_code?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
    population?: number;
    feature_code?: string;
  }>();
  let lastServiceError: Error | null = null;

  const addToResults = (item: {
    id?: number;
    name: string;
    country: string;
    country_code?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
    population?: number;
    feature_code?: string;
  }) => {
    const key = item.id
      ? `id:${item.id}`
      : `${item.name}|${item.country_code || ''}|${item.admin1 || ''}|${item.latitude}|${item.longitude}`;
    if (!resultsByKey.has(key)) {
      resultsByKey.set(key, item);
    }
  };

  for (const cityVariant of cityVariants) {
    const params = new URLSearchParams({
      name: cityVariant,
      count: '50',
      language: 'en',
      format: 'json'
    });

    if (normalizedQuery.country) {
      params.set('country', normalizedQuery.country);
    }

    if (admin1Filter) {
      params.set('admin1', admin1Filter);
    }

    const geocodeUrl = `${GEOCODING_URL}?${params.toString()}`;

    try {
      const geoData = await fetchJson<{
        results?: Array<{
          id?: number;
          name: string;
          country: string;
          country_code?: string;
          admin1?: string;
          latitude: number;
          longitude: number;
          timezone: string;
          population?: number;
          feature_code?: string;
        }>;
      }>(geocodeUrl);

      if (geoData.results && geoData.results.length > 0) {
        geoData.results.forEach(addToResults);
      }
    } catch (error) {
      if (error instanceof Error) {
        lastServiceError = error;
      }
      continue;
    }
  }

  let allResults = Array.from(resultsByKey.values());

  if (allResults.length === 0 && (normalizedQuery.country || admin1Filter)) {
    // If the filters returned nothing, retry without them to avoid missing valid cities.
    for (const cityVariant of cityVariants) {
      const params = new URLSearchParams({
        name: cityVariant,
        count: '50',
        language: 'en',
        format: 'json'
      });

      const geocodeUrl = `${GEOCODING_URL}?${params.toString()}`;

      try {
        const geoData = await fetchJson<{
          results?: Array<{
            id?: number;
            name: string;
            country: string;
            country_code?: string;
            admin1?: string;
            latitude: number;
            longitude: number;
            timezone: string;
            population?: number;
            feature_code?: string;
          }>;
        }>(geocodeUrl);

        if (geoData.results && geoData.results.length > 0) {
          geoData.results.forEach(addToResults);
        }
      } catch (error) {
        if (error instanceof Error) {
          lastServiceError = error;
        }
        continue;
      }
    }

    allResults = Array.from(resultsByKey.values());
  }

  if (allResults.length === 0) {
    if (lastServiceError) {
      throw lastServiceError;
    }

    throw new Error('Cidade não encontrada. Tente outro nome ou adicione estado e país para refinar a busca.');
  }

  const location = selectLocation(allResults, normalizedQuery, cityVariants);

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
    } | null;
    hourly?: { relativehumidity_2m?: number[] };
  }>(`${WEATHER_URL}?${queryParams.toString()}`);

  if (
    !weatherData ||
    !weatherData.current_weather ||
    typeof weatherData.current_weather.temperature !== 'number' ||
    typeof weatherData.current_weather.windspeed !== 'number' ||
    typeof weatherData.current_weather.weathercode !== 'number' ||
    typeof weatherData.current_weather.time !== 'string'
  ) {
    throw new Error(API_INVALID_RESPONSE_MESSAGE);
  }

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
    description: getWeatherDescription(weatherData.current_weather.weathercode),
    city: normalizedQuery.city,
    state: normalizedQuery.state,
    country: normalizedQuery.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone
  };
}

async function fetchWeatherForecastByLocation(location: {
  latitude: number;
  longitude: number;
  timezone: string;
}): Promise<WeatherForecastEntry[]> {
  const queryParams = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    timezone: location.timezone,
    temperature_unit: 'celsius',
    windspeed_unit: 'kmh',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode',
    forecast_days: '7',
    format: 'json'
  });

  const forecastData = await fetchJson<{
    daily?: {
      time?: string[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      weathercode?: number[];
    };
  }>(`${WEATHER_URL}?${queryParams.toString()}`);

  const daily = forecastData.daily;
  if (!daily?.time || !daily.temperature_2m_max || !daily.temperature_2m_min || !daily.weathercode) {
    throw new Error(API_INVALID_RESPONSE_MESSAGE);
  }

  return daily.time.map((date, index) => ({
    date,
    maxTemp: daily.temperature_2m_max?.[index] ?? 0,
    minTemp: daily.temperature_2m_min?.[index] ?? 0,
    weathercode: daily.weathercode?.[index] ?? 0,
    icon: getWeatherEmoji(daily.weathercode?.[index] ?? 0),
    description: getWeatherDescription(daily.weathercode?.[index] ?? 0)
  }));
}

export type { WeatherQuery };
export { fetchWeatherForecastByLocation };

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
