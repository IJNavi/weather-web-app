import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import * as openMeteo from '../../src/services/openMeteo';
import AdvancedWeather from '../../src/components/AdvancedWeather';

const mockWeatherEntry = {
  location: 'São Paulo, BR',
  temperature: 22.4,
  feelsLike: 22.4,
  windSpeed: 14.2,
  humidity: 70,
  localTime: '14/04/2026 12:00',
  conditionCode: 0,
  conditionIcon: '☀️',
  description: 'Céu limpo',
  city: 'São Paulo',
  state: 'SP',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo'
};

describe('AdvancedWeather', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the advanced search interface and adds a city card after search', async () => {
    vi.spyOn(openMeteo, 'fetchWeatherByCity').mockResolvedValue(mockWeatherEntry as any);

    const user = userEvent.setup();
    render(<AdvancedWeather />);

    await user.type(screen.getByLabelText(/cidade única/i), 'São Paulo, SP, Brasil');
    await user.click(screen.getByRole('button', { name: /buscar cidade única/i }));

    expect(await screen.findByText(/São Paulo, BR/i)).toBeInTheDocument();
    expect(screen.getByText(/Céu limpo/i)).toBeInTheDocument();
  });

  it('toggles the batch search form and shows the textarea', async () => {
    const user = userEvent.setup();
    render(<AdvancedWeather />);

    await user.click(screen.getByRole('button', { name: /busca múltipla/i }));

    expect(screen.getByPlaceholderText('Ex: Rio de Janeiro, Rio de Janeiro, Brasil; Nova York, Nova York, Estados Unidos')).toBeInTheDocument();
  });
});
