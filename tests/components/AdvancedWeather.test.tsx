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

  it('adds only non-repeated cities from a batch search while preserving existing display items', async () => {
    const firstCity = { ...mockWeatherEntry };
    const secondCity = {
      ...mockWeatherEntry,
      location: 'Nova York, US',
      city: 'Nova York',
      state: 'NY',
      country: 'Estados Unidos'
    } as any;

    vi.spyOn(openMeteo, 'fetchWeatherByCity')
      .mockResolvedValueOnce(firstCity as any)
      .mockResolvedValueOnce(secondCity as any);

    const user = userEvent.setup();
    render(<AdvancedWeather />);

    await user.type(screen.getByLabelText(/cidade única/i), 'São Paulo, SP, Brasil');
    await user.click(screen.getByRole('button', { name: /buscar cidade única/i }));

    expect(await screen.findByText(/São Paulo, BR/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /busca múltipla/i }));
    await user.type(screen.getByPlaceholderText('Ex: Rio de Janeiro, Rio de Janeiro, Brasil; Nova York, Nova York, Estados Unidos'), 'São Paulo, SP, Brasil; Nova York, NY, Estados Unidos');
    await user.click(screen.getByRole('button', { name: /enviar busca múltipla/i }));

    expect(await screen.findByText(/Nova York, US/i)).toBeInTheDocument();
    expect(openMeteo.fetchWeatherByCity).toHaveBeenCalledTimes(2);
  });

  it('does not call the weather API when the list is full and the user declines replacement', async () => {
    const fetchSpy = vi.spyOn(openMeteo, 'fetchWeatherByCity').mockImplementation(async (query: any) => ({
      ...mockWeatherEntry,
      location: `${query.city}, ${query.country || 'BR'}`,
      city: query.city,
      state: query.state,
      country: query.country
    } as any));

    const user = userEvent.setup();
    render(<AdvancedWeather />);

    await user.click(screen.getByRole('button', { name: /busca múltipla/i }));
    const cityInput = screen.getByPlaceholderText('Ex: Rio de Janeiro, Rio de Janeiro, Brasil; Nova York, Nova York, Estados Unidos');
    await user.type(cityInput, Array.from({ length: 10 }, (_, index) => `Cidade ${index + 1}, ST, BR`).join('; '));
    await user.click(screen.getByRole('button', { name: /enviar busca múltipla/i }));

    expect(await screen.findByText(/Cidade 1, BR/i)).toBeInTheDocument();

    fetchSpy.mockClear();
    await user.clear(cityInput);
    await user.type(cityInput, 'Cidade 11, ST, BR');
    await user.click(screen.getByRole('button', { name: /enviar busca múltipla/i }));

    expect(await screen.findByRole('button', { name: /não/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /não/i }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.queryByText(/Cidade 11, BR/i)).not.toBeInTheDocument();
  });
});
