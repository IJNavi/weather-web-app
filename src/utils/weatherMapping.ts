const weatherThemes = {
  clear: {
    label: 'Céu limpo',
    icon: '☀️',
    features: ['Luz solar suave', 'Boa visibilidade', 'Clima seco']
  },
  cloudy: {
    label: 'Nublado',
    icon: '⛅',
    features: ['Nuvens leves', 'Clima confortável', 'Sensação agradável']
  },
  rain: {
    label: 'Chuva',
    icon: '🌧️',
    features: ['Possível chuva', 'Ar fresco', 'Cuidado com poças']
  },
  storm: {
    label: 'Tempestade',
    icon: '⛈️',
    features: ['Raios e trovões', 'Vento intenso', 'Fique em casa']
  },
  snow: {
    label: 'Neve',
    icon: '🌨️',
    features: ['Queda de neve', 'Calor extra recomendado', 'Baixa visibilidade']
  },
  fog: {
    label: 'Neblina',
    icon: '🌫️',
    features: ['Visibilidade reduzida', 'Ar úmido', 'Dirija com cuidado']
  }
};

type ThemeKey = keyof typeof weatherThemes;

/**
 * Retorna o tema visual do clima com base em uma descrição de condição.
 *
 * @param condition - Texto que descreve a condição de tempo recebida da API.
 * @returns Objeto contendo rótulo, ícone e características do clima.
 */
export function getWeatherTheme(condition: string) {
  const normalized = condition.toLowerCase();
  if (normalized.includes('rain') || normalized.includes('chuva')) return weatherThemes.rain;
  if (normalized.includes('storm') || normalized.includes('tempestade')) return weatherThemes.storm;
  if (normalized.includes('snow') || normalized.includes('neve')) return weatherThemes.snow;
  if (normalized.includes('fog') || normalized.includes('neblina') || normalized.includes('névoa')) return weatherThemes.fog;
  if (normalized.includes('cloud') || normalized.includes('nublado')) return weatherThemes.cloudy;
  return weatherThemes.clear;
}
