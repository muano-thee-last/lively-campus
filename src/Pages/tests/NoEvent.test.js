// NoTickets.test.js

import { render, screen } from '@testing-library/react';
import NoTickets from '../EventHistory/noEvent';

describe('NoTickets Component', () => {
  test('renders an h1 with "No Events Yet" text', () => {
    render(<NoTickets />);
    
    // Check if the h1 element is present
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toBeInTheDocument();
    
    // Check if the h1 contains the correct text
    expect(headingElement).toHaveTextContent(/No Events Yet/i);
  });
});
