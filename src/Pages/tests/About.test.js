import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About/About';
import Footer from '../dashboard/footer';

jest.mock('../dashboard/footer', () => () => <div>Mocked Footer</div>);

beforeEach(() => {
  global.IntersectionObserver = jest.fn(function (callback) {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
    this.triggerIntersect = (isIntersecting) => {
      callback([{ isIntersecting }]);
    };
  });
});

describe('About Component', () => {
  test('initial states are set correctly', () => {
    render(<About />);
    const navMenu = screen.getByRole('navigation');
    expect(navMenu).not.toHaveClass('open');

    const sectionElement = screen.getByTestId('about-section');
    expect(sectionElement).not.toHaveClass('visible');
  });

  test('renders all elements correctly', () => {
    render(<About />);
    expect(screen.getByTestId('logo-image')).toBeInTheDocument();
    expect(screen.getByTestId('logo-text')).toHaveTextContent('LivelyCampus');
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByTestId('hero-title')).toBeInTheDocument();
    expect(screen.getByTestId('hero-description')).toHaveTextContent(/Connecting students with exciting campus events/i);
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });

  test('toggles the menu when burger button is clicked', () => {
    render(<About />);
    const burgerButton = screen.getByLabelText('burger');
    const navMenu = screen.getByRole('navigation');
    expect(navMenu).not.toHaveClass('open');

    fireEvent.click(burgerButton);
    expect(navMenu).toHaveClass('open');

    fireEvent.click(burgerButton);
    expect(navMenu).not.toHaveClass('open');
  });

  test('sectionRef correctly references the section element', () => {
    render(<About />);
    const sectionElement = screen.getByTestId('about-section');
    expect(sectionElement).toBeInTheDocument();
  });

  describe('IntersectionObserver useEffect', () => {
    test('creates an IntersectionObserver and observes the section', () => {
      render(<About />);
      expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);

      const observerInstance = IntersectionObserver.mock.instances[0];
      expect(observerInstance.observe).toHaveBeenCalledTimes(1);
      const sectionElement = screen.getByTestId('about-section');
      expect(observerInstance.observe).toHaveBeenCalledWith(sectionElement);
    });

    test('section becomes visible when it intersects the viewport', () => {
      render(<About />);
      const sectionElement = screen.getByTestId('about-section');
      expect(sectionElement).not.toHaveClass('visible');

      const observerInstance = IntersectionObserver.mock.instances[0];
      observerInstance.triggerIntersect(true);

      // Check visibility after triggering intersection
      setTimeout(() => {
        expect(sectionElement).toHaveClass('visible');
      }, 0);
    });

    test('cleans up IntersectionObserver on component unmount', () => {
      const { unmount } = render(<About />);
      const observerInstance = IntersectionObserver.mock.instances[0];
      const sectionElement = screen.getByTestId('about-section');

      unmount();
      expect(observerInstance.unobserve).toHaveBeenCalledWith(sectionElement);
    });
  });
});
