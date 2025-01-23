import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders welcome text', () => {
  render(<Home />); // Render the Home component
  const welcomeText = screen.getByText(/Welcome to Folio/i); 
  expect(welcomeText).toBeInTheDocument();
});