import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../dashboard/footer';

describe('Footer component', () => {
  test('renders without crashing', () => {
    render(<Footer />);
  });

  test('applies correct id', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveAttribute('id', 'footer');
  });
});
