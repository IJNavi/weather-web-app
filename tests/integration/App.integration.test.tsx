import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import * as openMeteo from '../../src/services/openMeteo';
import App from '../../src/App';

const mockWeatherData = {
  location: 'São Paulo, BR',
  temperature: 22.4,
  feelsLike: 22.4,
  windSpeed: 14.2,
  humidity: 70,
  localTime: '13/04/2026 12:00',
  conditionCode: 0,
  conditionIcon: '☀️',
  description: 'Céu limpo'
};

describe('App integration', () => {
  const mockedFetchWeather = vi.spyOn(openMeteo, 'fetchWeatherByCity');

  beforeEach(() => {
    mockedFetchWeather.mockReset();
  });

  afterAll(() => {
    mockedFetchWeather.mockRestore();
  });

  it('renders weather details after a successful search', async () => {
    mockedFetchWeather.mockResolvedValue(mockWeatherData as any);

    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo');
    await user.click(screen.getByRole('button', { name: /buscar clima/i }));

    expect(mockedFetchWeather).toHaveBeenCalledWith({ city: 'São Paulo', state: undefined, country: undefined });
    expect(await screen.findByText(/São Paulo, BR/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /22.4°C/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Céu limpo/i).length).toBeGreaterThan(0);
  });

  it('prevents multiple searches in quick succession', async () => {
    mockedFetchWeather.mockResolvedValue(mockWeatherData as any);

    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo');
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });

    await user.click(searchButton);
    await user.click(searchButton);

    expect(mockedFetchWeather).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/São Paulo, BR/i)).toBeInTheDocument();
  });

  it('uses advanced single-city search with accented city and country', async () => {
    mockedFetchWeather.mockResolvedValue(mockWeatherData as any);

    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /verificação avançada/i }));
    await user.type(screen.getByLabelText(/cidade única/i), 'Assunção, Distrito Federal, Brasil');
    await user.click(screen.getByRole('button', { name: /buscar cidade única/i }));

    expect(mockedFetchWeather).toHaveBeenCalledWith({
      city: 'Assunção',
      state: 'Distrito Federal',
      country: 'Brasil'
    });
    expect(await screen.findByText(/São Paulo, BR/i)).toBeInTheDocument();
  });

  it('shows an error if the weather service fails', async () => {
    mockedFetchWeather.mockRejectedValue(new Error('Cidade não encontrada.'));

    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/cidade/i), 'Cidade Inválida');
    await user.click(screen.getByRole('button', { name: /buscar clima/i }));

    expect(await screen.findByText(/Cidade não encontrada/i)).toBeInTheDocument();
  });

  it('shows the API timeout or service unavailable message from the weather service', async () => {
    mockedFetchWeather.mockRejectedValue(new Error('Servidor de clima indisponível no momento. Tente novamente em alguns instantes.'));

    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/cidade/i), 'Lisboa');
    await user.click(screen.getByRole('button', { name: /buscar clima/i }));

    expect(await screen.findByText(/Servidor de clima indisponível/i)).toBeInTheDocument();
  });
});
