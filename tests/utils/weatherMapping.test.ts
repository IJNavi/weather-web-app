import { getWeatherTheme } from '../../src/utils/weatherMapping';

describe('getWeatherTheme', () => {
  it('returns rain theme for rain keywords', () => {
    expect(getWeatherTheme('Chuva forte').label).toBe('Chuva');
  });

  it('returns storm theme for storm keywords', () => {
    expect(getWeatherTheme('Tempestade com raios').label).toBe('Tempestade');
  });

  it('returns snow theme for snow keywords', () => {
    expect(getWeatherTheme('Neve leve').label).toBe('Neve');
  });

  it('returns fog theme for fog keywords', () => {
    expect(getWeatherTheme('Névoa pela manhã').label).toBe('Neblina');
  });

  it('returns clear theme for other keywords', () => {
    expect(getWeatherTheme('Céu limpo').label).toBe('Céu limpo');
  });
});
