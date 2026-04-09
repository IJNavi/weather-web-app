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
    'portugal': 'PT',
    'pt': 'PT',
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
  };
  const normalized = normalizeText(country);
  return mappings[normalized] || country;
}

function getCityTranslations(city: string): string[] {
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
    'paris': ['paris', 'paris'],
    'roma': ['rome', 'roma'],
    'rome': ['rome', 'roma'],
    'madrid': ['madrid', 'madrid'],
    'berlim': ['berlin', 'berlim'],
    'berlin': ['berlin', 'berlim'],
    'tokyo': ['tokyo', 'tóquio'],
    'tóquio': ['tokyo', 'tóquio'],
    'pequim': ['beijing', 'pequim'],
    'beijing': ['beijing', 'pequim'],
    'moscou': ['moscow', 'moscou'],
    'moscow': ['moscow', 'moscou'],
    'sydney': ['sydney', 'sydney'],
    'cidade do cabo': ['cape town', 'cidade do cabo'],
    'cape town': ['cape town', 'cidade do cabo'],
    'cairo': ['cairo', 'cairo'],
    'mumbai': ['mumbai', 'bombaim'],
    'bombaim': ['mumbai', 'bombaim'],
    'bangalore': ['bangalore', 'bangalore'],
    'shanghai': ['shanghai', 'xangai'],
    'xangai': ['shanghai', 'xangai'],
    'hong kong': ['hong kong', 'hong kong'],
    'singapore': ['singapore', 'singapura'],
    'singapura': ['singapore', 'singapura'],
    'bangkok': ['bangkok', 'banguecoque'],
    'banguecoque': ['bangkok', 'banguecoque'],
    'dublin': ['dublin', 'dublin'],
    'amsterdam': ['amsterdam', 'amsterdã'],
    'amsterdã': ['amsterdam', 'amsterdã'],
    'vienna': ['vienna', 'viena'],
    'viena': ['vienna', 'viena'],
    'prague': ['prague', 'praga'],
    'praga': ['prague', 'praga'],
    'budapest': ['budapest', 'budapeste'],
    'budapeste': ['budapest', 'budapeste'],
    'warsaw': ['warsaw', 'varsóvia'],
    'varsóvia': ['warsaw', 'varsóvia'],
    'bucharest': ['bucharest', 'bucareste'],
    'bucareste': ['bucharest', 'bucareste'],
    'sofia': ['sofia', 'sofia'],
    'belgrade': ['belgrade', 'belgrado'],
    'belgrado': ['belgrade', 'belgrado'],
    'zagreb': ['zagreb', 'zagreb'],
    'sarajevo': ['sarajevo', 'sarajevo'],
    'skopje': ['skopje', 'escópia'],
    'escópia': ['skopje', 'escópia'],
    'tirana': ['tirana', 'tirana'],
    'podgorica': ['podgorica', 'podgorica'],
    'pristina': ['pristina', 'prístina'],
    'prístina': ['pristina', 'prístina'],
  };

  const normalized = normalizeText(city);
  return translations[normalized] || [city];
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
}>(results: ResultType[], query: WeatherQuery, cityVariants: string[]): ResultType | null {
  const normalizedCityVariants = cityVariants.map(normalizeText);

  // Primeiro, filtra apenas cidades com nome exato ou traduções exatas
  const exactCityMatches = results.filter((item) =>
    normalizedCityVariants.includes(normalizeText(item.name))
  );

  if (exactCityMatches.length === 0) {
    // Se não encontrou cidade exata, tenta busca parcial com variantes
    const partialCityMatches = results.filter((item) =>
      normalizedCityVariants.some((variant) =>
        normalizeText(item.name).includes(variant) ||
        variant.includes(normalizeText(item.name))
      )
    );
    if (partialCityMatches.length > 0) {
      return selectBestMatch(partialCityMatches, query);
    }
    return null;
  }

  return selectBestMatch(exactCityMatches, query);
}

function selectBestMatch<ResultType extends {
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
}>(candidates: ResultType[], query: WeatherQuery): ResultType | null {
  // Prioriza por filtros fornecidos
  const hasCountry = !!query.country;
  const hasState = !!query.state;

  // Caso 1: País E Estado fornecidos - match exato
  if (hasCountry && hasState) {
    const exactMatches = candidates.filter((item) => {
      const countryMatch = item.country_code?.toUpperCase() === query.country!.toUpperCase() ||
                          matchesFilter(item.country, query.country);
      const stateMatch = matchesFilter(item.admin1, query.state) ||
                        matchesFilter(item.admin1, expandStateAbbrev(query.state!));
      return countryMatch && stateMatch;
    });
    if (exactMatches.length > 0) return exactMatches[0];
  }

  // Caso 2: Apenas País fornecido
  if (hasCountry && !hasState) {
    const countryMatches = candidates.filter((item) =>
      item.country_code?.toUpperCase() === query.country!.toUpperCase() ||
      matchesFilter(item.country, query.country)
    );
    if (countryMatches.length > 0) return countryMatches[0];
  }

  // Caso 3: Apenas Estado fornecido
  if (!hasCountry && hasState) {
    const stateMatches = candidates.filter((item) =>
      matchesFilter(item.admin1, query.state) ||
      matchesFilter(item.admin1, expandStateAbbrev(query.state!))
    );
    if (stateMatches.length > 0) return stateMatches[0];
  }

  // Caso 4: Nenhum filtro adicional - retorna a primeira opção
  // Mas tenta priorizar países mais comuns/populosos
  const priorityCountries = ['BR', 'US', 'PT', 'ES', 'FR', 'GB', 'DE', 'IT'];
  const priorityMatch = candidates.find((item) =>
    item.country_code && priorityCountries.includes(item.country_code.toUpperCase())
  );

  return priorityMatch || candidates[0];
}

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
  let allResults: Array<{
    name: string;
    country: string;
    country_code?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }> = [];

  // Try each city variant until we find results
  for (const cityVariant of cityVariants) {
    const params = new URLSearchParams({
      name: cityVariant,
      count: '20',
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
          name: string;
          country: string;
          country_code?: string;
          admin1?: string;
          latitude: number;
          longitude: number;
          timezone: string;
        }>;
      }>(geocodeUrl);

      if (geoData.results && geoData.results.length > 0) {
        allResults = allResults.concat(geoData.results);
      }
    } catch (error) {
      // Continue to next variant if this one fails
      continue;
    }
  }

  if (allResults.length === 0) {
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
