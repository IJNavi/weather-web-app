import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherForm from '../../src/components/WeatherForm';

describe('WeatherForm', () => {
  it('submits trimmed values and calls onSearch once', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();

    render(<WeatherForm onSearch={handleSearch} loading={false} />);

    await user.type(screen.getByLabelText(/cidade/i), '  São Paulo  ');
    await user.type(screen.getByLabelText(/estado/i), ' SP ');
    await user.type(screen.getByLabelText(/país/i), ' Brasil ');
    await user.click(screen.getByRole('button', { name: /buscar clima/i }));

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith({
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil'
    });
  });

  it('does not call onSearch when city is empty', async () => {
    const handleSearch = vi.fn();
    const user = userEvent.setup();

    render(<WeatherForm onSearch={handleSearch} loading={false} />);

    await user.click(screen.getByRole('button', { name: /buscar clima/i }));

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('disables the submit button and shows loading text', () => {
    render(<WeatherForm onSearch={vi.fn()} loading={true} />);

    expect(screen.getByRole('button', { name: /buscando.../i })).toBeDisabled();
  });
});
