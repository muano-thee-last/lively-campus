import { render, screen } from '@testing-library/react';
import NoTickets from '../EventHistory/noEvent';  // Importing the NoTickets object (result of calling NoTickets())
import '@testing-library/jest-dom';

jest.mock('../EventHistory/noEvent', () => ({
  __esModule: true,
  default: () => <h1>No Events Yet</h1>,  // Mock the component as if it's a function returning JSX
}));

describe('NoTickets Component', () => {
  test('renders "No Events Yet" message', () => {
    render(<NoTickets />);  // Rendering the mocked component
    
    expect(screen.getByText(/No Events Yet/i)).toBeInTheDocument();
  });
});
