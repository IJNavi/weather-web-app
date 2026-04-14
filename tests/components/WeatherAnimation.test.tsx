import { render, screen } from '@testing-library/react';
import WeatherAnimation from '../../src/components/WeatherAnimation';

describe('WeatherAnimation', () => {
  it('shows the storm theme when the condition includes tempestade', () => {
    render(<WeatherAnimation weather="Tempestade severa" />);

    expect(screen.getByText(/tempestade/i)).toBeInTheDocument();
    expect(screen.getByText('⛈️')).toBeInTheDocument();
    expect(screen.getByText(/Raios e trovões/i)).toBeInTheDocument();
  });

  it('shows the clear theme when the condition is not matched by special cases', () => {
    render(<WeatherAnimation weather="Céu limpo" />);

    expect(screen.getByText(/céu limpo/i)).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByText(/Luz solar suave/i)).toBeInTheDocument();
  });
});
