import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  const title = screen.getByText(/Tic Tac Toe/i);
  expect(title).toBeInTheDocument();
});

test('renders controls', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /New Round/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Reset Game/i })).toBeInTheDocument();
});
