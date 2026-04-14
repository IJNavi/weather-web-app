import { render, screen } from '@testing-library/react';
import WeatherCard from '../../src/components/WeatherCard';
import { WeatherData } from '../../src/types/weather';

describe('WeatherCard', () => {
  it('renders loading state text when loading is true', () => {
    render(<WeatherCard weather={null} loading={true} />);

    expect(screen.getByText(/carregando dados do clima/i)).toBeInTheDocument();
  });

  it('renders prompt when no weather is available', () => {
    render(<WeatherCard weather={null} loading={false} />);

    expect(screen.getByText(/digite uma cidade e clique em buscar/i)).toBeInTheDocument();
  });

  it('renders weather details when weather data is provided', () => {
    const weather: WeatherData = {
      location: 'São Paulo, BR',
      temperature: 22.4,
      feelsLike: 21.1,
      windSpeed: 14.2,
      humidity: 78,
      localTime: '14:30',
      conditionCode: 0,
      conditionIcon: '☀️',
      description: 'Céu limpo'
    };

    render(<WeatherCard weather={weather} loading={false} />);

    expect(screen.getByText(/são paulo, br/i)).toBeInTheDocument();
    expect(screen.getByText(/22.4°C/i)).toBeInTheDocument();
    expect(screen.getByText(/céu limpo/i)).toBeInTheDocument();
    expect(screen.getByText(/21.1°C/i)).toBeInTheDocument();
    expect(screen.getByText(/14.2 km\/h/i)).toBeInTheDocument();
    expect(screen.getByText(/78%/i)).toBeInTheDocument();
    expect(screen.getByText(/14:30/i)).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });
});
